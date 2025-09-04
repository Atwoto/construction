import React, { useState, useEffect } from "react";
import {
  Bell,
  X,
  Check,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../ui/shadcn-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { Badge } from "../ui/shadcn-badge";
import { toast } from "react-hot-toast";

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "warning",
      title: "Project Deadline Approaching",
      message: "City Hall Renovation is due tomorrow",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      actionUrl: "/projects/1",
      actionLabel: "View Project",
    },
    {
      id: "2",
      type: "success",
      title: "Invoice Paid",
      message: "Payment received for Downtown Office Complex",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      actionUrl: "/invoices/2",
      actionLabel: "View Invoice",
    },
    {
      id: "3",
      type: "info",
      title: "New Team Member Added",
      message: "John Smith joined the Shopping Center project",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      read: true,
      actionUrl: "/projects/3",
      actionLabel: "View Team",
    },
    {
      id: "4",
      type: "error",
      title: "Budget Exceeded",
      message: "Warehouse Expansion is 15% over budget",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      read: false,
      actionUrl: "/projects/4",
      actionLabel: "Review Budget",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification removed");
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-success-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-danger-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning-600" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationBg = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-success-50 border-success-200";
      case "error":
        return "bg-danger-50 border-danger-200";
      case "warning":
        return "bg-warning-50 border-warning-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications for demo
      if (Math.random() > 0.95) {
        // 5% chance every 5 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ["info", "success", "warning"][
            Math.floor(Math.random() * 3)
          ] as any,
          title: "New Activity",
          message: "Something happened in your project",
          timestamp: new Date(),
          read: false,
        };

        setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]); // Keep only 10 notifications

        // Show toast for new notification
        toast.success("New notification received!");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-danger-500 text-white text-xs animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-96 p-0 bg-white/95 backdrop-blur-sm border-0 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <Badge
                variant="secondary"
                className="bg-primary-100 text-primary-700"
              >
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto scrollbar-thin">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`
                    group relative p-3 rounded-lg border transition-all duration-200 hover:shadow-md
                    ${notification.read ? "bg-white border-gray-100" : `${getNotificationBg(notification.type)} border-opacity-50`}
                    ${index === 0 ? "animate-slide-in-right" : ""}
                  `}
                >
                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="absolute left-1 top-1/2 transform -translate-y-1/2 h-2 w-2 bg-primary-500 rounded-full" />
                  )}

                  <div className="flex items-start space-x-3 ml-2">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${notification.read ? "text-gray-700" : "text-gray-900"}`}
                          >
                            {notification.title}
                          </p>
                          <p
                            className={`text-xs mt-1 ${notification.read ? "text-gray-500" : "text-gray-600"}`}
                          >
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-400 hover:text-danger-600"
                            onClick={() => removeNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Action button */}
                      {notification.actionUrl && notification.actionLabel && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-7 text-xs text-primary-600 hover:text-primary-700 p-0"
                          onClick={() => {
                            // Handle navigation
                            markAsRead(notification.id);
                            setIsOpen(false);
                          }}
                        >
                          {notification.actionLabel} →
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-100 bg-gray-50/50">
            <Button
              variant="ghost"
              className="w-full text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setIsOpen(false)}
            >
              View all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationCenter;
