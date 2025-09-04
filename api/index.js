// Main API handler for Vercel serverless functions
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
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
  console.log(`API Request: ${method} ${url}`);

  try {
    // Health check endpoint
    if (url === "/api/health") {
      return res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        message: "Construction CRM API is running!",
        environment: process.env.NODE_ENV || "development",
      });
    }

    // Login endpoint
    if (url === "/api/auth/login") {
      if (method === "GET") {
        return res.status(200).json({
          message: "Login endpoint is working",
          method: "GET",
          note: "Use POST with email and password to login",
          timestamp: new Date().toISOString(),
        });
      }

      if (method === "POST") {
        console.log("Login POST request received:", {
          body: req.body,
          headers: req.headers,
          contentType: req.headers["content-type"],
        });

        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({
            success: false,
            error: "Email and password are required",
            receivedBody: req.body,
          });
        }

        // Initialize Supabase client
        const supabase = createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        // Find user by email
        const { data: user, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("email", email.toLowerCase())
          .single();

        if (userError || !user) {
          return res.status(401).json({
            success: false,
            error: "Invalid email or password",
          });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({
            success: false,
            error: "Invalid email or password",
          });
        }

        // Generate JWT tokens
        const accessToken = jwt.sign(
          {
            userId: user.id,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
        );

        const refreshToken = jwt.sign(
          { userId: user.id },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
        );

        // Remove password from user object
        const { password: _, ...userWithoutPassword } = user;

        // Return success response
        return res.status(200).json({
          success: true,
          data: {
            user: userWithoutPassword,
            token: accessToken,
            refreshToken: refreshToken,
          },
        });
      }
    }

    // Debug endpoint
    if (url === "/api/debug") {
      return res.status(200).json({
        message: "API Debug Endpoint",
        method,
        url,
        headers: req.headers,
        body: req.body,
        query: req.query,
        timestamp: new Date().toISOString(),
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          SUPABASE_URL: process.env.SUPABASE_URL ? "Set" : "Not Set",
          JWT_SECRET: process.env.JWT_SECRET ? "Set" : "Not Set",
        },
      });
    }

    // Default response for unmatched routes
    res.status(404).json({
      error: "Route not found",
      message: `Cannot ${method} ${url}`,
      availableRoutes: ["/api/health", "/api/auth/login", "/api/debug"],
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
}
