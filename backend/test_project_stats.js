// Simple test to check project stats endpoint
const axios = require('axios');

async function testProjectStats() {
  try {
    console.log('Testing project stats API...');
    
    // First login to get a token
    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'ngcoboharry12@gmail.com',
      password: 'your_password_here'  // Replace with actual password
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful, token received');
    
    // Test project stats endpoint
    const statsResponse = await axios.get('http://localhost:5001/api/projects/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Project stats response:', statsResponse.data);
    console.log('Status code:', statsResponse.status);
  } catch (error) {
    console.error('Project stats test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testProjectStats();