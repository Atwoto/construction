// Simple API router for Vercel serverless functions
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

  const { url, method } = req;

  // Route to specific handlers
  if (url === "/api/health") {
    return res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      message: "Construction CRM API is running!",
      environment: process.env.NODE_ENV || "development",
    });
  }

  // For now, return a generic response for all other routes
  res.status(200).json({
    message: "Construction CRM API",
    url,
    method,
    timestamp: new Date().toISOString(),
    note: "Individual endpoints are being set up...",
  });
}
