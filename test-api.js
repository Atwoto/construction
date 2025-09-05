const axios = require('axios');

// Test the API directly
async function testApi() {
  try {
    console.log('Testing API connection...');
    
    // Replace with your actual API URL
    const apiUrl = 'http://localhost:5000/api/clients';
    
    // If you have a token, you can add it here
    // const token = 'your-jwt-token';
    
    const response = await axios.get(apiUrl, {
      // headers: {
      //   'Authorization': `Bearer ${token}`
      // }
    });
    
    console.log('API Response:', response.data);
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
  }
}

testApi();