const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://djoshusyzfsndnmwpoxd.supabase.co';
const supabaseKey = 'sb_publishable_AGmD3MCDM_5-9yqQuqnDLw_WDAIfNGp';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  // Check if categories exists
  const { data: catCheck, error: catCheckErr } = await supabase.from('categories').select('*');
  console.log('Categories check:', catCheck, catCheckErr);

  // Try to create or find category 'বিজ্ঞানভিত্তিক'
  const { data: catInsert, error: catInsertErr } = await supabase
    .from('categories')
    .insert([
      {
        name_bn: 'বিজ্ঞানভিত্তিক',
        name_en: 'Scientific',
        slug: 'scientific',
        description_bn: 'কুরআনের বিজ্ঞানভিত্তিক বিশ্লেষণ ও মহাজাগতিক অপারেটিং সিস্টেম ফ্রেমওয়ার্ক।',
        description_en: 'Scientific analysis of the Quran and Cosmic Operating System framework.'
      }
    ])
    .select();
  console.log('Category insert result:', catInsert, catInsertErr);
}

testInsert();
