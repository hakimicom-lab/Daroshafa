
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nfpwhilhhbrvgyuwnwtg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcHdoaWxoaGJydmd5dXdud3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4ODI5MDYsImV4cCI6MjA3OTQ1ODkwNn0.jTZ98JfcJSqj-FSM2rhV3Xn_1Zk3jlwILfGrrDHQPXo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
