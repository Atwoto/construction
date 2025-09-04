// Simple test to verify API connectivity
const testAPI = async () => {
  try {
    console.log('Testing API connectivity...');
    
    // Try to fetch from the health endpoint
    const response = await fetch('/api/health');
    const data = await response.json();
    
    console.log('Health check response:', data);
    
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