// Final verification test
async function finalVerificationTest() {
  const results = {
    timestamp: new Date().toISOString(),
    tests: {}
  };

  try {
    // Test 1: Health check
    const healthResponse = await fetch('/api/health');
    results.tests.health = {
      success: healthResponse.ok,
      status: healthResponse.status
    };

    // Test 2: Logger test
    const loggerResponse = await fetch('/api/test-logger');
    results.tests.logger = {
      success: loggerResponse.ok,
      status: loggerResponse.status
    };

    // Test 3: Supabase connection test
    const supabaseResponse = await fetch('/api/test-supabase');
    results.tests.supabase = {
      success: supabaseResponse.ok,
      status: supabaseResponse.status
    };

    // Test 4: Project stats test
    const projectStatsResponse = await fetch('/api/test-project-stats');
    results.tests.projectStats = {
      success: projectStatsResponse.ok,
      status: projectStatsResponse.status
    };

    // Overall success
    const allTestsPassed = Object.values(results.tests).every(test => test.success);
    
    results.overall = {
      success: allTestsPassed,
      message: allTestsPassed 
        ? '✅ All tests passed! The application should now be working correctly.' 
        : '❌ Some tests failed. Please check the individual test results above.'
    };

    return results;
  } catch (error) {
    return {
      timestamp: new Date().toISOString(),
      error: error.message,
      tests: {},
      overall: {
        success: false,
        message: '❌ Test execution failed: ' + error.message
      }
    };
  }
}

// Run the test and display results
finalVerificationTest().then(results => {
  console.log('Final Verification Test Results:', results);
  
  // Display results in the UI
  const resultsDiv = document.getElementById('test-results');
  if (resultsDiv) {
    resultsDiv.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <h2 style="color: ${results.overall.success ? '#28a745' : '#dc3545'};">
          ${results.overall.message}
        </h2>
        <div style="margin-top: 20px; text-align: left;">
          <h3>Test Results:</h3>
          <pre>${JSON.stringify(results.tests, null, 2)}</pre>
        </div>
        ${!results.overall.success ? `
          <div style="margin-top: 20px; padding: 15px; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px;">
            <h4>🔧 Troubleshooting Steps:</h4>
            <ol>
              <li>Check that all environment variables are properly set in Vercel</li>
              <li>Verify that the Supabase connection details are correct</li>
              <li>Make sure you're logged in to the application</li>
              <li>Check the browser console for any JavaScript errors</li>
              <li>Verify that the API endpoints are accessible</li>
            </ol>
          </div>
        ` : ''}
      </div>
    `;
  }
});