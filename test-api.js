const axios = require('axios');

// Test the API directly
async function testApi() {
  try {
    console.log('Testing API connection...');
    
    // Using the correct API URL for your local environment
    const apiUrl = 'http://localhost:5000/api/clients';
    
    console.log('Making request to:', apiUrl);
    
    const response = await axios.get(apiUrl, {
      timeout: 5000 // 5 second timeout
    });
    
    console.log('API Response Status:', response.status);
    console.log('API Response Headers:', response.headers);
    console.log('API Response Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('API Error:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Headers:', error.response.headers);
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received. Request details:');
      console.error('Request:', error.request);
    }
  }
}

testApi();