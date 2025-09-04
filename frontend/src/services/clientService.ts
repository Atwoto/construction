import { apiClient } from './authService';
import { Client, ClientContact, CreateClientData, UpdateClientData, ClientStats, ClientListParams, ClientListResponse } from '../types/client';

export const clientService = {
  async getClients(params: ClientListParams): Promise<ClientListResponse> {
    try {
      console.log('🔍 Fetching clients from API with params:', params);
      const response = await apiClient.get('/clients', { params });
      console.log('✅ API response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Error fetching clients:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch clients');
    }
  },

  async getClientById(id: string): Promise<Client | null> {
    try {
      const response = await apiClient.get(`/clients/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error(`Error fetching client with id ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to fetch client');
    }
  },

  async createClient(clientData: CreateClientData): Promise<Client> {
    try {
      const response = await apiClient.post('/clients', clientData);
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating client:', error);
      throw new Error(error.response?.data?.message || 'Failed to create client');
    }
  },

  async updateClient(id: string, updates: UpdateClientData): Promise<Client> {
    try {
      const response = await apiClient.put(`/clients/${id}`, updates);
      return response.data.data;
    } catch (error: any) {
      console.error(`Error updating client with id ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to update client');
    }
  },

  async deleteClient(id: string): Promise<void> {
    try {
      await apiClient.delete(`/clients/${id}`);
    } catch (error: any) {
      console.error(`Error deleting client with id ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to delete client');
    }
  },

  async getClientContacts(clientId: string): Promise<ClientContact[]> {
    try {
      const response = await apiClient.get(`/clients/${clientId}/contacts`);
      return response.data.data || [];
    } catch (error: any) {
      console.error(`Error fetching contacts for client ${clientId}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to fetch client contacts');
    }
  },

  async addClientContact(clientId: string, contactData: Omit<ClientContact, 'id' | 'clientId'>): Promise<ClientContact> {
    try {
      const response = await apiClient.post(`/clients/${clientId}/contacts`, contactData);
      return response.data.data;
    } catch (error: any) {
      console.error('Error adding client contact:', error);
      throw new Error(error.response?.data?.message || 'Failed to add client contact');
    }
  },

  async updateClientContact(clientId: string, contactId: string, contactData: Partial<ClientContact>): Promise<ClientContact> {
    try {
      const response = await apiClient.put(`/clients/${clientId}/contacts/${contactId}`, contactData);
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating client contact:', error);
      throw new Error(error.response?.data?.message || 'Failed to update client contact');
    }
  },

  async deleteClientContact(clientId: string, contactId: string): Promise<void> {
    try {
      await apiClient.delete(`/clients/${clientId}/contacts/${contactId}`);
    } catch (error: any) {
      console.error('Error deleting client contact:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete client contact');
    }
  },

  getStatusColor(status: string): string {
    switch (status) {
      case 'lead':
        return 'bg-blue-100 text-blue-800';
      case 'opportunity':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  async getClientStats(): Promise<ClientStats> {
    try {
      console.log('📈 Fetching client stats from API');
      const response = await apiClient.get('/clients/stats');
      console.log('✅ Stats response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Error fetching client stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch client statistics');
    }
  },

  async updateClientStatus(id: string, status: string): Promise<Client> {
    try {
      const response = await apiClient.patch(`/clients/${id}/status`, { status });
      return response.data.data;
    } catch (error: any) {
      console.error(`Error updating client status for id ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to update client status');
    }
  },

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  },
};
