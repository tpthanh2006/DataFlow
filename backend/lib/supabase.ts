import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables first
dotenv.config();

// Supabase client for backend (Node.js)
const supabaseURL: string = process.env.SUPABASE_URL || "";
const supabaseKey: string = process.env.SUPABASE_ANON_KEY || "";

if (!supabaseURL || !supabaseKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_ANON_KEY",
  );
}

export const supabase = createClient(supabaseURL, supabaseKey);
