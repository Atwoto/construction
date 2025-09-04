// Simple script to test API connectivity
const testAPI = async () => {
  try {
    console.log('Testing API connectivity...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:5000/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    
    if (healthData.status === 'OK') {
      console.log('✅ Backend API is running correctly');
    } else {
      console.log('❌ Backend health check failed');
    }
  } catch (error) {
    console.error('❌ API connection failed:', error);
  }
};

// Run the test
testAPI();