// Simple test to check what happens with registration
const axios = require('axios');

async function testRegistration() {
  try {
    console.log('Testing registration through API...');
    
    const response = await axios.post('http://localhost:5001/api/auth/register', {
      email: 'apiuser@example.com',
      password: 'apipassword123',
      firstName: 'API',
      lastName: 'User',
      role: 'employee'
    });
    
    console.log('Registration response:', response.data);
    console.log('Status code:', response.status);
  } catch (error) {
    console.error('Registration failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testRegistration();