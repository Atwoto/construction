const { supabase } = require('./src/config/supabase');

async function debugFindByEmail(email) {
  console.log('Debugging findByEmail for:', email);
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    console.log('Query result - Data:', data);
    console.log('Query result - Error:', error);
    
    if (error) {
      console.log('Error code:', error.code);
      if (error.code === 'PGRST116') {
        console.log('No rows found - returning null');
        return null;
      }
      console.error('Database error in User.findByEmail:', error);
      return null;
    }

    console.log('User found - returning user object');
    return data;
  } catch (error) {
    console.error('Exception in findByEmail:', error);
    return null;
  }
}

// Test with the email that's not working
debugFindByEmail('ndekeharrison8@gmail.com');