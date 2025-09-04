import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { projectService } from "../../services/projectService";
import { ProjectStats } from "../../types";
import { clientService } from "../../services/clientService";
import { ClientStats } from "../../types/client";
import AnimatedStatCard from "../common/AnimatedStatCard";
import CircularProgress from "../common/CircularProgress";
import MiniChart, { Sparkline } from "../common/MiniChart";
import ActivityFeed from "../common/ActivityFeed";
import LiveClockWidget from "../common/LiveClockWidget";
import FloatingActionButton from "../common/FloatingActionButton";
import NotificationCenter from "../common/NotificationCenter";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  Building,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
} from "lucide-react";
import { toast } from "react-hot-toast";

const EnhancedDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [clientStats, setClientStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Sample data for charts
  const revenueData = [
    { value: 45000, label: "Jan" },
    { value: 52000, label: "Feb" },
    { value: 48000, label: "Mar" },
    { value: 61000, label: "Apr" },
    { value: 55000, label: "May" },
    { value: 67000, label: "Jun" },
    { value: 73000, label: "Jul" },
  ];

  const projectProgressData = [65, 72, 68, 75, 82, 78, 85];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Loading dashboard data...");

      const [projectStats, clientStatsData] = await Promise.all([
        projectService.getProjectStats(),
        clientService.getClientStats(),
      ]);

      console.log("Project stats:", projectStats);
      console.log("Client stats:", clientStatsData);

      setStats(projectStats);
      setClientStats(clientStatsData);
    } catch (error: any) {
      console.error("Dashboard data loading error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load dashboard data";
      setError(errorMessage);
      toast.error(`Error loading dashboard data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-96 space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8 pb-20">
      {" "}
      {/* Extra padding for FAB */}
      {/* Welcome Section with Particles Background */}
      <div className="particles-bg bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-3xl p-8 text-white shadow-colored-lg hover-lift animate-fade-in relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 animate-pulse-soft" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 rounded-full bg-white/5 animate-ping-slow" />

        <div className="relative flex items-center justify-between">
          <div className="animate-slide-in-left">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-primary-100 text-lg leading-relaxed mb-4">
              Here's your construction empire at a glance. Ready to build
              something amazing today?
            </p>
            <div className="flex items-center space-x-6 text-primary-200">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-green-400 rounded-full animate-ping" />
                <span className="text-sm font-medium">All Systems Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Notification Center */}
          <div className="animate-slide-in-right">
            <NotificationCenter />
          </div>
        </div>
      </div>
      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedStatCard
          title="Active Projects"
          value={stats?.activeProjects || 0}
          icon={<Building className="h-6 w-6" />}
          color="primary"
          link="/projects"
          trend={{
            value: 12,
            direction: "up",
            label: "vs last month",
          }}
          animationDelay={100}
        />

        <AnimatedStatCard
          title="Total Revenue"
          value={stats?.totalRevenue || 0}
          icon={<DollarSign className="h-6 w-6" />}
          color="success"
          link="/invoices"
          trend={{
            value: 8,
            direction: "up",
            label: "vs last month",
          }}
          formatValue={(value) => formatCurrency(value)}
          animationDelay={200}
        />

        <AnimatedStatCard
          title="Active Clients"
          value={clientStats?.activeClients || 0}
          icon={<Users className="h-6 w-6" />}
          color="info"
          link="/clients"
          trend={{
            value: 5,
            direction: "up",
            label: "new this week",
          }}
          animationDelay={300}
        />

        <AnimatedStatCard
          title="Completion Rate"
          value={
            stats?.totalProjects
              ? Math.round(
                  (stats.completedProjects / stats.totalProjects) * 100
                )
              : 0
          }
          icon={<Target className="h-6 w-6" />}
          color="warning"
          suffix="%"
          trend={{
            value: 3,
            direction: "up",
            label: "vs last month",
          }}
          animationDelay={400}
        />
      </div>
      {/* Progress & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Progress Overview */}
        <div className="lg:col-span-1">
          <div className="enhanced-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Project Progress
              </h3>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <CircularProgress
                  value={
                    stats?.totalProjects
                      ? Math.round(
                          (stats.completedProjects / stats.totalProjects) * 100
                        )
                      : 0
                  }
                  size={140}
                  strokeWidth={10}
                  showValue={true}
                  label="Overall Progress"
                  animated={true}
                  animationDelay={500}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {stats?.completedProjects || 0}
                  </div>
                  <div className="text-xs text-green-700">Completed</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats?.activeProjects || 0}
                  </div>
                  <div className="text-xs text-blue-700">In Progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Trends */}
        <div className="lg:col-span-2">
          <div className="enhanced-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Revenue Trends
                </h3>
                <p className="text-sm text-gray-600">
                  Monthly revenue over the last 7 months
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    revenueData[revenueData.length - 1]?.value || 0
                  )}
                </div>
                <div className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12% from last month
                </div>
              </div>
            </div>

            <div className="h-64">
              <MiniChart
                data={revenueData}
                type="area"
                color="#22c55e"
                height={200}
                width={600}
                showDots={true}
                animated={true}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Activity & Widgets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <div className="enhanced-card p-6">
            <ActivityFeed showMarkAsRead={true} maxItems={8} realTime={true} />
          </div>
        </div>

        {/* Widgets Column */}
        <div className="space-y-6">
          {/* Live Clock & Weather */}
          <LiveClockWidget
            showWeather={true}
            location="Main Construction Site"
            format24Hour={false}
            showSeconds={true}
          />

          {/* Quick Stats */}
          <div className="enhanced-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Insights
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Project Efficiency
                </span>
                <div className="flex items-center space-x-2">
                  <Sparkline
                    data={projectProgressData}
                    color="#3b82f6"
                    height={20}
                    width={60}
                  />
                  <span className="text-sm font-medium text-gray-900">85%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Client Satisfaction
                </span>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">4.8</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">On-Time Delivery</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">92%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Urgent Items */}
          <div className="enhanced-card p-6 border-l-4 border-l-red-500">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
              <h3 className="text-lg font-semibold text-gray-900">
                Urgent Items
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-red-900">
                    City Hall Renovation
                  </p>
                  <p className="text-xs text-red-700">Due tomorrow</p>
                </div>
                <div className="h-2 w-2 bg-red-500 rounded-full animate-ping" />
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-yellow-900">
                    Budget Review
                  </p>
                  <p className="text-xs text-yellow-700">Overdue by 2 days</p>
                </div>
                <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};

export default EnhancedDashboard;
