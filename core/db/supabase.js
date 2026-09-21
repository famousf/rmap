//import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://aeefhltgqubjtnxjgsgc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlZWZobHRncXVianRueGpnc2djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NjA2NjAsImV4cCI6MjA5ODIzNjY2MH0.TLYp9PgRHxp_uD13_HWPqXvuUxzlHbFKAXfAkLZG0Ok";

const client = supabase.createClient(supabaseUrl, supabaseAnonKey)
