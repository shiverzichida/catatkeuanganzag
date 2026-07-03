import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

// Gunakan placeholder string agar build static di Next.js tidak crash ketika API Key belum diisi
const validUrl = isSupabaseConfigured ? supabaseUrl : "https://placeholder-url.supabase.co";
const validKey = isSupabaseConfigured ? supabaseAnonKey : "placeholder-key";

export const supabase = createClient(validUrl, validKey);
