// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pcowrpiskokwgepbdeqa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjb3dycGlza29rd2dlcGJkZXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwOTQ2MDIsImV4cCI6MjA0OTY3MDYwMn0.XReFXDiT5ceON9om1eNaa3AjxMJnVZ-eZW0f4l0pt7c";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);