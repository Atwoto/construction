import React from "react";
import { UserStats as UserStatsType } from "../../services/userService";
import LoadingSpinner from "../common/LoadingSpinner";
import Card from "../common/Card";

interface UserStatsProps {
  stats: UserStatsType | null;
  loading: boolean;
  error: string;
}

const UserStats: React.FC<UserStatsProps> = ({ stats, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <Card.Content>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            </Card.Content>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-center">
        <p>Error loading user statistics: {error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const getRoleCount = (role: string) => {
    const roleData = stats.usersByRole.find((r) => r.role === role);
    return roleData ? roleData.count : 0;
  };

  const statsData = [
    { title: "Total Users", value: stats.totalUsers, icon: "👥" },
    { title: "Admins", value: getRoleCount("admin"), icon: "👑" },
    { title: "Managers", value: getRoleCount("manager"), icon: "👔" },
    { title: "Employees", value: getRoleCount("employee"), icon: "👷" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index}>
          <Card.Content className="flex items-center">
            <div className="text-3xl mr-4">{stat.icon}</div>
            <div>
              <div className="text-sm text-gray-500">{stat.title}</div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  );
};

export default UserStats;
