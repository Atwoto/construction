// Test the exact endpoints used by the dashboard with proper authentication simulation
async function testDashboardEndpoints() {
  const results = {
    timestamp: new Date().toISOString(),
    tests: {}
  };

  try {
    // Test 1: Basic connectivity to API
    try {
      const response = await fetch('/api/health');
      results.tests.health = {
        success: response.ok,
        status: response.status,
        message: response.ok ? 'API is accessible' : 'API not accessible'
      };
    } catch (error) {
      results.tests.health = {
        success: false,
        error: error.message
      };
    }

    // Test 2: Check if we have auth tokens
    const accessToken = localStorage.getItem('construction_crm_access_token');
    results.tests.authTokens = {
      hasAccessToken: !!accessToken,
      tokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : null
    };

    // Test 3: Try to access protected endpoints
    if (accessToken) {
      // Test project stats
      try {
        const response = await fetch('/api/projects/stats', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        results.tests.projectStats = {
          success: response.ok,
          status: response.status,
          statusText: response.statusText
        };
        
        if (response.ok) {
          const data = await response.json();
          results.tests.projectStats.hasData = !!data.data;
          results.tests.projectStats.sampleData = data.data ? {
            totalProjects: data.data.totalProjects,
            activeProjects: data.data.activeProjects,
            completedProjects: data.data.completedProjects
          } : null;
        }
      } catch (error) {
        results.tests.projectStats = {
          success: false,
          error: error.message
        };
      }

      // Test client stats
      try {
        const response = await fetch('/api/clients/stats', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        results.tests.clientStats = {
          success: response.ok,
          status: response.status,
          statusText: response.statusText
        };
        
        if (response.ok) {
          const data = await response.json();
          results.tests.clientStats.hasData = !!data.data;
          results.tests.clientStats.sampleData = data.data ? {
            totalClients: data.data.totalClients,
            activeClients: data.data.activeClients,
            leads: data.data.leads
          } : null;
        }
      } catch (error) {
        results.tests.clientStats = {
          success: false,
          error: error.message
        };
      }
    } else {
      results.tests.projectStats = {
        success: false,
        message: 'No access token found - user may not be logged in'
      };
      
      results.tests.clientStats = {
        success: false,
        message: 'No access token found - user may not be logged in'
      };
    }

    // Test 4: Test our custom endpoints
    try {
      const loggerResponse = await fetch('/api/test-logger');
      results.tests.customLogger = {
        success: loggerResponse.ok,
        status: loggerResponse.status
      };
    } catch (error) {
      results.tests.customLogger = {
        success: false,
        error: error.message
      };
    }

    try {
      const projectStatsResponse = await fetch('/api/test-project-stats');
      results.tests.customProjectStats = {
        success: projectStatsResponse.ok,
        status: projectStatsResponse.status
      };
    } catch (error) {
      results.tests.customProjectStats = {
        success: false,
        error: error.message
      };
    }

    // Overall status
    const criticalTests = [
      results.tests.health?.success,
      accessToken ? results.tests.projectStats?.success : true,
      accessToken ? results.tests.clientStats?.success : true
    ];
    
    const allCriticalPassed = criticalTests.every(test => test !== false);
    
    results.overall = {
      success: allCriticalPassed,
      message: allCriticalPassed 
        ? '✅ All critical tests passed! Dashboard should display data correctly.' 
        : '❌ Critical tests failed. Dashboard data may not display correctly.'
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
testDashboardEndpoints().then(results => {
  console.log('Dashboard Endpoint Test Results:', results);
  
  // Display results in the UI
  const resultsDiv = document.getElementById('test-results');
  if (resultsDiv) {
    // Create a summary view
    const summary = {
      timestamp: results.timestamp,
      overall: results.overall,
      health: results.tests.health,
      auth: results.tests.authTokens,
      projectStats: results.tests.projectStats,
      clientStats: results.tests.clientStats,
      customEndpoints: {
        logger: results.tests.customLogger,
        projectStats: results.tests.customProjectStats
      }
    };

    resultsDiv.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <h2 style="color: ${results.overall.success ? '#28a745' : '#dc3545'};">
          ${results.overall.message}
        </h2>
        
        <div style="margin-top: 30px; text-align: left;">
          <h3>📋 Test Summary</h3>
          <pre>${JSON.stringify(summary, null, 2)}</pre>
        </div>
        
        ${!results.overall.success ? `
          <div style="margin-top: 20px; padding: 15px; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px;">
            <h4>🔧 Troubleshooting Steps:</h4>
            <ol>
              <li>${!results.tests.health?.success ? '❌' : '✅'} Check if the API is running and accessible</li>
              <li>${!results.tests.authTokens?.hasAccessToken ? '❌' : '✅'} Make sure you're logged in to the application</li>
              <li>${!results.tests.projectStats?.success ? '❌' : '✅'} Verify project stats endpoint is working</li>
              <li>${!results.tests.clientStats?.success ? '❌' : '✅'} Verify client stats endpoint is working</li>
              <li>Check browser console for detailed error messages</li>
              <li>Verify environment variables are set correctly in Vercel</li>
            </ol>
          </div>
        ` : ''}
      </div>
    `;
  }
});