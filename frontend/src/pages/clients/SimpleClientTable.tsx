import React, { useState, useEffect } from "react";
import { clientService } from "../../services/clientService";

const SimpleClientTable: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      console.log("Fetching clients...");
      const response = await clientService.getClients({ 
        page: 1, 
        limit: 100,
        sortBy: "companyName",
        sortOrder: "ASC"
      });
      console.log("Clients response:", response);
      setClients(response.clients);
      setError(null);
    } catch (err: any) {
      console.error("Error loading clients:", err);
      setError(err.message || "Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading clients...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Simple Client Table</h1>
      <p>Total clients: {clients.length}</p>
      <table style={{ border: "1px solid black", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "5px" }}>ID</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Company Name</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Contact Person</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Email</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Phone</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td style={{ border: "1px solid black", padding: "5px" }}>{client.id}</td>
              <td style={{ border: "1px solid black", padding: "5px" }}>{client.companyName}</td>
              <td style={{ border: "1px solid black", padding: "5px" }}>{client.contactPerson}</td>
              <td style={{ border: "1px solid black", padding: "5px" }}>{client.email}</td>
              <td style={{ border: "1px solid black", padding: "5px" }}>{client.phone}</td>
              <td style={{ border: "1px solid black", padding: "5px" }}>{client.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleClientTable;