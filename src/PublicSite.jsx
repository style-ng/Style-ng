import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
import { articles } from '../data/articles.js';

export default function PublicSite() {
  const [services, setServices] = useState([]);
  const [zones, setZones] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [stylistsLoading, setStylistsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [priceEstimate, setPriceEstimate] = useState({ visible: false, serviceLine: '', zoneLine: '', totalLine: '' });
  const [toast, setToast] = useState({ visible: false, msg: '' });

  // Booking form refs
  const fnameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const serviceRef = useRef(null);
  const dateRef = useRef(null);
  const timeRef = useRef(null);
  const zoneRef = useRef(null);
  const stylistIdRef = useRef(null);
  const addressRef = useRef(null);
  const notesRef = useRef(null);
  const bookSubmitBtnRef = useRef(null);

  // Stylist application form refs
  const sfnameRef = useRef(null);
  const sphoneRef = useRef(null);
  const sspecialtyRef = useRef(null);
  const sexperienceRef = useRef(null);
  const sareaRef = useRef(null);
  const sportfolioRef = useRef(null);
  const snotesRef = useRef(null);
  const stylistSubmitBtnRef = useRef(null);

  const showToast = (msg) => {
    setToast({ visible: true, msg });
    setTimeout(() => setToast({ visible: false, msg: '' }), 3500);
  };

  const addToCart = (name) => showToast(`✓ ${name} added to cart`);

  // Load services, zones, stylists, products on mount
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('services').select('id, name, price_naira');
      if (!error && data) setServices(data);
    })();

    (async () => {
      const { data, error } = await supabase.from('zones').select('id, name, fee_naira').order('fee_naira');
      if (!error && data) setZones(data);
    })();

    (async () => {
      const { data, error } = await supabase.from('stylists').select('*').eq('available', true).order('name');
      setStylists(!error && data ? data : []);
      setStylistsLoading(false);
    })();

    (async () => {
      const { data, error } = await supabase.from('products').select('*').eq('active', true).order('sort_order');
      setProducts(!error && data ? data : []);
      setProductsLoading(false);
    })();
  }, []);

  // Nav scroll shrink
  useEffect(() => {
    const nav = document.getElementById('nav');
    const onScroll = () => {
      if (nav) nav.style.padding = window.scrollY > 60 ? '.8rem 4rem' : '1.25rem 4rem';
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hamburger menu + close-on-link-click
  useEffect(() => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const toggle = () => navLinks?.classList.toggle('open');
    hamburger?.addEventListener('click', toggle);
    const links = document.querySelectorAll('.nav-links a');
    const closeNav = () => navLinks?.classList.remove('open');
    links.forEach(a => a.addEventListener('click', closeNav));
    return () => {
      hamburger?.removeEventListener('click', toggle);
      links.forEach(a => a.removeEventListener('click', closeNav));
    };
  }, []);

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.12 });
    const els = document.querySelectorAll('.reveal');
    els.forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 0.1 + 's';
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [stylists, products]);

  // Min date + responsive book-section layout
  useEffect(() => {
    if (dateRef.current) dateRef.current.min = new Date().toISOString().split('T')[0];
    const fixBookLayout = () => {
      const bookSection = document.getElementById('book');
      const inner = bookSection?.firstElementChild;
      if (!inner) return;
      inner.style.gridTemplateColumns = window.innerWidth <= 900 ? '1fr' : '1fr 1fr';
    };
    fixBookLayout();
    window.addEventListener('resize', fixBookLayout);
    return () => window.removeEventListener('resize', fixBookLayout);
  }, []);

  // Live price estimate as service/zone selection changes
  const updatePriceEstimate = () => {
    const serviceId = serviceRef.current?.value;
    const zoneId = zoneRef.current?.value;
    const service = services.find(s => s.id === serviceId);
    const zone = zones.find(z => z.id === zoneId);
    if (!service && !zone) { setPriceEstimate({ visible: false, serviceLine: '', zoneLine: '', totalLine: '' }); return; }
    const servicePrice = service ? service.price_naira : 0;
    const zoneFee = zone ? zone.fee_naira : 0;
    const total = servicePrice + zoneFee;
    setPriceEstimate({
      visible: true,
      serviceLine: service ? `${service.name}: ₦${servicePrice.toLocaleString()}` : 'Select a service',
      zoneLine: zone ? `Travel to ${zone.name}: +₦${zoneFee.toLocaleString()}` : '',
      totalLine: (service && zone) ? `Estimated total: ₦${total.toLocaleString()}` : '',
    });
  };

  // Booking form submit  -  saves a real appointment to the database
  const handleSubmit = async (e) => {
    e.preventDefault();
    const btn = bookSubmitBtnRef.current;
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const serviceId = serviceRef.current.value || null;
    const service = services.find(s => s.id === serviceId);
    const zoneId = zoneRef.current.value || null;
    const zone = zones.find(z => z.id === zoneId);
    const stylistId = stylistIdRef.current.value || null;
    const preferredStylist = stylists.find(s => s.id === stylistId);
    const servicePrice = service ? service.price_naira : 0;
    const zoneFee = zone ? zone.fee_naira : 0;

    const payload = {
      client_name: fnameRef.current.value,
      phone: phoneRef.current.value,
      email: emailRef.current.value,
      service_id: serviceId,
      appt_date: dateRef.current.value,
      appt_time: timeRef.current.value,
      zone_id: zoneId,
      stylist_id: stylistId,
      address: addressRef.current.value,
      notes: notesRef.current.value,
      amount_naira: service ? servicePrice + zoneFee : null,
      status: 'pending',
    };

    const { error } = await supabase.from('appointments').insert(payload);

    btn.textContent = originalText;
    btn.disabled = false;

    if (error) {
      console.error(error);
      showToast('⚠ Something went wrong. Please try again or WhatsApp us.');
      return;
    }

    showToast('✓ Appointment request sent! Opening WhatsApp to confirm…');

    const dateStr = payload.appt_date
      ? new Date(payload.appt_date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';
    const waMessage = `Hi Style NG! I just booked an appointment on your website:\n\n` +
      `Name: ${payload.client_name}\n` +
      `Service: ${service ? service.name : 'Not specified'}\n` +
      `Date: ${dateStr}\n` +
      `Time: ${payload.appt_time}\n` +
      `Area: ${zone ? zone.name : 'Not specified'}\n` +
      `Preferred Stylist: ${preferredStylist ? preferredStylist.name : 'No preference'}\n` +
      `Address: ${payload.address || 'Not provided'}\n` +
      (payload.amount_naira ? `Estimated total: ₦${payload.amount_naira.toLocaleString()}\n` : '') +
      `\nPlease confirm my appointment. Thank you!`;
    const waUrl = `https://wa.me/2347066301079?text=${encodeURIComponent(waMessage)}`;

    e.target.reset();
    setPriceEstimate({ visible: false, serviceLine: '', zoneLine: '', totalLine: '' });
    setTimeout(() => { window.open(waUrl, '_blank'); }, 900);
  };

  // Stylist application form submit
  const handleStylistSubmit = async (e) => {
    e.preventDefault();
    const btn = stylistSubmitBtnRef.current;
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const payload = {
      full_name: sfnameRef.current.value,
      phone: sphoneRef.current.value,
      specialty: sspecialtyRef.current.value,
      years_experience: sexperienceRef.current.value,
      area: sareaRef.current.value,
      portfolio_link: sportfolioRef.current.value,
      notes: snotesRef.current.value,
      status: 'pending',
    };

    const { error } = await supabase.from('stylist_applications').insert(payload);

    btn.textContent = originalText;
    btn.disabled = false;

    if (error) {
      console.error(error);
      showToast('⚠ Something went wrong. Please try again or WhatsApp us.');
      return;
    }

    showToast('✓ Application sent! Opening WhatsApp to follow up…');

    const waMessage = `Hi Style NG! I'd like to apply as a stylist:\n\n` +
      `Name: ${payload.full_name}\n` +
      `Specialty: ${payload.specialty}\n` +
      `Experience: ${payload.years_experience}\n` +
      `Area: ${payload.area}\n` +
      (payload.portfolio_link ? `Portfolio: ${payload.portfolio_link}\n` : '') +
      `\nLooking forward to hearing back!`;
    const waUrl = `https://wa.me/2347066301079?text=${encodeURIComponent(waMessage)}`;

    e.target.reset();
    setTimeout(() => { window.open(waUrl, '_blank'); }, 900);
  };

  return (
    <div className="public-site">



    <nav id="nav">
      <a href="#" className="nav-logo">Style<span>.</span>NG</a>
      <ul className="nav-links" id="navLinks">
        <li><a href="#services">Services</a></li>
        <li><a href="#stylists">Stylists</a></li>
        <li><a href="#products">Products</a></li>
        <li><a href="#testimonials">Testimonials</a></li>
        <li><a href="#learn">Learn</a></li>
        <li><a href="#join-stylist">Join as Stylist</a></li>
        <li><a href="#book" className="nav-cta">Book Now</a></li>
      </ul>
      <button className="nav-hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </nav>


    <section className="hero" id="home">
      <div className="hero-left">
        <div className="hero-eyebrow">Lagos Mobile Salon</div>
        <h1>Premium Hair,<br /><em>At Your Door.</em></h1>
        <p>Style NG brings five-star salon expertise directly to your home. Professional stylists, premium products, and a seamless experience  -  anywhere in Lagos.</p>
        <div className="hero-actions">
          <a href="#book" className="btn-primary">Book a Session</a>
          <a href="#services" className="btn-ghost">
            Explore Services
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
      <div className="hero-right">
        <img src="https://placehold.co/800x900/2a2418/C9A84C?text=Style+NG" alt="Style NG Mobile Salon" className="hero-img" />
        <div className="hero-stats">
          <div className="stat-pill">500+ Happy Clients</div>
          <div className="stat-pill">All Lagos LGAs</div>
        </div>
        <div className="hero-badge">
          <strong>Certified Stylists</strong>
          <span>Vetted · Insured · Professional</span>
        </div>
      </div>
    </section>


    <section id="services">
      <div className="container">
        <div className="section-label">What We Offer</div>
        <h2 className="section-title">Our Signature Services</h2>
        <p className="section-sub">Comprehensive professional hair care tailored to your unique needs  -  delivered to your doorstep across Lagos.</p>
      </div>
      <div className="container">
        <div className="services-grid">
          <div className="service-card reveal">
            <div className="service-num">01</div>
            <h3>Precision Haircuts &amp; Styling</h3>
            <p>Expert cuts for all hair types  -  from classic trims to modern restyles, blowouts and event updos.</p>
            <div className="service-tags">
              <span className="service-tag">Wash &amp; Cut</span>
              <span className="service-tag">Men's &amp; Kids'</span>
              <span className="service-tag">Updos</span>
            </div>
          </div>
          <div className="service-card reveal">
            <div className="service-num">02</div>
            <h3>Vibrant Hair Coloring &amp; Highlights</h3>
            <p>Transform your look with professional coloring techniques for stunning, long-lasting results.</p>
            <div className="service-tags">
              <span className="service-tag">Balayage</span>
              <span className="service-tag">Ombré</span>
              <span className="service-tag">Color Correction</span>
            </div>
          </div>
          <div className="service-card reveal">
            <div className="service-num">03</div>
            <h3>Natural Hair Care &amp; Styling</h3>
            <p>Specialized care for natural textures, promoting health, strength, and versatile protective styling.</p>
            <div className="service-tags">
              <span className="service-tag">Deep Conditioning</span>
              <span className="service-tag">Braids &amp; Locs</span>
              <span className="service-tag">Silk Press</span>
            </div>
          </div>
          <div className="service-card reveal">
            <div className="service-num">04</div>
            <h3>Luxury Extensions &amp; Wig Services</h3>
            <p>Seamless application and expert maintenance of premium hair extensions and custom wig installations.</p>
            <div className="service-tags">
              <span className="service-tag">Tape-ins</span>
              <span className="service-tag">Microlinks</span>
              <span className="service-tag">Wig Customization</span>
            </div>
          </div>
          <div className="service-card reveal">
            <div className="service-num">05</div>
            <h3>Bridal &amp; Special Event Hair</h3>
            <p>Exquisite bridal hair and glamorous styles for any special occasion, designed to make you shine.</p>
            <div className="service-tags">
              <span className="service-tag">Bridal Trials</span>
              <span className="service-tag">Bridesmaid</span>
              <span className="service-tag">Photoshoot</span>
            </div>
          </div>
          <div className="service-card reveal">
            <div className="service-num">06</div>
            <h3>Virtual Consultations &amp; Hair Coaching</h3>
            <p>Personalized advice and expert guidance from the comfort of your home  -  online or in-person.</p>
            <div className="service-tags">
              <span className="service-tag">Regimen Planning</span>
              <span className="service-tag">DIY Tips</span>
              <span className="service-tag">Product Advice</span>
            </div>
          </div>
        </div>
      </div>
    </section>


    <section id="how">
      <div className="container">
        <div className="section-label">Simple Process</div>
        <h2 className="section-title">How It Works</h2>
        <p className="section-sub">Getting salon-quality hair care at home has never been easier. Three steps to your best hair day.</p>
        <div className="steps">
          <div className="step reveal">
            <div className="step-num">1</div>
            <h3>Choose Your Service</h3>
            <p>Browse our full range of professional services and select what suits your hair goals  -  or pick from our product catalogue.</p>
          </div>
          <div className="step reveal">
            <div className="step-num">2</div>
            <h3>Schedule &amp; Confirm</h3>
            <p>Pick a convenient date and time using our easy booking form. We confirm within hours and send a reminder.</p>
          </div>
          <div className="step reveal">
            <div className="step-num">3</div>
            <h3>Relax &amp; Enjoy</h3>
            <p>Our certified stylist arrives at your home with all equipment. Sit back and enjoy your transformation.</p>
          </div>
        </div>
      </div>
    </section>


    <section id="stylists">
      <div className="container">
        <div className="section-label">Our Team</div>
        <h2 className="section-title">Meet Our Expert Stylists</h2>
        <p className="section-sub">Highly skilled, vetted, and passionate  -  our stylists bring the salon to you with professionalism and care.</p>
        <div className="stylists-grid" id="stylistsGrid">{stylistsLoading ? (
            <p style={{ color: '#7A7470' }}>Loading stylists…</p>
          ) : stylists.length === 0 ? (
            <p style={{ color: '#7A7470' }}>No stylists available right now.</p>
          ) : stylists.map(s => (
            <div className="stylist-card reveal" key={s.id}>
              <img src={s.img || 'https://placehold.co/400x500/2a2418/C9A84C?text=' + encodeURIComponent(s.name || '?')} alt={s.name} className="stylist-img" />
              <div className="stylist-info">
                <h3>{s.name}</h3>
                <div className="stylist-role">{s.role || ''}</div>
                <p className="stylist-bio">{s.bio || ''}</p>
              </div>
            </div>
          ))}</div>
      </div>
    </section>


    <section id="join-stylist" style={{padding: '0'}}>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
        <div className="book-left">
          <div className="section-label">For Stylists</div>
          <h2 className="section-title">Bring Your Chair to Style NG</h2>
          <p>You bring the skill  -  we bring the bookings. Join a growing network of Lagos stylists getting discovered by real clients, every week.</p>
          <div className="book-perks">
            <div className="perk">
              <div className="perk-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              Free to join  -  no listing or monthly fees
            </div>
            <div className="perk">
              <div className="perk-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              </div>
              Clients pay before you arrive, via Paystack
            </div>
            <div className="perk">
              <div className="perk-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              Set your own prices, hours and specialties
            </div>
            <div className="perk">
              <div className="perk-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22.01h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z"/></svg>
              </div>
              Questions? WhatsApp us: +234 706 630 1079
            </div>
          </div>
        </div>
        <div className="book-right">
          <h2 className="section-title">Apply as a Stylist</h2>
          <form id="stylistForm" onSubmit={handleStylistSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sfname">Full Name</label>
                <input type="text" id="sfname" ref={sfnameRef} placeholder="Your full name" required />
              </div>
              <div className="form-group">
                <label htmlFor="sphone">Phone / WhatsApp</label>
                <input type="tel" id="sphone" ref={sphoneRef} placeholder="+234 800 000 0000" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="sspecialty">Specialty</label>
              <select id="sspecialty" ref={sspecialtyRef} required>
                <option value=""> -  Select a Specialty  - </option>
                <option>Natural Hair Care</option>
                <option>Braids &amp; Locs</option>
                <option>Hair Coloring</option>
                <option>Extensions &amp; Wigs</option>
                <option>Bridal Styling</option>
                <option>Barbing</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sexperience">Years of Experience</label>
                <select id="sexperience" ref={sexperienceRef} required>
                  <option value=""> -  Select  - </option>
                  <option>Less than 1 year</option>
                  <option>1–2 years</option>
                  <option>3–5 years</option>
                  <option>6–10 years</option>
                  <option>10+ years</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="sarea">Your Area (Lagos)</label>
                <input type="text" id="sarea" ref={sareaRef} placeholder="e.g. Ijanikin, Festac, Lekki" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="sportfolio">Instagram / Portfolio Link (optional)</label>
              <input type="text" id="sportfolio" ref={sportfolioRef} placeholder="@yourhandle or link to your work" />
            </div>
            <div className="form-group">
              <label htmlFor="snotes">Anything Else? (optional)</label>
              <textarea id="snotes" ref={snotesRef} placeholder="Certifications, availability, or anything you'd like us to know…"></textarea>
            </div>
            <button type="submit" className="btn-submit" ref={stylistSubmitBtnRef}>Submit Application</button>
          </form>
        </div>
      </div>
    </section>


    <section id="products">
      <div className="container">
        <div className="section-label">Our Shop</div>
        <h2 className="section-title">Premium Hair Products</h2>
        <p className="section-sub">Salon-grade products curated by our stylists and delivered right to your door across Lagos.</p>
        <div className="products-grid" id="productsGrid">{productsLoading ? (
            <p style={{ color: '#7A7470' }}>Loading products…</p>
          ) : products.length === 0 ? (
            <p style={{ color: '#7A7470' }}>No products available right now.</p>
          ) : products.map(p => (
            <div className="product-card reveal" key={p.id}>
              <img src={p.img || 'https://placehold.co/300x300/ede8de/8B6914?text=' + encodeURIComponent(p.name)} alt={p.name} className="product-img" />
              <div className="product-info">
                <h3>{p.name}</h3>
                <p>{p.description || ''}</p>
              </div>
              <div className="product-footer">
                <span className="product-price">₦{p.price_naira.toLocaleString()}</span>
                <button className="btn-add" onClick={() => addToCart(p.name)}>Add to Cart</button>
              </div>
            </div>
          ))}</div>
        <div style={{textAlign: 'center', marginTop: '3rem'}}>
          <a href="#" className="btn-primary">View All Products</a>
        </div>
      </div>
    </section>


    <section id="testimonials">
      <div className="container">
        <div className="section-label">Client Stories</div>
        <h2 className="section-title">What Our Clients Say</h2>
        <p className="section-sub">Real experiences from real clients across Lagos who've made Style NG their go-to hair service.</p>
        <div className="testi-grid">
          <div className="testi-card reveal">
            <div className="stars">★★★★★</div>
            <p>Style NG made getting my hair done so easy and convenient! The stylist was professional, friendly, and my hair looks absolutely amazing. Highly recommend!</p>
            <div className="testi-author">
              <strong>Sarah L.</strong>
              <span>Victoria Island, Lagos</span>
            </div>
          </div>
          <div className="testi-card reveal">
            <div className="stars">★★★★★</div>
            <p>I used to dread salon visits, but with Style NG, it's a genuine joy. They brought the full salon experience right to my living room. Fantastic service!</p>
            <div className="testi-author">
              <strong>Biodun A.</strong>
              <span>Ikeja, Lagos</span>
            </div>
          </div>
          <div className="testi-card reveal">
            <div className="stars">★★★★★</div>
            <p>The best mobile hair service I've ever experienced. My balayage is perfect and the convenience is unbeatable. Style NG is absolutely my new go-to!</p>
            <div className="testi-author">
              <strong>Temi F.</strong>
              <span>Lekki Phase 1, Lagos</span>
            </div>
          </div>
          <div className="testi-card reveal">
            <div className="stars">★★★★★</div>
            <p>As a busy mum, Style NG is a true lifesaver. Quality cut, great conversation, and I never had to leave the house. Cannot thank them enough!</p>
            <div className="testi-author">
              <strong>Nkechi O.</strong>
              <span>Surulere, Lagos</span>
            </div>
          </div>
        </div>
      </div>
    </section>


    <section id="learn">
      <div className="container">
        <div className="section-label">Education</div>
        <h2 className="section-title">Learn &amp; Grow with Style NG</h2>
        <p className="section-sub">Expert tips, tutorials, and masterclasses to elevate your hair care knowledge and achieve salon results at home.</p>
        <div className="learn-grid">
          {articles.map(a => (
            <RouterLink to={`/learn/${a.slug}`} className="learn-card reveal" key={a.slug} style={{ textDecoration: 'none', display: 'block' }}>
              <img src={a.image} alt={a.title} className="learn-img" />
              <div className="learn-body">
                <div className="learn-cat">{a.category}</div>
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
                <span className="learn-link">{a.cta.label}</span>
              </div>
            </RouterLink>
          ))}
        </div>
        <div style={{textAlign: 'center', marginTop: '3rem'}}>
          <RouterLink to="/learn" className="btn-primary">Explore All Resources</RouterLink>
        </div>
      </div>
    </section>


    <section id="book" style={{padding: '0'}}>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
        <div className="book-left">
          <div className="section-label">Reserve Your Slot</div>
          <h2 className="section-title">Book Your Home Hair Appointment</h2>
          <p>Fill in the form and we'll confirm your appointment within hours. Our stylist arrives fully equipped  -  no salon trip needed.</p>
          <div className="book-perks">
            <div className="perk">
              <div className="perk-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              Available across all Lagos LGAs
            </div>
            <div className="perk">
              <div className="perk-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              All stylists are vetted &amp; insured
            </div>
            <div className="perk">
              <div className="perk-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              Flexible scheduling  -  7 days a week
            </div>
            <div className="perk">
              <div className="perk-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22.01h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z"/></svg>
              </div>
              WhatsApp confirmation: +234 706 630 1079
            </div>
          </div>
        </div>
        <div className="book-right">
          <h2 className="section-title">Request an Appointment</h2>
          <form id="bookForm" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fname">Full Name</label>
                <input type="text" id="fname" ref={fnameRef} placeholder="Your full name" required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" ref={phoneRef} placeholder="+234 800 000 0000" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" ref={emailRef} placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="service">Desired Service</label>
              <select id="service" ref={serviceRef} required onChange={updatePriceEstimate}><>
                  <option value=""> -  Select a Service  - </option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name}  -  ₦{s.price_naira.toLocaleString()}</option>
                  ))}
                  <option value="">Other (please specify in notes)</option>
                </></select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Preferred Date</label>
                <input type="date" id="date" ref={dateRef} required />
              </div>
              <div className="form-group">
                <label htmlFor="time">Preferred Time</label>
                <input type="time" id="time" ref={timeRef} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="zone">Your Area (Lagos)</label>
              <select id="zone" ref={zoneRef} required onChange={updatePriceEstimate}><>
                  <option value=""> -  Select Your Area  - </option>
                  {zones.map(z => (
                    <option key={z.id} value={z.id}>{z.name}  -  +₦{z.fee_naira.toLocaleString()} travel fee</option>
                  ))}
                </></select>
            </div>
            <div className="form-group">
              <label htmlFor="stylistPref">Preferred Stylist (optional)</label>
              <select id="stylistPref" ref={stylistIdRef}>
                <option value="">No preference  -  any available stylist</option>
                {stylists.map(s => (
                  <option key={s.id} value={s.id}>{s.name}{s.role ? `  -  ${s.role}` : ''}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="address">Full Address</label>
              <input type="text" id="address" ref={addressRef} placeholder="Street, Estate (e.g. 12 Palm Ave, Lekki Phase 1)" required />
            </div>
            {priceEstimate.visible && (
              <div className="form-group" style={{ background: 'rgba(201,168,76,.08)', border: '1px solid var(--border)', padding: '.9rem 1rem', fontSize: '.85rem', color: 'var(--warm-gray)' }}>
                {priceEstimate.serviceLine}
                {priceEstimate.zoneLine && (<><br />{priceEstimate.zoneLine}</>)}
                {priceEstimate.totalLine && (<><br /><strong>{priceEstimate.totalLine}</strong></>)}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="notes">Additional Notes (optional)</label>
              <textarea id="notes" ref={notesRef} placeholder="Any specific requests, hair concerns, or details…"></textarea>
            </div>
            <button type="submit" className="btn-submit" ref={bookSubmitBtnRef}>Request Appointment</button>
          </form>
        </div>
      </div>
    </section>


    <footer id="contact">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <a href="#" className="nav-logo">Style<span>.</span>NG</a>
            <p>Your premier mobile and online hair salon, bringing professional styling, products, and education to your doorstep across all of Lagos, Nigeria.</p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="#" aria-label="TikTok">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.41a8.16 8.16 0 004.77 1.52V7.49a4.85 4.85 0 01-1-.8z"/></svg>
              </a>
              <a href="https://wa.me/2347066301079" aria-label="WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.529 5.855L.057 23.5l5.79-1.516A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 110-19.636 9.818 9.818 0 010 19.636z"/></svg>
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><a href="#services">Haircuts &amp; Styling</a></li>
              <li><a href="#services">Hair Coloring</a></li>
              <li><a href="#services">Natural Hair Care</a></li>
              <li><a href="#services">Extensions &amp; Wigs</a></li>
              <li><a href="#services">Bridal Hair</a></li>
              <li><a href="#services">Virtual Consultations</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#stylists">Our Stylists</a></li>
              <li><a href="#join-stylist">Join as a Stylist</a></li>
              <li><a href="#products">Shop Products</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#learn">Learn &amp; Grow</a></li>
              <li><a href="#book">Book Appointment</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <div className="footer-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>hello@styleng.com.ng</span>
            </div>
            <div className="footer-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22.01h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z"/></svg>
              <span>+234 706 630 1079</span>
            </div>
            <div className="footer-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>All LGAs · Lagos, Nigeria</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Style NG. All rights reserved.</span>
          <span>Designed with care · Lagos, Nigeria</span>
        </div>
      </div>
    </footer>


    <div id="toast" className={toast.visible ? 'show' : ''}>{toast.msg}</div>


    </div>
  );
}
