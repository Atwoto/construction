const { supabase } = require('./src/config/supabase');

async function testFindByEmail() {
  try {
    const email = 'harryson@gmail.com';
    
    // Test the exact query used in findByEmail
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error) {
      console.log('Error:', error);
      if (error.code === 'PGRST116') {
        console.log('No rows found');
      }
    } else {
      console.log('Data found:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Exception:', error);
  }
}

testFindByEmail();