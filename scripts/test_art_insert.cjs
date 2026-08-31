const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://djoshusyzfsndnmwpoxd.supabase.co';
const supabaseKey = 'sb_publishable_AGmD3MCDM_5-9yqQuqnDLw_WDAIfNGp';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testArticleInsert() {
  const { data, error } = await supabase
    .from('articles')
    .insert([
      {
        slug: 'test-article-slug-check',
        title_bn: 'টেস্ট আর্টিকেল',
        published: true
      }
    ])
    .select();
  console.log('Article insert result:', data, error);
}

testArticleInsert();
