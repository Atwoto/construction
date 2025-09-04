// Verification script to check all test endpoints
const fs = require('fs');
const path = require('path');

console.log('Verifying all test endpoints...');

// List of expected test files
const expectedFiles = [
  'api/test-logger.js',
  'api/test-project-stats.js',
  'api/test-project-controller.js',
  'api/test-auth.js',
  'frontend/src/api-connection-test.js',
  'frontend/src/dashboard-endpoint-test.js',
  'frontend/src/auth-debug-test.js',
  'frontend/src/final-verification-test.js'
];

let allFilesExist = true;

// Check if all test files exist
for (const file of expectedFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} is missing`);
    allFilesExist = false;
  }
}

// Check package.json files
const packageFiles = [
  'package.json',
  'frontend/package.json',
  'backend/package.json',
  'api/package.json'
];

for (const file of packageFiles) {
  if (fs.existsSync(file)) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      JSON.parse(content);
      console.log(`✅ ${file} is valid JSON`);
    } catch (error) {
      console.log(`❌ ${file} has invalid JSON: ${error.message}`);
      allFilesExist = false;
    }
  } else {
    console.log(`❌ ${file} is missing`);
    allFilesExist = false;
  }
}

// Check vercel.json
if (fs.existsSync('vercel.json')) {
  try {
    const content = fs.readFileSync('vercel.json', 'utf8');
    JSON.parse(content);
    console.log(`✅ vercel.json is valid JSON`);
  } catch (error) {
    console.log(`❌ vercel.json has invalid JSON: ${error.message}`);
    allFilesExist = false;
  }
} else {
  console.log(`❌ vercel.json is missing`);
  allFilesExist = false;
}

if (allFilesExist) {
  console.log('\n✅ All verification checks passed!');
  console.log('The application should now deploy correctly to Vercel.');
} else {
  console.log('\n❌ Some verification checks failed!');
  console.log('Please check the missing or invalid files before deploying.');
  process.exit(1);
}