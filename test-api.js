const axios = require('axios');

const testAPI = async () => {
  try {
    console.log('Testing API connectivity...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('Health check:', healthResponse.data);
    
    if (healthResponse.data.status === 'OK') {
      console.log('✅ Backend API is running correctly');
    } else {
      console.log('❌ Backend health check failed');
    }
  } catch (error) {
    console.error('❌ API connection failed:', error.message);
  }
};

// Run the test
testAPI();