import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://ckgsdkifvijxxvjlhsaa.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrZ3Nka2lmdmlqeHh2amxoc2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxODM3NzMsImV4cCI6MjA3NTc1OTc3M30.LJbz72FcVn_noVND3siBIKlpF-Yv_CtNBIHKQP3ttTI';

export const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
