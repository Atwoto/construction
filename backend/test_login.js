// Simple test to check what happens with login
const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login through API...');
    
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'apiuser@example.com',
      password: 'apipassword123'
    });
    
    console.log('Login response:', response.data);
    console.log('Status code:', response.status);
  } catch (error) {
    console.error('Login failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testLogin();