const User = require('./src/models/User');
const AuthUtils = require('./src/utils/authUtils');

async function testUserFlow() {
  try {
    console.log('Testing user creation and authentication flow...');
    
    // Test user data
    const testUser = {
      email: 'test@example.com',
      password: 'TestPass123!',
      first_name: 'Test',
      last_name: 'User',
      role: 'employee'  // Changed from 'user' to 'employee'
    };
    
    console.log('Creating test user...');
    
    // Create user
    const newUser = await User.create(testUser);
    console.log('User created successfully:', newUser.email);
    
    // Try to find user by email
    console.log('Finding user by email...');
    const foundUser = await User.findByEmail(testUser.email);
    console.log('User found:', foundUser ? foundUser.email : 'Not found');
    
    // Test password validation
    if (foundUser) {
      console.log('Validating password...');
      const isPasswordValid = await AuthUtils.validatePassword(testUser.password, foundUser.password);
      console.log(`Password validation result: ${isPasswordValid}`);
    }
    
    // Clean up - delete test user
    if (newUser) {
      console.log('Cleaning up test user...');
      await newUser.delete();
      console.log('Test user deleted');
    }
    
    console.log('User flow test completed successfully');
  } catch (error) {
    console.error('User flow test failed:', error);
  }
}

testUserFlow();