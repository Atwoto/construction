// Simple health check API endpoint
export default function handler(req, res) {
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

  // Health check response
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    message: "Construction CRM API is working!",
    url: req.url,
    method: req.method,
  });
}
