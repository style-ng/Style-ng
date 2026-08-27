import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mbxmueblqiazntyfwpes.supabase.co';
const SUPABASE_KEY = 'sb_publishable_oTOJKvAsVUnhHjwDuFzhMg_bze5yOTk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
