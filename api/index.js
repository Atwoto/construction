// Simple health check for now to test deployment
module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Health check endpoint
  if (req.url === "/api/health" || req.url === "/health") {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      message: "API is working!",
      url: req.url,
      method: req.method,
    });
    return;
  }

  // Default response
  res.status(200).json({
    message: "Construction CRM API",
    status: "OK",
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method,
  });
};
