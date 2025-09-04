const { supabaseAdmin } = require('./src/config/supabase');
const AuthUtils = require('./src/utils/authUtils');

async function testPassword() {
  // Get the latest user
  const { data: users, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .order('id', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error fetching user:', error);
    return;
  }

  const user = users[0];
  console.log('User:', user.email);
  console.log('Stored password hash:', user.password);

  // Test password validation
  const plainPassword = 'harrison'; // This should be the password used during registration
  const isPasswordValid = await AuthUtils.validatePassword(plainPassword, user.password);
  
  console.log('Plain password:', plainPassword);
  console.log('Is password valid:', isPasswordValid);
}

testPassword();