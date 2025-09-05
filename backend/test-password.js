const AuthUtils = require('./src/utils/authUtils');
const User = require('./src/models/User');

async function testPasswordHandling() {
  try {
    console.log('Testing password hashing and validation...');
    
    // Test password hashing
    const plainPassword = 'TestPass123!';
    console.log(`Plain password: ${plainPassword}`);
    
    const hashedPassword = await AuthUtils.hashPassword(plainPassword);
    console.log(`Hashed password: ${hashedPassword}`);
    
    // Test password validation
    const isValid = await AuthUtils.validatePassword(plainPassword, hashedPassword);
    console.log(`Password validation result: ${isValid}`);
    
    // Test with wrong password
    const isInvalid = await AuthUtils.validatePassword('WrongPassword', hashedPassword);
    console.log(`Wrong password validation result: ${isInvalid}`);
    
    console.log('Password handling test completed successfully');
  } catch (error) {
    console.error('Password handling test failed:', error);
  }
}

testPasswordHandling();