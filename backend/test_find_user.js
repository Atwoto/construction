const User = require('./src/models/User');

async function testFindUser() {
  try {
    // Try to find the user by email
    const email = 'harryson@gmail.com';
    const user = await User.findByEmail(email);
    
    if (user) {
      console.log('User found:', user.email);
      console.log('User password:', user.password);
      console.log('User object:', JSON.stringify(user, null, 2));
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.error('Error finding user:', error);
  }
}

testFindUser();