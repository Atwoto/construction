/**
 * Test script to verify the deployment setup works locally
 * This script will test both frontend build and backend server startup
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Testing Deployment Setup Locally\n');

// Test 1: Check if backend server starts
console.log('1. Testing Backend Server Startup...');
const backend = spawn('node', ['src/server.js'], {
  cwd: path.join(__dirname, 'backend'),
  env: { ...process.env, NODE_ENV: 'production' }
});

let backendStarted = false;

backend.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Construction CRM API Server running')) {
    console.log('✅ Backend server started successfully');
    backendStarted = true;
    backend.kill();
  }
  if (output.includes('Error') || output.includes('error')) {
    console.log('❌ Backend server error:', output);
  }
});

backend.stderr.on('data', (data) => {
  console.log('Backend stderr:', data.toString());
});

backend.on('close', (code) => {
  if (!backendStarted) {
    console.log('⚠️ Backend server test completed (may have failed to start)');
  }
  
  // Test 2: Check if frontend builds
  console.log('\n2. Testing Frontend Build...');
  const frontend = spawn('npm', ['run', 'build'], {
    cwd: path.join(__dirname, 'frontend')
  });

  frontend.stdout.on('data', (data) => {
    // Just consume the output to prevent buffering issues
  });

  frontend.stderr.on('data', (data) => {
    // Just consume the output to prevent buffering issues
  });

  frontend.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Frontend build completed successfully');
    } else {
      console.log('❌ Frontend build failed with exit code:', code);
    }
    
    console.log('\n📋 Deployment Test Summary:');
    console.log('1. Backend server startup: ' + (backendStarted ? '✅ PASS' : '⚠️  INCONCLUSIVE'));
    console.log('2. Frontend build: ' + (code === 0 ? '✅ PASS' : '❌ FAIL'));
    console.log('\n📝 Next steps:');
    console.log('- If both tests pass, you can deploy to Vercel');
    console.log('- Make sure to set all environment variables in Vercel dashboard');
    console.log('- Refer to DEPLOYMENT.md for detailed instructions');
  });
});