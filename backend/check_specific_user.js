const { supabaseAdmin } = require('./src/config/supabase');
const AuthUtils = require('./src/utils/authUtils');

async function checkSpecificUser() {
  try {
    const email = 'ndekeharrison8@gmail.com';
    
    // Get the specific user
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase());

    if (error) {
      console.error('Error fetching user:', error);
      return;
    }

    if (users.length === 0) {
      console.log('User not found');
      return;
    }

    const user = users[0];
    console.log('User found:', JSON.stringify(user, null, 2));

    // Test password validation
    const plainPassword = 'harrison';
    const isPasswordValid = await AuthUtils.validatePassword(plainPassword, user.password);
    
    console.log('Plain password:', plainPassword);
    console.log('Is password valid:', isPasswordValid);
  } catch (error) {
    console.error('Exception:', error);
  }
}

checkSpecificUser();