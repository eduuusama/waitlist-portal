// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cdagzbojpgdmjaiqluqd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkYWd6Ym9qcGdkbWphaXFsdXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MzYwMTUsImV4cCI6MjA1ODUxMjAxNX0.3Bcj_N8HSgdHpPIeo8N1Dv2wxHau_EMR2J-3JoVsC5w";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);