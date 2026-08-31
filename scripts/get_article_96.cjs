const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://djoshusyzfsndnmwpoxd.supabase.co';
const supabaseKey = 'sb_publishable_AGmD3MCDM_5-9yqQuqnDLw_WDAIfNGp';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getSurah96Article() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', 'af2abdef-942e-459b-ae0b-414b93b56c8d')
    .single();

  console.log('Article 96:', JSON.stringify(data, null, 2), error);
}

getSurah96Article();
