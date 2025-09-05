import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { projectService } from "../services/projectService";
import { ProjectStats } from "../types";
import { ClientStats } from "../types/client";
import { clientService } from "../services/clientService";
import {
  Card as ShadcnCard,
  CardHeader as ShadcnCardHeader,
  CardTitle as ShadcnCardTitle,
  CardContent as ShadcnCardContent,
} from "../components/ui/shadcn-card";
import { Avatar, AvatarFallback } from "../components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../components/ui/DropdownMenu";
import { Button as ShadcnButton } from "../components/ui/shadcn-button";
import { Button } from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  MoreHorizontal,
  TrendingUp,
  Users,
  Building,
  DollarSign,
} from "lucide-react";

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [clientStats, setClientStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const [projectStats, clientStatsData] = await Promise.all([
        projectService.getProjectStats(),
        clientService.getClientStats(),
      ]);
      setStats(projectStats);
      setClientStats(clientStatsData);
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to load dashboard data"
      );
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (href: string) => {
    navigate(href);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statsCards = [
    {
      title: "Active Projects",
      value: stats?.activeProjects?.toString() || "0",
      icon: "🏗️",
      color: "primary",
      link: "/projects",
    },
    {
      title: "Total Clients",
      value: clientStats?.totalClients?.toString() || "0",
      icon: "👥",
      color: "info",
      link: "/clients",
    },
    {
      title: "Active Clients",
      value: clientStats?.activeClients?.toString() || "0",
      icon: "✅",
      color: "success",
      link: "/clients?status=active",
    },
    {
      title: "Total Budget",
      value: stats?.totalBudget
        ? projectService.formatCurrency(stats.totalBudget)
        : "€0",
      icon: "💰",
      color: "warning",
      link: "/projects",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-3xl p-8 text-white shadow-colored-lg hover-lift animate-fade-in relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 animate-pulse-soft"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 rounded-full bg-white/5 animate-ping-slow"></div>

        <div className="relative flex items-center justify-between">
          <div className="animate-slide-in-left">
            <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-primary-100 text-lg leading-relaxed">
              Here's what's happening with your construction projects today.
            </p>
            <div className="mt-4 flex items-center space-x-4 text-primary-200">
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-ping"></div>
                <span className="text-sm">System Online</span>
              </div>
              <div className="text-sm">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
          <div className="hidden md:block animate-slide-in-right">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-white/20 hover-scale">
                <AvatarFallback className="bg-white text-primary-600 text-2xl font-bold">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-400 rounded-full border-2 border-white animate-bounce-soft"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            <span className="text-red-700">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadDashboardData}
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <ShadcnCard
              key={index}
              className={`hover-lift hover-glow bg-white border-0 shadow-soft animate-slide-up stagger-${index + 1} group cursor-pointer`}
            >
              <ShadcnCardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {stat.title}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {stat.value}
                    </h3>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                </div>
                <Link
                  to={stat.link}
                  className="mt-6 inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700 group-hover:translate-x-1 transition-all"
                >
                  View details
                  <svg
                    className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </Link>
              </ShadcnCardContent>
            </ShadcnCard>
          ))}
        </div>
      )}

      {/* Client & Project Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Insights */}
        <ShadcnCard className="enhanced-card">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <ShadcnCardTitle className="text-xl font-bold text-gray-900">
                Client Insights
              </ShadcnCardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ShadcnButton variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </ShadcnButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View all clients</DropdownMenuItem>
                <DropdownMenuItem>Add new client</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Export client data</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ShadcnCardHeader>
          <ShadcnCardContent>
            <div className="space-y-4">
              {clientStats ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-blue-50 p-4 text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-2">
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {clientStats.leads}
                      </div>
                      <div className="text-sm text-blue-700">Leads</div>
                    </div>
                    <div className="rounded-lg bg-yellow-50 p-4 text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 mb-2">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {clientStats.opportunities}
                      </div>
                      <div className="text-sm text-yellow-700">
                        Opportunities
                      </div>
                    </div>
                    <div className="rounded-lg bg-green-50 p-4 text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 mb-2">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {clientStats.conversionRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-green-700">
                        Conversion Rate
                      </div>
                    </div>
                    <div className="rounded-lg bg-red-50 p-4 text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-red-600">
                        {clientStats.overdueFollowUps}
                      </div>
                      <div className="text-sm text-red-700">
                        Overdue Follow-ups
                      </div>
                    </div>
                  </div>

                  {clientStats.totalEstimatedValue > 0 && (
                    <div className="rounded-lg bg-gray-50 p-4 text-center">
                      <div className="flex items-center justify-center mb-1">
                        <DollarSign className="h-5 w-5 text-gray-500 mr-1" />
                        <div className="text-lg font-semibold text-gray-900">
                          {clientService.formatCurrency(
                            clientStats.totalEstimatedValue
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Pipeline Value
                      </div>
                    </div>
                  )}

                  {clientStats.overdueFollowUps > 0 && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-red-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            {clientStats.overdueFollowUps} overdue follow-up
                            {clientStats.overdueFollowUps > 1 ? "s" : ""}
                          </h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>Needs immediate attention</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-gray-500 text-center py-4">
                  Loading client data...
                </div>
              )}
            </div>
          </ShadcnCardContent>
        </ShadcnCard>

        {/* Project Insights */}
        <ShadcnCard className="enhanced-card">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                <Building className="h-6 w-6 text-emerald-600" />
              </div>
              <ShadcnCardTitle className="text-xl font-bold text-gray-900">
                Project Insights
              </ShadcnCardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ShadcnButton variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </ShadcnButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View all projects</DropdownMenuItem>
                <DropdownMenuItem>Create new project</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Export project data</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ShadcnCardHeader>
          <ShadcnCardContent>
            <div className="space-y-4">
              {stats ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-blue-50 p-4 text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-2">
                        <Building className="h-5 w-5" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.activeProjects || 0}
                      </div>
                      <div className="text-sm text-blue-700">In Progress</div>
                    </div>
                    <div className="rounded-lg bg-green-50 p-4 text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {stats.completedProjects || 0}
                      </div>
                      <div className="text-sm text-green-700">Completed</div>
                    </div>
                    <div className="rounded-lg bg-yellow-50 p-4 text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">
                                                {stats?.onHoldProjects || 0}
                      </div>
                      <div className="text-sm text-yellow-700">On Hold</div>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-4 text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 mb-2">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {stats?.averageProgress?.toFixed(0) || 0}%
                      </div>
                      <div className="text-sm text-purple-700">
                        Average Progress
                      </div>
                    </div>
                  </div>

                  {stats.totalRevenue && stats.totalRevenue > 0 && (
                    <div className="rounded-lg bg-gray-50 p-4 text-center">
                      <div className="flex items-center justify-center mb-1">
                        <DollarSign className="h-5 w-5 text-gray-500 mr-1" />
                        <div className="text-lg font-semibold text-gray-900">
                          {projectService.formatCurrency(stats.totalRevenue)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">Total Revenue</div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-gray-500 text-center py-4">
                  Loading project data...
                </div>
              )}
            </div>
          </ShadcnCardContent>
        </ShadcnCard>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShadcnCard className="enhanced-card">
          <ShadcnCardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <ShadcnCardTitle className="text-xl font-bold text-gray-900">
                Recent Activity
              </ShadcnCardTitle>
            </div>
          </ShadcnCardHeader>
          <ShadcnCardContent>
            <div className="space-y-4">
              {[
                {
                  action: "New project created",
                  project: "Downtown Office Complex",
                  time: "2 hours ago",
                  type: "project",
                },
                {
                  action: "Invoice sent",
                  project: "Residential Villa",
                  time: "4 hours ago",
                  type: "invoice",
                },
                {
                  action: "Team member added",
                  project: "Shopping Center",
                  time: "1 day ago",
                  type: "team",
                },
                {
                  action: "Project completed",
                  project: "Warehouse Expansion",
                  time: "2 days ago",
                  type: "completion",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      {activity.type === "project" && (
                        <Building className="h-4 w-4" />
                      )}
                      {activity.type === "invoice" && (
                        <DollarSign className="h-4 w-4" />
                      )}
                      {activity.type === "team" && (
                        <Users className="h-4 w-4" />
                      )}
                      {activity.type === "completion" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.project}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </ShadcnCardContent>
        </ShadcnCard>

        <ShadcnCard className="enhanced-card">
          <ShadcnCardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <ShadcnCardTitle className="text-xl font-bold text-gray-900">
                Upcoming Deadlines
              </ShadcnCardTitle>
            </div>
          </ShadcnCardHeader>
          <ShadcnCardContent>
            <div className="space-y-4">
              {[
                {
                  project: "City Hall Renovation",
                  deadline: "Tomorrow",
                  status: "urgent",
                },
                {
                  project: "Bridge Construction",
                  deadline: "In 3 days",
                  status: "warning",
                },
                {
                  project: "School Building",
                  deadline: "Next week",
                  status: "normal",
                },
                {
                  project: "Hospital Wing",
                  deadline: "In 2 weeks",
                  status: "normal",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center">
                    <div
                      className={`flex-shrink-0 h-3 w-3 rounded-full ${
                        item.status === "urgent"
                          ? "bg-red-500"
                          : item.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    ></div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {item.project}
                      </p>
                      <p className="text-xs text-gray-500">{item.deadline}</p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === "urgent"
                        ? "status-urgent"
                        : item.status === "warning"
                          ? "status-warning"
                          : "status-success"
                    }`}
                  >
                    {item.status === "urgent"
                      ? "Urgent"
                      : item.status === "warning"
                        ? "Soon"
                        : "Normal"}
                  </div>
                </div>
              ))}
            </div>
          </ShadcnCardContent>
        </ShadcnCard>
      </div>

      {/* Quick Actions */}
      <ShadcnCard className="enhanced-card">
        <ShadcnCardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <ShadcnCardTitle className="text-xl font-bold text-gray-900">
              Quick Actions
            </ShadcnCardTitle>
          </div>
        </ShadcnCardHeader>
        <ShadcnCardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "New Project",
                icon: <Building className="h-5 w-5" />,
                href: "/projects",
              },
              {
                label: "Add Client",
                icon: <Users className="h-5 w-5" />,
                href: "/clients",
              },
              {
                label: "Create Invoice",
                icon: <DollarSign className="h-5 w-5" />,
                href: "/invoices",
              },
              {
                label: "View Reports",
                icon: <TrendingUp className="h-5 w-5" />,
                href: "/reports",
              },
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.href)}
                className="group flex flex-col items-center rounded-2xl border border-white/40 bg-gradient-to-br from-white to-gray-50/30 p-6 text-center hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="mb-3 rounded-2xl bg-gradient-to-br from-primary-500/10 to-primary-600/10 p-4 text-primary-600 group-hover:scale-110 transition-transform duration-200">
                  {action.icon}
                </div>
                <span className="text-sm font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </ShadcnCardContent>
      </ShadcnCard>
    </div>
  );
}

export default DashboardPage;
