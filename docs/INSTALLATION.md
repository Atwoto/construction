# Construction CRM - Installation & Setup Guide

## Overview

You have successfully created a comprehensive Construction CRM system with the following completed features:

### ✅ Phase 1: Foundation Complete

1. **Project Structure**: Organized monorepo with separate frontend/backend
2. **Backend API**: Node.js + Express + PostgreSQL + Sequelize
3. **Database Schema**: Complete models for all CRM entities
4. **Authentication**: JWT-based auth with role-based access control
5. **Frontend**: React + TypeScript + Tailwind CSS
6. **UI Components**: Reusable component library

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation Steps

### 1. Database Setup

```sql
-- Create database
CREATE DATABASE construction_crm_dev;
CREATE DATABASE construction_crm_test;

-- Create user (optional)
CREATE USER construction_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE construction_crm_dev TO construction_user;
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Install global dependencies if needed
npm install -g sequelize-cli

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Install additional Tailwind plugins
npm install @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio

# Start development server
npm start
```

## System Architecture

### Backend Structure

```
backend/
├── src/
│   ├── config/          # Database & app configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication & validation
│   ├── models/          # Database models
│   ├── routes/          # API endpoints
│   ├── utils/           # Helper utilities
│   └── server.js        # Main server file
├── logs/                # Application logs
├── uploads/             # File uploads
└── package.json
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Application pages
│   ├── services/        # API services
│   ├── types/           # TypeScript definitions
│   ├── utils/           # Helper utilities
│   └── App.tsx          # Main app component
├── public/              # Static assets
└── package.json
```

## Features Implemented

### 🔐 Authentication System

- JWT token-based authentication
- Role-based access control (Admin, Manager, Employee)
- Password hashing with bcrypt
- Token refresh mechanism
- Account lockout protection

### 🗄️ Database Models

- **Users**: Authentication and user management
- **Clients**: Customer relationship management
- **Projects**: Project lifecycle tracking
- **Invoices**: Financial transactions
- **Employees**: Workforce management
- **Tasks**: Project task breakdown
- **Materials**: Inventory management
- **Suppliers**: Vendor relationships
- **Documents**: File management with versioning
- **Communications**: Interaction logging
- **Expenses**: Cost tracking
- **Timesheets**: Work hour tracking

### 🎨 UI Components

- Button (multiple variants)
- Input (with validation)
- Card (flexible container)
- Loading Spinner
- Layout with navigation
- Responsive design

### 📱 Pages & Routes

- Login page with demo credentials
- Dashboard with overview stats
- Protected routes
- Public routes
- 404 error handling

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Module Placeholders

- Users: `/api/users`
- Clients: `/api/clients`
- Projects: `/api/projects`
- Invoices: `/api/invoices`
- Employees: `/api/employees`
- Inventory: `/api/inventory`
- Documents: `/api/documents`
- Reports: `/api/reports`

## Security Features

- Password strength validation
- Rate limiting
- CORS configuration
- Helmet security headers
- Input validation
- SQL injection prevention
- XSS protection

## Development URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/docs (when Swagger is configured)
- **Health Check**: http://localhost:5000/health

## Demo Credentials

For testing the authentication system:

- **Admin**: admin@demo.com / password123
- **Manager**: manager@demo.com / password123
- **Employee**: employee@demo.com / password123

## Next Steps (Phase 2)

The foundation is complete! Next phase would include:

1. **User Management Module** - Complete CRUD operations
2. **Client Management** - Lead pipeline and contact tracking
3. **Project Management** - Task management and progress tracking
4. **Dashboard Enhancement** - Real data integration

## Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Ensure PostgreSQL is running
   - Check credentials in .env file
   - Verify database exists

2. **Frontend Build Errors**

   - Clear node_modules and reinstall
   - Check for TypeScript errors
   - Ensure all dependencies are installed

3. **CORS Issues**
   - Check CORS_ORIGIN in backend .env
   - Ensure frontend proxy is configured

### Logs

Backend logs are available in:

- `backend/logs/combined.log` - All logs
- `backend/logs/error.log` - Error logs only
- Console output during development

## Support

This is a development-ready Construction CRM system with:

- ✅ Solid architecture foundation
- ✅ Security best practices
- ✅ Scalable database design
- ✅ Modern UI/UX framework
- ✅ Comprehensive authentication
- ✅ Type-safe development

The system is ready for feature development in Phase 2!"
