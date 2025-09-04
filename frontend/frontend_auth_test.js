// Frontend Auth Test Script
// This script tests the frontend authentication flow by making direct API calls

const axios = require('axios');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5001/api';
let tokens = {
  access_token: null,
  refresh_token: null
};

console.log('Frontend Auth Test Script');
console.log('========================');
console.log(`API Base URL: ${API_BASE_URL}`);
console.log('');

// Test registration
async function testRegistration() {
  console.log('Testing Registration...');
  console.log('----------------------');
  
  const testData = {
    email: 'frontendtest@example.com',
    password: 'frontendpassword123',
    firstName: 'Frontend',
    lastName: 'Test',
    role: 'employee'
  };
  
  try {
    console.log('Sending registration request...');
    const response = await axios.post(`${API_BASE_URL}/auth/register`, testData);
    
    console.log('✅ Registration successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // Store tokens if provided
    if (response.data.token && response.data.refreshToken) {
      tokens.access_token = response.data.token;
      tokens.refresh_token = response.data.refreshToken;
      console.log('🔑 Tokens stored successfully');
    }
    
    return response.data;
  } catch (error) {
    console.log('❌ Registration failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
    throw error;
  }
}

// Test login
async function testLogin() {
  console.log('\nTesting Login...');
  console.log('---------------');
  
  const testData = {
    email: 'frontendtest@example.com',
    password: 'frontendpassword123'
  };
  
  try {
    console.log('Sending login request...');
    const response = await axios.post(`${API_BASE_URL}/auth/login`, testData);
    
    console.log('✅ Login successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // Store tokens if provided
    if (response.data.token && response.data.refreshToken) {
      tokens.access_token = response.data.token;
      tokens.refresh_token = response.data.refreshToken;
      console.log('🔑 Tokens stored successfully');
    }
    
    return response.data;
  } catch (error) {
    console.log('❌ Login failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
    throw error;
  }
}

// Test get profile (requires authentication)
async function testGetProfile() {
  console.log('\nTesting Get Profile...');
  console.log('--------------------');
  
  if (!tokens.access_token) {
    console.log('❌ No access token available. Please login first.');
    return;
  }
  
  try {
    console.log('Sending profile request...');
    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });
    
    console.log('✅ Profile retrieval successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.log('❌ Profile retrieval failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
    throw error;
  }
}

// Test logout
async function testLogout() {
  console.log('\nTesting Logout...');
  console.log('----------------');
  
  if (!tokens.access_token) {
    console.log('❌ No access token available. Please login first.');
    return;
  }
  
  try {
    console.log('Sending logout request...');
    const response = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });
    
    console.log('✅ Logout successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // Clear tokens
    tokens.access_token = null;
    tokens.refresh_token = null;
    console.log('🔑 Tokens cleared');
    
    return response.data;
  } catch (error) {
    console.log('❌ Logout failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
    throw error;
  }
}

// Run all tests
async function runAllTests() {
  try {
    // Test registration
    await testRegistration();
    
    // Test login
    await testLogin();
    
    // Test get profile
    await testGetProfile();
    
    // Test logout
    await testLogout();
    
    console.log('\n🎉 All tests completed successfully!');
  } catch (error) {
    console.log('\n💥 Some tests failed. Check the output above for details.');
  }
}

// Run individual test based on command line arguments
async function runTest() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node frontend_auth_test.js [test]');
    console.log('Available tests: register, login, profile, logout, all');
    console.log('Example: node frontend_auth_test.js register');
    return;
  }
  
  const test = args[0];
  
  try {
    switch (test) {
      case 'register':
        await testRegistration();
        break;
      case 'login':
        await testLogin();
        break;
      case 'profile':
        await testGetProfile();
        break;
      case 'logout':
        await testLogout();
        break;
      case 'all':
        await runAllTests();
        break;
      default:
        console.log(`Unknown test: ${test}`);
        console.log('Available tests: register, login, profile, logout, all');
    }
  } catch (error) {
    console.log(`Test "${test}" failed.`);
  }
}

// If this script is run directly, execute the tests
if (require.main === module) {
  runTest();
}

module.exports = {
  testRegistration,
  testLogin,
  testGetProfile,
  testLogout,
  runAllTests
};