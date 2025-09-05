const axios = require('axios');

async function testApi() {
  try {
    console.log('Testing health endpoint...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:5001/health');
    console.log('Health check result:', healthResponse.data);
    
    // Test API auth endpoint
    console.log('Testing auth endpoint...');
    try {
      const authResponse = await axios.get('http://localhost:5001/api/auth/profile');
      console.log('Auth endpoint result:', authResponse.data);
    } catch (error) {
      if (error.response) {
        console.log('Auth endpoint status:', error.response.status);
        console.log('Auth endpoint error data:', error.response.data);
      } else {
        console.log('Auth endpoint error:', error.message);
      }
    }
  } catch (error) {
    if (error.response) {
      console.log('Health check failed with status:', error.response.status);
      console.log('Health check error data:', error.response.data);
    } else {
      console.log('Health check error:', error.message);
    }
  }
}

testApi();