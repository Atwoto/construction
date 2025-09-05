const axios = require('axios');
require('dotenv').config();

async function testHealth() {
  try {
    console.log('Testing health endpoint...');
    
    // Make health check request to deployed app
    const response = await axios.get('https://construction-crm-6do1.onrender.com/health');
    
    console.log('Health check successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    if (error.response) {
      console.error('Health check failed with status:', error.response.status);
      console.error('Error data:', error.response.data);
    } else {
      console.error('Health check failed:', error.message);
    }
  }
}

async function testLogin() {
  try {
    console.log('Testing login...');
    
    // Login data
    const loginData = {
      email: 'admin@example.com',
      password: 'SecurePass123!'
    };
    
    console.log('Attempting to login with:', loginData.email);
    
    // Make login request to deployed app
    const response = await axios.post('https://construction-crm-6do1.onrender.com/api/auth/login', loginData);
    
    console.log('Login successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    if (error.response) {
      console.error('Login failed with status:', error.response.status);
      console.error('Error data:', error.response.data);
    } else {
      console.error('Login failed:', error.message);
    }
  }
}

// Run both tests
testHealth().then(() => testLogin());