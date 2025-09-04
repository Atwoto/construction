// Comprehensive test for all dashboard API endpoints
async function runDashboardAPITest() {
  const results = {
    timestamp: new Date().toISOString(),
    tests: {}
  };

  // Helper function to test an endpoint
  async function testEndpoint(url, name) {
    try {
      console.log(`Testing ${name} endpoint: ${url}`);
      const response = await fetch(url);
      
      const result = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      };
      
      // Try to read response body
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          result.data = await response.json();
        } else {
          result.text = await response.text();
        }
      } catch (parseError) {
        result.parseError = parseError.message;
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'network_error'
      };
    }
  }

  try {
    // Test 1: Health check (no auth required)
    results.tests.health = await testEndpoint('/api/health', 'Health Check');

    // Test 2: Project stats (auth required)
    results.tests.projectStats = await testEndpoint('/api/projects/stats', 'Project Stats');

    // Test 3: Client stats (auth required)
    results.tests.clientStats = await testEndpoint('/api/clients/stats', 'Client Stats');

    // Test 4: Projects list (auth required)
    results.tests.projects = await testEndpoint('/api/projects?limit=1', 'Projects List');

    // Test 5: Clients list (auth required)
    results.tests.clients = await testEndpoint('/api/clients?limit=1', 'Clients List');

    // Test 6: Auth status
    results.tests.authStatus = await testEndpoint('/api/auth/profile', 'Auth Profile');

    return results;
  } catch (error) {
    return {
      timestamp: new Date().toISOString(),
      error: error.message,
      tests: {}
    };
  }
}

// Run the test and display results
runDashboardAPITest().then(results => {
  console.log('Dashboard API Test Results:', results);
  
  // Display results in the UI
  const resultsDiv = document.getElementById('test-results');
  if (resultsDiv) {
    // Format the results for better readability
    const formattedResults = {
      timestamp: results.timestamp,
      summary: {
        totalTests: Object.keys(results.tests).length,
        passedTests: Object.values(results.tests).filter(test => test.success).length,
        failedTests: Object.values(results.tests).filter(test => !test.success).length
      },
      tests: {}
    };

    // Process each test result
    for (const [key, value] of Object.entries(results.tests)) {
      formattedResults.tests[key] = {
        name: key,
        success: value.success,
        status: value.status,
        statusText: value.statusText
      };
      
      if (!value.success) {
        formattedResults.tests[key].error = value.error || value.data?.message || value.text || 'Unknown error';
      }
    }

    resultsDiv.innerHTML = `
      <h3>Dashboard API Test Results</h3>
      <div style="margin-bottom: 20px;">
        <strong>Summary:</strong> ${formattedResults.summary.passedTests}/${formattedResults.summary.totalTests} tests passed
      </div>
      <pre>${JSON.stringify(formattedResults, null, 2)}</pre>
    `;
  }
  
  // Also log to console for detailed inspection
  console.log('Detailed dashboard test results:', results);
});