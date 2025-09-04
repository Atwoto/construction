import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { clientService } from "../../services/clientService";
import { Client, ClientContact } from "../../types/client";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { ClientContactForm, ClientForm } from "../../components/clients";

const ClientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteContactConfirm, setShowDeleteContactConfirm] =
    useState(false);

  const [selectedContact, setSelectedContact] = useState<ClientContact | null>(
    null
  );

  useEffect(() => {
    if (id) {
      loadClientDetails(id);
    }
  }, [id]);

  const loadClientDetails = async (clientId: string) => {
    try {
      setLoading(true);
      const clientData = await clientService.getClientById(clientId);
      setClient(clientData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load client details");
      toast.error("Failed to load client details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClient = async (clientData: Partial<Client>) => {
    if (!client) return;
    try {
      await clientService.updateClient(client.id, clientData);
      toast.success("Client updated successfully");
      setShowEditModal(false);
      loadClientDetails(client.id);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update client");
      throw err;
    }
  };

  const handleDeleteClient = async () => {
    if (!client) return;
    try {
      await clientService.deleteClient(client.id);
      toast.success("Client deleted successfully");
      // Navigate back to client list
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete client");
    }
  };

  const handleAddContact = async (
    contactData: Omit<ClientContact, "id" | "clientId">
  ) => {
    if (!client) return;
    try {
      await clientService.addClientContact(client.id, contactData);
      toast.success("Contact added successfully");
      setShowAddContactModal(false);
      loadClientDetails(client.id);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add contact");
      throw err;
    }
  };

  const handleUpdateContact = async (
    contactData: Omit<ClientContact, "id" | "clientId">
  ) => {
    if (!client || !selectedContact) return;
    try {
      await clientService.updateClientContact(
        client.id,
        selectedContact.id,
        contactData
      );
      toast.success("Contact updated successfully");
      setShowEditContactModal(false);
      loadClientDetails(client.id);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update contact");
      throw err;
    }
  };

  const handleDeleteContact = async () => {
    if (!client || !selectedContact) return;
    try {
      await clientService.deleteClientContact(client.id, selectedContact.id);
      toast.success("Contact deleted successfully");
      setShowDeleteContactConfirm(false);
      loadClientDetails(client.id);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete contact");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-12">{error}</div>;
  }

  if (!client) {
    return <div className="text-center py-12">Client not found.</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <Card.Header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {client.companyName}
          </h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowEditModal(true)}>
              Edit Client
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
              Delete Client
            </Button>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-500">Primary Contact</h4>
              <p>{client.contactPerson}</p>
              <p>{client.email}</p>
              <p>{client.phone}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-500">Location</h4>
              <p>{client.address}</p>
              <p>
                {client.city}, {client.state} {client.zipCode}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-500">Details</h4>
              <p>
                Status:{" "}
                <span
                  className={`px-2 py-1 text-xs rounded-full ${clientService.getStatusColor(client.status)}`}
                >
                  {client.status}
                </span>
              </p>
              <p>Source: {client.source}</p>
              <p>
                Assigned to: {client.assignedUser?.firstName}{" "}
                {client.assignedUser?.lastName}
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Contacts</h2>
          <Button
            variant="primary"
            onClick={() => setShowAddContactModal(true)}
          >
            Add Contact
          </Button>
        </Card.Header>
        <Card.Content>
          {client.contacts && client.contacts.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {client.contacts.map((contact) => (
                <li
                  key={contact.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {`${contact.firstName} ${contact.lastName}`}{" "}
                      {contact.isPrimary && (
                        <span className="text-xs text-green-600">
                          (Primary)
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">{contact.role}</p>
                    <p className="text-sm text-gray-500">
                      {contact.email} | {contact.phone}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedContact(contact);
                        setShowEditContactModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => {
                        setSelectedContact(contact);
                        setShowDeleteContactConfirm(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No contacts found.</p>
          )}
        </Card.Content>
      </Card>

      {/* Modals and Dialogs */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Client"
      >
        <ClientForm
          client={client}
          isEdit
          onSubmit={handleUpdateClient}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showAddContactModal}
        onClose={() => setShowAddContactModal(false)}
        title="Add New Contact"
      >
        <ClientContactForm
          onSubmit={handleAddContact}
          onCancel={() => setShowAddContactModal(false)}
        />
      </Modal>

      {selectedContact && (
        <Modal
          isOpen={showEditContactModal}
          onClose={() => setShowEditContactModal(false)}
          title="Edit Contact"
        >
          <ClientContactForm
            contact={selectedContact}
            isEdit
            onSubmit={handleUpdateContact}
            onCancel={() => setShowEditContactModal(false)}
          />
        </Modal>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteClient}
        title="Delete Client"
        message={`Are you sure you want to delete ${client.companyName}? This action cannot be undone.`}
        confirmButtonClass="btn-danger"
      />

      <ConfirmDialog
        isOpen={showDeleteContactConfirm}
        onClose={() => setShowDeleteContactConfirm(false)}
        onConfirm={handleDeleteContact}
        title="Delete Contact"
        message={`Are you sure you want to delete ${selectedContact ? `${selectedContact.firstName} ${selectedContact.lastName}` : ""}?`}
        confirmButtonClass="btn-danger"
      />
    </div>
  );
};

export default ClientDetailsPage;
