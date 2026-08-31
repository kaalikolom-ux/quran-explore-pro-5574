const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://djoshusyzfsndnmwpoxd.supabase.co';
const supabaseKey = 'sb_publishable_AGmD3MCDM_5-9yqQuqnDLw_WDAIfNGp';

const supabase = createClient(supabaseUrl, supabaseKey);

async function printContent() {
  const { data } = await supabase
    .from('articles')
    .select('title_bn, content_bn, excerpt_bn')
    .eq('id', 'af2abdef-942e-459b-ae0b-414b93b56c8d')
    .single();

  console.log('Title:', data.title_bn);
  console.log('Excerpt:', data.excerpt_bn);
  console.log('Content (first 500 chars):', data.content_bn.slice(0, 500));
}

printContent();
