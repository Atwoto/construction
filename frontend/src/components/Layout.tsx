import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import { useAuth } from "../context/AuthContext";
import Button from "./common/Button";
import LoadingSpinner from "./common/LoadingSpinner";

// Navigation items with simple icons
const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Clients", href: "/clients", icon: "👥" },
  { name: "Projects", href: "/projects", icon: "🏗️" },
  { name: "Invoices", href: "/invoices", icon: "📄" },
  { name: "Employees", href: "/employees", icon: "👷" },
  { name: "Inventory", href: "/inventory", icon: "📦" },
  { name: "Documents", href: "/documents", icon: "📁" },
  { name: "Reports", href: "/reports", icon: "📈" },
];

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActiveRoute = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden animate-fade-in">
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl animate-slide-in-left">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white hover:bg-white/10 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-white text-xl">×</span>
              </button>
            </div>
            <MobileSidebar
              navigationItems={navigationItems}
              isActiveRoute={isActiveRoute}
              user={user}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar
            navigationItems={navigationItems}
            isActiveRoute={isActiveRoute}
            user={user}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white/80 backdrop-blur-md shadow-soft border-b border-gray-200/50">
          <button
            className="px-4 border-r border-gray-200/50 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden hover:bg-gray-50 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="text-lg">☰</span>
          </button>

          <div className="flex-1 px-6 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                Construction CRM
              </h1>
            </div>

            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              {/* User menu */}
              <div className="relative flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all group"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-semibold group-hover:scale-105 transition-transform">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.email}
                    </div>
                  </div>
                  <div className="block sm:hidden">
                    <div className="font-medium text-gray-900 text-xs">
                      {user.firstName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.role}
                    </div>
                  </div>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  leftIcon={<span className="text-sm">🚪</span>}
                  className="hidden md:flex hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  Logout
                </Button>

                <button
                  onClick={handleLogout}
                  className="md:hidden p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <span className="text-lg">🚪</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none scrollbar-thin">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 animate-fade-in">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Sidebar component
function Sidebar({ navigationItems, isActiveRoute, user }: any) {
  return (
    <div className="flex flex-col h-0 flex-1 border-r border-gray-200/50 bg-white/95 backdrop-blur-sm">
      <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto scrollbar-thin">
        <div className="flex items-center flex-shrink-0 px-6 mb-8">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-white text-xl">🏗️</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Construction</h1>
              <p className="text-xs text-gray-500 font-medium">CRM System</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navigationItems.map((item: any, index: number) => {
            const isActive = isActiveRoute(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 animate-slide-in-left",
                  isActive
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-colored"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1"
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span
                  className={clsx(
                    "mr-4 text-lg transition-transform group-hover:scale-110",
                    isActive ? "animate-bounce-soft" : ""
                  )}
                >
                  {item.icon}
                </span>
                <span className="font-semibold">{item.name}</span>
                {isActive && (
                  <div className="ml-auto h-2 w-2 bg-white rounded-full animate-ping"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-shrink-0 border-t border-gray-200/50 p-4 bg-gray-50/50">
        <Link
          to="/profile"
          className="group flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-white hover:text-gray-900 hover:shadow-soft transition-all w-full"
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xs font-semibold mr-3 group-hover:scale-105 transition-transform">
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-xs text-gray-500">
              {user.email}
            </div>
          </div>
          <span className="ml-2 text-lg group-hover:animate-spin-slow">⚙️</span>
        </Link>
      </div>
    </div>
  );
}

// Mobile sidebar component
function MobileSidebar({ navigationItems, isActiveRoute, user }: any) {
  return (
    <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto flex flex-col">
      <div className="flex-shrink-0 flex items-center px-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <span className="text-white text-lg">🏗️</span>
          </div>
          <h1 className="text-lg font-bold text-primary-600">
            Construction CRM
          </h1>
        </div>
      </div>
      
      {/* User Profile Section */}
      <div className="mt-6 px-4">
        <Link
          to="/profile"
          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-semibold">
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {user.email}
            </div>
          </div>
        </Link>
      </div>
      
      <nav className="mt-6 px-2 space-y-1 flex-1">
        {navigationItems.map((item: any) => {
          const isActive = isActiveRoute(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default Layout;
