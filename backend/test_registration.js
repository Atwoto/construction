const User = require('./src/models/User');
const AuthUtils = require('./src/utils/authUtils');

async function testRegistration() {
  try {
    console.log('Testing user registration...');
    
    const userData = {
      email: 'testuser@example.com',
      password: 'testpassword123',
      first_name: 'Test',
      last_name: 'User',
      role: 'employee'
    };

    console.log('Creating user with data:', userData);
    
    const user = await User.create(userData);
    console.log('User created successfully:', user.email);
  } catch (error) {
    console.error('Registration failed:', error);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

testRegistration();