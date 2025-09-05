import React, { useState, useEffect } from "react";
import { apiClient } from "../services/authService";

const ApiTestPage: React.FC = () => {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      setLoading(true);
      console.log("Testing API connection...");
      
      // Test the clients endpoint directly
      const response = await apiClient.get('/clients');
      console.log("API Response:", response);
      setApiResponse(response.data);
      setError(null);
    } catch (err: any) {
      console.error("API Error:", err);
      setError(`Error: ${err.message}`);
      setApiResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>API Test Page</h1>
      <button onClick={testApiConnection} disabled={loading}>
        {loading ? "Testing..." : "Test API Connection"}
      </button>
      
      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          <h2>Error:</h2>
          <pre>{error}</pre>
        </div>
      )}
      
      {apiResponse && (
        <div style={{ marginTop: "10px" }}>
          <h2>API Response:</h2>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ApiTestPage;