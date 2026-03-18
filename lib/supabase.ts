import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://sua-url-supabase.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sua-chave-anon-supabase';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // You can use AsyncStorage here for React Native
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
