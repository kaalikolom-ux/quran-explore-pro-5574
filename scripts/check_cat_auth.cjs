const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://djoshusyzfsndnmwpoxd.supabase.co';
const supabaseKey = 'sb_publishable_AGmD3MCDM_5-9yqQuqnDLw_WDAIfNGp';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDetails() {
  const { data: categories } = await supabase.from('categories').select('*');
  console.log('Categories:', JSON.stringify(categories, null, 2));

  const { data: authors } = await supabase.from('authors').select('*');
  console.log('Authors:', JSON.stringify(authors, null, 2));
}

checkDetails();
