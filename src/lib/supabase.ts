import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Cliente para operações do servidor (com service role key)
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Cliente para operações do cliente (com anon key)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey); 