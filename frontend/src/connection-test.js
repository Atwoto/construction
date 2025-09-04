// Simple test to verify frontend-backend connection
const testConnection = async () => {
  try {
    console.log('Testing frontend-backend connection...');
    
    // Try to fetch from the backend API
    const response = await fetch('/api/health');
    const data = await response.json();
    
    console.log('API Response:', data);
    
    if (data.status === 'OK') {
      console.log('✅ Connection successful!');
    } else {
      console.log('❌ Connection failed!');
    }
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
};

// Run the test
testConnection();