const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Create express app
const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://construction-six-lovat.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Construction CRM API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    supabase: !!supabase,
  });
});

// Test Supabase connection
app.get("/test-supabase", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("count(*)")
      .limit(1);

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        details: error,
      });
    }

    res.json({
      success: true,
      message: "Supabase connection successful",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Projects endpoints
app.get("/projects", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post("/projects", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .insert([req.body])
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      data: data[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Clients endpoints
app.get("/clients", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Auth endpoints
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("API Error:", error);
  res.status(500).json({
    success: false,
    error: error.message || "Internal server error",
  });
});

// Export for serverless
module.exports = app;
module.exports.handler = serverless(app);
