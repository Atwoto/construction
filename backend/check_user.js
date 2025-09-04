const { supabaseAdmin } = require('./src/config/supabase');

async function checkUser() {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .order('id', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error fetching user:', error);
    return;
  }

  console.log('Latest user:', JSON.stringify(data[0], null, 2));
}

checkUser();