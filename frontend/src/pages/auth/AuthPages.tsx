import React from "react";
import { Link } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

export function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="max-w-md w-full">
        <Card.Content>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Forgot Password
            </h2>
            <p className="text-gray-600 mb-6">Password reset coming soon!</p>
            <Link to="/login">
              <Button>Back to Login</Button>
            </Link>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}

export function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="max-w-md w-full">
        <Card.Content>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Reset Password
            </h2>
            <p className="text-gray-600 mb-6">Password reset coming soon!</p>
            <Link to="/login">
              <Button>Back to Login</Button>
            </Link>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}

export function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
      </div>

      <Card>
        <Card.Content>
          <div className="text-center py-12">
            <span className="text-4xl mb-4 block">👤</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Profile Management
            </h3>
            <p className="text-gray-600">
              Profile editing functionality coming soon!
            </p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}