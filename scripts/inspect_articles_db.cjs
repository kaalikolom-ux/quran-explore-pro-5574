const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://djoshusyzfsndnmwpoxd.supabase.co';
const supabaseKey = 'sb_publishable_AGmD3MCDM_5-9yqQuqnDLw_WDAIfNGp';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const { data: categories, error: catErr } = await supabase.from('categories').select('*');
  console.log('Categories:', categories, catErr);

  const { data: authors, error: authErr } = await supabase.from('authors').select('*');
  console.log('Authors:', authors, authErr);

  const { data: articles, error: artErr } = await supabase.from('articles').select('id, title_bn, slug, category_id, author_id, published');
  console.log('Articles:', articles, artErr);
}

inspect();
