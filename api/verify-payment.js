// Vercel serverless function.
// Runs on the server only  -  this is the ONLY place that can see the Paystack
// secret key and the Supabase service-role key. The browser never sees either.
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reference, appointment } = req.body || {};

  if (!reference || !appointment) {
    return res.status(400).json({ error: 'Missing reference or appointment data' });
  }

  try {
    // 1. Ask Paystack directly whether this reference was really paid.
    //    Never trust the amount/status the browser sends  -  verify server-side.
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data?.status !== 'success') {
      return res.status(402).json({ error: 'Payment not verified as successful' });
    }

    const paidKobo = paystackData.data.amount; // amount actually paid, in kobo
    const expectedKobo = Math.round(Number(appointment.deposit_amount_naira) * 100);

    if (paidKobo !== expectedKobo) {
      return res.status(402).json({ error: 'Paid amount does not match expected deposit' });
    }

    // 2. Payment is genuinely confirmed  -  now save the appointment.
    //    Uses the service-role key so this write is trusted, bypassing the
    //    public anon-key restrictions the browser would normally have.
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabaseAdmin
      .from('appointments')
      .insert({
        ...appointment,
        payment_reference: reference,
        payment_status: 'paid',
        status: 'pending', // still needs the salon to confirm the appointment itself
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Payment succeeded but saving the appointment failed. Please contact us with your payment reference: ' + reference });
    }

    return res.status(200).json({ success: true, appointment: data });
  } catch (err) {
    console.error('Verify-payment error:', err);
    return res.status(500).json({ error: 'Server error verifying payment' });
  }
}
