const axios = require('axios');

// Test the API with authentication
async function testApiWithAuth() {
  try {
    console.log('Testing API connection with authentication...');
    
    const baseUrl = 'http://localhost:5000/api';
    
    // First, let's try to log in
    console.log('Attempting to log in...');
    const loginResponse = await axios.post(`${baseUrl}/auth/login`, {
      email: 'ngcoboharry12@gmail.com',  // Using the correct email
      password: 'harrison'              // Using the correct password
    });
    
    console.log('Login successful');
    const token = loginResponse.data.data.token;
    console.log('Token received:', token);
    
    // Now use the token to access the clients endpoint
    console.log('Making request to clients endpoint...');
    const clientsResponse = await axios.get(`${baseUrl}/clients`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 5000
    });
    
    console.log('Clients API Response Status:', clientsResponse.status);
    console.log('Total clients found:', clientsResponse.data.data.clients.length);
    console.log('First client:', JSON.stringify(clientsResponse.data.data.clients[0], null, 2));
  } catch (error) {
    console.error('API Error:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Headers:', error.response.headers);
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testApiWithAuth();