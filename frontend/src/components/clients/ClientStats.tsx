import React from "react";
import { ClientStats as ClientStatsType } from "../../types/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/shadcn-card";
import { Users, CheckCircle, Lightbulb, Target } from "lucide-react";

interface ClientStatsProps {
  stats: ClientStatsType | null;
  loading: boolean;
  error: string;
}

const ClientStats: React.FC<ClientStatsProps> = ({ stats, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-center">
        <p>Error loading client statistics: {error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statsData = [
    { title: "Total Clients", value: stats.totalClients, icon: <Users className="h-6 w-6 text-gray-500" /> },
    { title: "Active Clients", value: stats.activeClients, icon: <CheckCircle className="h-6 w-6 text-green-500" /> },
    { title: "Leads", value: stats.leads, icon: <Lightbulb className="h-6 w-6 text-yellow-500" /> },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate.toFixed(1)}%`,
      icon: <Target className="h-6 w-6 text-blue-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClientStats;