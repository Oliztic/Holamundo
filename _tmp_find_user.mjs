import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
const env = Object.fromEntries(readFileSync('.env.local','utf8').split(/\r?\n/).filter(l=>l&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^["']|["']$/g,'')];}));
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth:{autoRefreshToken:false,persistSession:false}});
const { data, error } = await admin.auth.admin.listUsers({ page:1, perPage:1000 });
if (error) { console.error('ERR', error.message); process.exit(1); }
console.log('TOTAL', data.users.length);
data.users
  .filter(u => /oliztic|digital/i.test(u.email||''))
  .forEach(u => console.log(u.email, '| rol:', u.user_metadata?.rol||'-'));
