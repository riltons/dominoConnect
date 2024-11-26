import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://rdoqhdzwxdhdfomhmrof.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkb3FoZHp3eGRoZGZvbWhtcm9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1Nzk1MDgsImV4cCI6MjA0ODE1NTUwOH0.iHObRSiKocxT-CzCDR4LscX4-pTdKohOjs6624lvPTA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
