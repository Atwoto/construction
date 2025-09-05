# Construction CRM - Test Pages

This directory contains several test pages to help diagnose and debug issues with the Construction CRM application.

## Available Test Pages

### 1. Comprehensive API Test
- **URL**: `/comprehensive-test.html`
- **Purpose**: Tests all API endpoints used by the application
- **Features**: 
  - Health check
  - Project stats
  - Client stats
  - Authentication status
  - Error reporting

### 2. Dashboard Endpoint Test
- **URL**: `/dashboard-endpoint-test.html`
- **Purpose**: Tests the specific endpoints used by the dashboard to retrieve data
- **Features**:
  - Health check
  - Authentication token verification
  - Project statistics
  - Client statistics
  - Custom test endpoints

### 3. Authentication Debug Test
- **URL**: `/auth-debug.html`
- **Purpose**: Tests authentication tokens and headers
- **Features**:
  - Token storage verification
  - Header inspection
  - Current user endpoint test

### 4. Final Verification
- **URL**: `/final-verification.html`
- **Purpose**: Runs a final verification to confirm all components are working
- **Features**:
  - Complete system check
  - Success/failure reporting
  - Troubleshooting guidance

## How to Use

1. Make sure you're logged into the Construction CRM application
2. Navigate to any of the test pages using the URLs above
3. Review the results to identify any issues
4. Use the troubleshooting guidance to resolve problems

## Accessing Test Pages

The test pages can be accessed in two ways:

1. **From the main dashboard**: Click the test buttons in the bottom-right corner
2. **Direct URL access**: Navigate directly to the test page URLs

## Troubleshooting

If tests are failing:

1. Check that you're logged into the application
2. Verify that all environment variables are properly set
3. Check the browser console for detailed error messages
4. Ensure the backend API is running and accessible
5. Confirm that authentication tokens are being stored correctly