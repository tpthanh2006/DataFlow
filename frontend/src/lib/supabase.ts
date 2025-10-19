import { createClient } from "@supabase/supabase-js";

// Supabase client
const supabaseURL: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey: string = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseURL, supabaseKey);
