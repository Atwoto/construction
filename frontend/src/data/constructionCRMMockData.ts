// Mock data for Construction CRM UI components

import { ProjectStatus, ClientStatus, PriorityLevel } from '../types/enums';

export const mockStore = {
  user: {
    id: '1',
    firstName: 'John',
    lastName: 'Smith', 
    email: 'john.smith@constructioncrm.com',
    role: 'Project Manager',
    avatar: null,
    isAuthenticated: true
  },
  theme: {
    mode: 'light' as const,
    primaryColor: '#2563eb',
    accentColor: '#f59e0b'
  }
};

export const mockQuery = {
  projectStats: {
    activeProjects: 12,
    completedProjects: 8,
    onHoldProjects: 3,
    totalBudget: 2450000,
    totalRevenue: 1890000,
    averageProgress: 67.5
  },
  clientStats: {
    totalClients: 45,
    activeClients: 32,
    leads: 15,
    opportunities: 8,
    conversionRate: 73.2,
    overdueFollowUps: 3,
    totalEstimatedValue: 3200000
  },
  recentActivity: [
    {
      id: '1',
      action: 'New project created',
      project: 'Downtown Office Complex',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'project' as const
    },
    {
      id: '2', 
      action: 'Invoice sent',
      project: 'Residential Villa',
      time: new Date(Date.now() - 4 * 60 * 60 * 1000),
      type: 'invoice' as const
    },
    {
      id: '3',
      action: 'Team member added', 
      project: 'Shopping Center',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000),
      type: 'team' as const
    },
    {
      id: '4',
      action: 'Project completed',
      project: 'Warehouse Expansion', 
      time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      type: 'completion' as const
    }
  ],
  upcomingDeadlines: [
    {
      id: '1',
      project: 'City Hall Renovation',
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'urgent' as const
    },
    {
      id: '2',
      project: 'Bridge Construction',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 
      status: 'warning' as const
    },
    {
      id: '3',
      project: 'School Building',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'normal' as const
    },
    {
      id: '4',
      project: 'Hospital Wing',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'normal' as const
    }
  ]
};

export const mockRootProps = {
  currentUser: mockStore.user,
  dashboardData: mockQuery
};