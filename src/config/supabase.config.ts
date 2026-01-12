import { createClient } from '@supabase/supabase-js';

// Configuração Supabase (substitua com suas credenciais)
export const SUPABASE_URL = 'https://qkjoowicfajbtfwraedx.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFram9vd2ljZmFqYnRmd3JhZWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzODgwODQsImV4cCI6MjA4MDk2NDA4NH0.sD0i1_F-CKB_3IzW6YTNHRg82-nFf3e4vKBE0vQps2A';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
