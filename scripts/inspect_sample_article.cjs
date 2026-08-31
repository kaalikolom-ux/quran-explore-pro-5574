const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://djoshusyzfsndnmwpoxd.supabase.co';
const supabaseKey = 'sb_publishable_AGmD3MCDM_5-9yqQuqnDLw_WDAIfNGp';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectOne() {
  const { data: articles } = await supabase.from('articles').select('*').limit(2);
  console.log('Sample Article:', JSON.stringify(articles, null, 2));
}

inspectOne();
