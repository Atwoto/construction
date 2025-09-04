const User = require('./src/models/User');

async function testFindByEmailMethod() {
  try {
    const email = 'ndekeharrison8@gmail.com';
    
    // Use the exact same method as in the login controller
    const user = await User.findByEmail(email);
    
    if (user) {
      console.log('User found via findByEmail:', user.email);
      console.log('User object:', JSON.stringify(user, null, 2));
    } else {
      console.log('User not found via findByEmail');
    }
  } catch (error) {
    console.error('Error in findByEmail:', error);
  }
}

testFindByEmailMethod();