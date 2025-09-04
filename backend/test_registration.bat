@echo off
echo Testing user registration...
echo.

curl -X POST http://localhost:3002/test-register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"testuser123@example.com\",\"password\":\"testpassword123\",\"firstName\":\"Test\",\"lastName\":\"User\",\"role\":\"employee\"}"

echo.
echo.
echo If you see a 'Cannot GET /' error, it means the server is not running.
echo Please run 'node test_api.js' in the backend directory first.