import React, { useState } from "react";
import { Plus, X, Building, Users, DollarSign, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/shadcn-button";
import { toast } from "react-hot-toast";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  bgColor: string;
}

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      id: "project",
      label: "Create New Project",
      icon: <Building className="h-5 w-5" />,
      href: "/projects/new",
      color: "text-blue-600",
      bgColor: "bg-blue-500 hover:bg-blue-600",
    },
    {
      id: "client",
      label: "Add Client",
      icon: <Users className="h-5 w-5" />,
      href: "/clients/new",
      color: "text-green-600",
      bgColor: "bg-green-500 hover:bg-green-600",
    },
    {
      id: "invoice",
      label: "Send Invoice",
      icon: <DollarSign className="h-5 w-5" />,
      href: "/invoices/new",
      color: "text-yellow-600",
      bgColor: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      id: "meeting",
      label: "Schedule Meeting",
      icon: <Calendar className="h-5 w-5" />,
      href: "/calendar/new",
      color: "text-purple-600",
      bgColor: "bg-purple-500 hover:bg-purple-600",
    },
  ];

  const handleActionClick = (action: QuickAction) => {
    setIsOpen(false);
    toast.success(`Opening ${action.label}...`);
    navigate(action.href);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action buttons */}
      <div
        className={`
        flex flex-col-reverse space-y-reverse space-y-3 mb-4 transition-all duration-300 transform
        ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
      >
        {quickActions.map((action, index) => (
          <div
            key={action.id}
            className={`
              flex items-center space-x-3 transition-all duration-300 transform
              ${isOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}
            `}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            {/* Label */}
            <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-white/40 whitespace-nowrap">
              <span className="text-sm font-medium text-gray-700">
                {action.label}
              </span>
            </div>

            {/* Action button */}
            <Button
              onClick={() => handleActionClick(action)}
              className={`
                h-12 w-12 rounded-full shadow-lg border-0 text-white transition-all duration-200
                hover:scale-110 hover:shadow-xl active:scale-95
                ${action.bgColor}
              `}
            >
              {action.icon}
            </Button>
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <Button
        onClick={toggleOpen}
        className={`
          h-14 w-14 rounded-full shadow-xl border-0 text-white transition-all duration-300
          hover:scale-110 hover:shadow-2xl active:scale-95
          ${
            isOpen
              ? "bg-gray-500 hover:bg-gray-600 rotate-45"
              : "bg-primary-500 hover:bg-primary-600 rotate-0"
          }
        `}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FloatingActionButton;
