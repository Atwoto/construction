# Construction CRM System

A comprehensive Customer Relationship Management system specifically designed for construction companies to manage all aspects of their business operations.

## Tech Stack

- **Frontend**: React.js with modern hooks and context API
- **Backend**: Node.js with Express.js framework
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **API Architecture**: RESTful APIs
- **Styling**: Tailwind CSS
- **File Storage**: Local file system

## Project Structure

```
construction-crm/
├── frontend/          # React.js application
├── backend/           # Node.js/Express API
├── database/          # SQL scripts and migrations
├── docs/             # Documentation
└── README.md         # Project overview
```

## Core Features

### 1. Authentication & User Management
- Multi-role authentication system (Admin, Manager, Employee)
- JWT-based secure authentication
- Password reset functionality
- User profile management
- Role-based access control

### 2. Client Management Module
- Complete client database with contact information
- Lead management pipeline (Lead → Opportunity → Active Client)
- Communication history tracking
- Client status management
- Search and filter functionality

### 3. Project Management Module
- Comprehensive project tracking system
- Project lifecycle management
- Milestone and task management
- Progress tracking with visual indicators
- Budget tracking
- Timeline/Gantt chart visualization

### 4. Financial Management Module
- Professional invoice generation and management
- Quote/Estimate system
- Expense tracking and categorization
- Payment status monitoring
- Financial reporting and analytics

### 5. Workforce Management Module
- Employee database with complete profiles
- Skills and certification tracking
- Project assignment management
- Work schedule management
- Time tracking for payroll

### 6. Inventory & Procurement Module
- Materials and equipment database
- Stock level monitoring
- Supplier management
- Purchase order generation
- Low stock alerts

### 7. Document Management System
- Secure document storage and organization
- Document categorization
- Version control for documents
- Document sharing with clients
- Expiry date tracking for licenses/permits

### 8. Reporting & Analytics Module
- Real-time dashboard with KPIs
- Financial reports (P&L, Cash Flow, Revenue)
- Project performance reports
- Client analysis reports
- Employee productivity reports

### 9. Communication Tools
- Internal team messaging system
- Client communication tracking
- Automated notification system
- Email integration for client updates

## Installation

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Database Setup
```bash
cd database
# Run migration scripts (to be implemented)
```

## Development Phases

- **Phase 1**: Foundation setup, database, authentication
- **Phase 2**: Core features (client management, basic project management)
- **Phase 3**: Advanced features (financial management, reporting)
- **Phase 4**: Testing, optimization, documentation

## API Documentation

API documentation will be available at `/api/docs` when the server is running.

## Security Features

- Password hashing with bcrypt
- JWT token management with refresh tokens
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting on API endpoints

## License

This project is licensed under the MIT License.