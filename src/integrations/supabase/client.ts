// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ssoigexjizjosyhrvsnw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzb2lnZXhqaXpqb3N5aHJ2c253Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4NjcyNzgsImV4cCI6MjA1MDQ0MzI3OH0.o2e_WvhVWawmtI_t8v1b0Nw1N7V2XRMDlxvY388WTus";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);