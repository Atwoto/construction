// Test authentication and token handling
async function testAuthAndTokens() {
  const results = {
    timestamp: new Date().toISOString(),
    tests: {}
  };

  try {
    // Test 1: Check if we have tokens stored
    results.tests.tokenStorage = {
      hasAccessToken: !!localStorage.getItem('construction_crm_access_token'),
      hasRefreshToken: !!localStorage.getItem('construction_crm_refresh_token'),
      accessToken: localStorage.getItem('construction_crm_access_token') ? 
        localStorage.getItem('construction_crm_access_token').substring(0, 20) + '...' : 
        null,
      refreshToken: localStorage.getItem('construction_crm_refresh_token') ? 
        localStorage.getItem('construction_crm_refresh_token').substring(0, 20) + '...' : 
        null
    };

    // Test 2: Check axios default headers
    results.tests.axiosHeaders = {
      hasAuthHeader: !!window.axios?.defaults?.headers?.common?.Authorization,
      authHeaderValue: window.axios?.defaults?.headers?.common?.Authorization ? 
        window.axios.defaults.headers.common.Authorization.substring(0, 20) + '...' : 
        null
    };

    // Test 3: Try to access window level axios instance if available
    if (window.axios) {
      try {
        const response = await window.axios.get('/api/health');
        results.tests.windowAxiosHealth = {
          success: response.status === 200,
          status: response.status
        };
      } catch (error) {
        results.tests.windowAxiosHealth = {
          success: false,
          error: error.message
        };
      }
    }

    // Test 4: Check current user endpoint
    try {
      const response = await fetch('/api/auth/profile');
      results.tests.currentUser = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText
      };
      
      if (response.ok) {
        const data = await response.json();
        results.tests.currentUser.user = {
          id: data.data?.user?.id,
          email: data.data?.user?.email,
          firstName: data.data?.user?.firstName,
          lastName: data.data?.user?.lastName
        };
      }
    } catch (error) {
      results.tests.currentUser = {
        success: false,
        error: error.message
      };
    }

    return results;
  } catch (error) {
    return {
      timestamp: new Date().toISOString(),
      error: error.message,
      tests: {}
    };
  }
}

// Add axios to window for debugging if it's not already there
if (typeof window !== 'undefined') {
  import('/static/js/*.js').catch(() => {
    // Ignore import errors
  });
}

// Run the test and display results
testAuthAndTokens().then(results => {
  console.log('Auth and Token Test Results:', results);
  
  // Display results in the UI
  const resultsDiv = document.getElementById('test-results');
  if (resultsDiv) {
    resultsDiv.innerHTML = `
      <h3>Authentication and Token Test Results</h3>
      <pre>${JSON.stringify(results, null, 2)}</pre>
    `;
  }
});