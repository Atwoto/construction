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
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Company Name</th>
            <th>Contact Person</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.companyName}</td>
              <td>{client.contactPerson}</td>
              <td>{client.email}</td>
              <td>{client.phone}</td>
              <td>{client.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleClientTable;