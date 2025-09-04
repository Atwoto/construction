import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Badge } from "../ui/shadcn-badge";
import { Button } from "../ui/shadcn-button";
import {
  Building,
  Users,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calendar,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type:
    | "project"
    | "invoice"
    | "team"
    | "completion"
    | "document"
    | "meeting"
    | "comment";
  action: string;
  description: string;
  timestamp: Date;
  user: {
    id: string;
    name: string;
    avatar?: string;
    initials: string;
  };
  metadata?: {
    projectName?: string;
    amount?: number;
    status?: string;
    priority?: "low" | "medium" | "high" | "urgent";
  };
  read?: boolean;
}

interface ActivityFeedProps {
  activities?: ActivityItem[];
  showMarkAsRead?: boolean;
  maxItems?: number;
  realTime?: boolean;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities: propActivities,
  showMarkAsRead = true,
  maxItems = 10,
  realTime = true,
}) => {
  const [activities, setActivities] = useState<ActivityItem[]>(
    propActivities || [
      {
        id: "1",
        type: "project",
        action: "created new project",
        description: "Downtown Office Complex",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        user: {
          id: "1",
          name: "John Smith",
          initials: "JS",
        },
        metadata: {
          projectName: "Downtown Office Complex",
          status: "planning",
        },
      },
      {
        id: "2",
        type: "invoice",
        action: "sent invoice",
        description: "Invoice #INV-2024-001 for $45,000",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        user: {
          id: "2",
          name: "Sarah Johnson",
          initials: "SJ",
        },
        metadata: {
          amount: 45000,
          status: "sent",
        },
      },
      {
        id: "3",
        type: "team",
        action: "added team member",
        description: "Mike Wilson joined Shopping Center project",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        user: {
          id: "3",
          name: "Emily Davis",
          initials: "ED",
        },
        metadata: {
          projectName: "Shopping Center",
        },
      },
      {
        id: "4",
        type: "completion",
        action: "completed project",
        description: "Warehouse Expansion finished ahead of schedule",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
        user: {
          id: "4",
          name: "David Brown",
          initials: "DB",
        },
        metadata: {
          projectName: "Warehouse Expansion",
          status: "completed",
        },
      },
      {
        id: "5",
        type: "document",
        action: "uploaded document",
        description: "Building permits for City Hall Renovation",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
        user: {
          id: "5",
          name: "Lisa Anderson",
          initials: "LA",
        },
        metadata: {
          projectName: "City Hall Renovation",
        },
      },
    ]
  );

  const [showAll, setShowAll] = useState(false);

  const getActivityIcon = (type: ActivityItem["type"]) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case "project":
        return <Building className={`${iconClass} text-blue-600`} />;
      case "invoice":
        return <DollarSign className={`${iconClass} text-green-600`} />;
      case "team":
        return <Users className={`${iconClass} text-purple-600`} />;
      case "completion":
        return <CheckCircle className={`${iconClass} text-green-600`} />;
      case "document":
        return <FileText className={`${iconClass} text-orange-600`} />;
      case "meeting":
        return <Calendar className={`${iconClass} text-indigo-600`} />;
      case "comment":
        return <MessageSquare className={`${iconClass} text-gray-600`} />;
      default:
        return <AlertTriangle className={`${iconClass} text-yellow-600`} />;
    }
  };

  const getActivityColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "project":
        return "bg-blue-100 border-blue-200";
      case "invoice":
        return "bg-green-100 border-green-200";
      case "team":
        return "bg-purple-100 border-purple-200";
      case "completion":
        return "bg-green-100 border-green-200";
      case "document":
        return "bg-orange-100 border-orange-200";
      case "meeting":
        return "bg-indigo-100 border-indigo-200";
      case "comment":
        return "bg-gray-100 border-gray-200";
      default:
        return "bg-yellow-100 border-yellow-200";
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

  const markAsRead = (id: string) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id ? { ...activity, read: true } : activity
      )
    );
  };

  // Simulate real-time updates
  useEffect(() => {
    if (!realTime) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.98) {
        // 2% chance every 3 seconds
        const newActivity: ActivityItem = {
          id: Date.now().toString(),
          type: ["project", "invoice", "team", "completion"][
            Math.floor(Math.random() * 4)
          ] as any,
          action: "performed action",
          description: "New activity occurred",
          timestamp: new Date(),
          user: {
            id: "new",
            name: "System User",
            initials: "SU",
          },
          read: false,
        };

        setActivities((prev) => [newActivity, ...prev.slice(0, maxItems - 1)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [realTime, maxItems]);

  const displayedActivities = showAll
    ? activities
    : activities.slice(0, maxItems);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        {activities.length > maxItems && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-primary-600 hover:text-primary-700"
          >
            {showAll ? "Show less" : `View all (${activities.length})`}
          </Button>
        )}
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {displayedActivities.map((activity, index) => (
          <div
            key={activity.id}
            className={`
              group relative flex items-start space-x-3 p-4 rounded-xl border transition-all duration-200
              hover:shadow-md hover:-translate-y-0.5
              ${activity.read === false ? "bg-blue-50/50 border-blue-200" : "bg-white border-gray-200"}
              ${index === 0 ? "animate-slide-in-right" : ""}
            `}
          >
            {/* Unread indicator */}
            {activity.read === false && (
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 h-2 w-2 bg-primary-500 rounded-full" />
            )}

            {/* Avatar */}
            <div className="flex-shrink-0 ml-2">
              <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-600 text-white text-sm font-medium">
                  {activity.user.initials}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user.name}</span>{" "}
                    <span className="text-gray-600">{activity.action}</span>
                  </p>
                  <p className="text-sm text-gray-700 mt-1 font-medium">
                    {activity.description}
                  </p>

                  {/* Metadata */}
                  {activity.metadata && (
                    <div className="flex items-center space-x-2 mt-2">
                      {activity.metadata.status && (
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getActivityColor(activity.type)}`}
                        >
                          {activity.metadata.status}
                        </Badge>
                      )}
                      {activity.metadata.amount && (
                        <span className="text-xs text-green-600 font-medium">
                          ${activity.metadata.amount.toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-2 flex items-center space-x-2">
                    <span>{formatTimestamp(activity.timestamp)}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div
                    className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>

                  {showMarkAsRead && activity.read === false && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => markAsRead(activity.id)}
                    >
                      <CheckCircle className="h-4 w-4 text-gray-400 hover:text-green-600" />
                    </Button>
                  )}

                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {activities.length === 0 && (
        <div className="text-center py-8">
          <div className="mx-auto h-12 w-12 text-gray-300 mb-3">
            <Building className="h-full w-full" />
          </div>
          <p className="text-gray-500 text-sm">No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
