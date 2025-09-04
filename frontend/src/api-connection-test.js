// Simple test to verify frontend can connect to backend API
const testAPIConnection = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test the health endpoint
    const healthResponse = await fetch('/api/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    
    if (healthData.status === 'OK') {
      console.log('✅ Health check passed');
    } else {
      console.log('❌ Health check failed:', healthData);
    }
    
    // Test the project stats endpoint
    const statsResponse = await fetch('/api/projects/stats');
    const statsData = await statsResponse.json();
    console.log('Project stats:', statsData);
    
    if (statsData.success) {
      console.log('✅ Project stats endpoint working');
    } else {
      console.log('❌ Project stats endpoint failed:', statsData);
    }
  } catch (error) {
    console.error('❌ API connection test failed:', error);
  }
};

// Run the test
testAPIConnection();