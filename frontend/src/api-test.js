// Simple test to verify API connectivity
const testAPI = async () => {
  try {
    const response = await fetch('/api/health');
    const data = await response.json();
    console.log('API Health Check:', data);
    
    if (data.status === 'OK') {
      console.log('✅ API is running correctly');
    } else {
      console.log('❌ API health check failed');
    }
  } catch (error) {
    console.error('❌ API connection failed:', error);
  }
};

// Run the test
testAPI();