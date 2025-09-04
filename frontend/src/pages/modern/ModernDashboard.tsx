import React from 'react';
import { useNavigate } from 'react-router-dom';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import WelcomeSection from '../../components/modern/WelcomeSection';
import ModernCard from '../../components/modern/ModernCard';
import StatsCard from '../../components/modern/StatsCard';
import ActivityList from '../../components/modern/ActivityList';
import DeadlineList from '../../components/modern/DeadlineList';
import QuickActions from '../../components/modern/QuickActions';
import { mockQuery, mockStore } from '../../data/constructionCRMMockData';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { DropdownMenuItem } from '../../components/ui/DropdownMenu';

const ModernDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleQuickAction = (href: string) => {
    navigate(href);
  };

  const { projectStats, clientStats, recentActivity, upcomingDeadlines } = mockQuery;
  const { user } = mockStore;

  const statsData = [
    {
      title: 'Active Projects',
      value: projectStats.activeProjects,
      icon: <LocationCityOutlinedIcon />,
      trend: { value: 12.5, isPositive: true },
      onClick: () => navigate('/projects'),
    },
    {
      title: 'Total Clients',
      value: clientStats.totalClients,
      icon: <PeopleOutlinedIcon />,
      trend: { value: 8.3, isPositive: true },
      onClick: () => navigate('/clients'),
    },
    {
      title: 'Completed Projects',
      value: projectStats.completedProjects,
      icon: <CheckCircleOutlinedIcon />,
      trend: { value: 15.2, isPositive: true },
      onClick: () => navigate('/projects?status=completed'),
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(projectStats.totalRevenue),
      icon: <AttachMoneyIcon />,
      trend: { value: 23.1, isPositive: true },
      onClick: () => navigate('/reports'),
    },
  ];

  const clientMenu = (
    <>
      <DropdownMenuItem onClick={() => navigate('/clients')}>View all clients</DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate('/clients/new')}>Add new client</DropdownMenuItem>
      <DropdownMenuItem>Export client data</DropdownMenuItem>
    </>
  );

  const projectMenu = (
    <>
      <DropdownMenuItem onClick={() => navigate('/projects')}>View all projects</DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate('/projects/new')}>Create new project</DropdownMenuItem>
      <DropdownMenuItem>Export project data</DropdownMenuItem>
    </>
  );

  const activityMenu = (
    <>
      <DropdownMenuItem>View all activity</DropdownMenuItem>
      <DropdownMenuItem>Filter activity</DropdownMenuItem>
    </>
  );

  const deadlineMenu = (
    <>
      <DropdownMenuItem>View all deadlines</DropdownMenuItem>
      <DropdownMenuItem>Open calendar view</DropdownMenuItem>
    </>
  );

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-6">
      <div className="flex flex-col gap-6">
        <WelcomeSection user={user} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              onClick={stat.onClick}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModernCard
            title="Client Insights"
            subtitle="Overview of your client pipeline"
            menu={clientMenu}
          >
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 border hover:bg-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <PeopleOutlinedIcon className="w-5 h-5 text-blue-600" />
                    <p className="text-2xl font-bold text-blue-600">{clientStats.leads}</p>
                  </div>
                  <p className="text-xs text-gray-500">Leads</p>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 border hover:bg-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUpIcon className="w-5 h-5 text-yellow-600" />
                    <p className="text-2xl font-bold text-yellow-600">{clientStats.opportunities}</p>
                  </div>
                  <p className="text-xs text-gray-500">Opportunities</p>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 border hover:bg-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircleOutlinedIcon className="w-5 h-5 text-green-600" />
                    <p className="text-2xl font-bold text-green-600">{formatPercentage(clientStats.conversionRate)}</p>
                  </div>
                  <p className="text-xs text-gray-500">Conversion Rate</p>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 border hover:bg-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <WarningAmberIcon className="w-5 h-5 text-red-600" />
                    <p className="text-2xl font-bold text-red-600">{clientStats.overdueFollowUps}</p>
                  </div>
                  <p className="text-xs text-gray-500">Overdue Follow-ups</p>
                </div>
              </div>
              {clientStats.totalEstimatedValue > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-xl font-bold text-gray-800">{formatCurrency(clientStats.totalEstimatedValue)}</p>
                  <p className="text-sm text-gray-500">Total Pipeline Value</p>
                </div>
              )}
            </div>
          </ModernCard>

          <ModernCard
            title="Project Insights"
            subtitle="Current project status overview"
            menu={projectMenu}
          >
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 border hover:bg-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <LocationCityOutlinedIcon className="w-5 h-5 text-blue-600" />
                            <p className="text-2xl font-bold text-blue-600">{projectStats.activeProjects}</p>
                        </div>
                        <p className="text-xs text-gray-500">In Progress</p>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 border hover:bg-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircleOutlinedIcon className="w-5 h-5 text-green-600" />
                            <p className="text-2xl font-bold text-green-600">{projectStats.completedProjects}</p>
                        </div>
                        <p className="text-xs text-gray-500">Completed</p>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 border hover:bg-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <WarningAmberIcon className="w-5 h-5 text-yellow-600" />
                            <p className="text-2xl font-bold text-yellow-600">{projectStats.onHoldProjects}</p>
                        </div>
                        <p className="text-xs text-gray-500">On Hold</p>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 border hover:bg-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUpIcon className="w-5 h-5 text-indigo-600" />
                            <p className="text-2xl font-bold text-indigo-600">{formatPercentage(projectStats.averageProgress)}</p>
                        </div>
                        <p className="text-xs text-gray-500">Average Progress</p>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-xl font-bold text-gray-800">{formatCurrency(projectStats.totalRevenue)}</p>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                </div>
            </div>
          </ModernCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModernCard
            title="Recent Activity"
            subtitle="Latest updates from your projects"
            menu={activityMenu}
          >
            <ActivityList activities={recentActivity} />
          </ModernCard>

          <ModernCard
            title="Upcoming Deadlines"
            subtitle="Projects requiring attention"
            menu={deadlineMenu}
          >
            <DeadlineList deadlines={upcomingDeadlines} />
          </ModernCard>
        </div>

        <ModernCard title="Quick Actions" subtitle="Common tasks and shortcuts">
          <QuickActions onActionClick={handleQuickAction} />
        </ModernCard>
      </div>
    </div>
  );
};

export default ModernDashboard;
