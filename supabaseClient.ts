
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ozrzqthpauiaktsmvxfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96cnpxdGhwYXVpYWt0c212eGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MDQ4NTMsImV4cCI6MjA3OTI4MDg1M30.GI8qY2o_8xECRN6iCRjn5TDdnsf_bkB3vAqqwEkC94s';

export const supabase = createClient(supabaseUrl, supabaseKey);
