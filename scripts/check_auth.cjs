const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://djoshusyzfsndnmwpoxd.supabase.co';
const supabaseKey = 'sb_publishable_AGmD3MCDM_5-9yqQuqnDLw_WDAIfNGp';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAuth() {
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('*');
  console.log('Profiles:', profiles, pErr);
  
  const { data: roles, error: rErr } = await supabase.from('user_roles').select('*');
  console.log('User roles:', roles, rErr);
}

checkAuth();
