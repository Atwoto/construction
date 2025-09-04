// Client Components
export { default as ClientCard } from './ClientCard';
export { default as ClientTable } from './ClientTable';
export { default as ClientForm } from './ClientForm';
export { default as ClientFilters } from './ClientFilters';
export { default as ClientStats } from './ClientStats';
export { default as ClientContactForm } from './ClientContactForm';

// Re-export types for convenience
export * from '../../types/client';
export { clientService } from '../../services/clientService';