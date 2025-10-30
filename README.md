# Yoga Session Management Web App

A comprehensive full-stack web application built with Next.js for managing yoga sessions, students, and instructors. Features role-based authentication, session tracking, and an admin dashboard for monitoring multiple users.

## 🚀 Features

### Authentication & Authorization
- **Multi-provider Authentication**: Support for credentials, Google OAuth, and GitHub OAuth
- **Role-based Access Control**: Admin and user roles with different permissions
- **Secure Password Handling**: Bcrypt encryption for credential-based authentication

### Session Management
- **Create Sessions**: Add online and offline yoga sessions with customizable details
- **Session Types**:
  - Online: Personal, Prenatal
  - Offline: General, Personal, Semi-Prenatal, Semi-Private, Kids, Teens, Seniors
- **Time Management**: Flexible time slots with 15-minute intervals (5 AM - 8 PM)
- **Date Range**: Record sessions from 5 days in the past to current date

### Student Management
- **Student Database**: Maintain a list of students with their session preferences
- **Dynamic Filtering**: Auto-populate student dropdowns based on mode (online/offline) and type (personal/prenatal)
- **Add Students**: Register new students with session type associations

### Dashboard & Analytics
- **Recent Sessions View**: Browse and filter sessions by time, mode, and type
- **Session Summary**: Comprehensive statistics and summaries
- **Month-wise Filtering**: View sessions by specific months or all time
- **Interactive Filters**: Show/hide filters for better UI experience

### Admin Features
- **Multi-user Management**: View and manage sessions for all users
- **User Selection**: Dropdown to switch between different users
- **Consolidated Dashboard**: Monitor sessions across the platform

### Session Operations
- **Edit Sessions**: Modify existing session details
- **Delete Sessions**: Remove sessions with confirmation
- **Real-time Updates**: Instant UI updates after operations

## 🛠️ Tech Stack

### Frontend
- **Next.js 14.2.3**: React framework with App Router
- **React 18**: UI library
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **Motion 12.23.24**: Animation library for smooth transitions

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **MongoDB**: NoSQL database for data persistence
- **Mongoose 8.4.0**: MongoDB object modeling

### Authentication
- **NextAuth.js 5.0 (Beta)**: Authentication library
- **bcryptjs 2.4.3**: Password hashing

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/raghutelkar/learn-next-auth.git
cd yoga-web-app
```

2. **Install dependencies**
```bash
npm install
# or
bun install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGO_DB_CONNECTION_STRING=your_mongodb_connection_string

# NextAuth
AUTH_SECRET=your_auth_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
yoga-web-app/
├── src/
│   ├── app/
│   │   ├── actions/         # Server actions
│   │   ├── add-students/    # Add students page
│   │   ├── admin/           # Admin dashboard
│   │   ├── api/             # API routes
│   │   │   ├── addSession/  # Session CRUD operations
│   │   │   ├── addStudent/  # Student CRUD operations
│   │   │   ├── auth/        # NextAuth configuration
│   │   │   ├── register/    # User registration
│   │   │   └── users/       # User management
│   │   ├── profile/         # User profile page
│   │   ├── register/        # Registration page
│   │   └── utils/           # Utility functions
│   ├── components/          # React components
│   │   ├── AddSessionsForm.jsx
│   │   ├── AddStudentsForm.jsx
│   │   ├── DeleteSessionButton.jsx
│   │   ├── EditSessionButton.jsx
│   │   ├── EditSessionForm.jsx
│   │   ├── Header.jsx
│   │   ├── LoginForm.jsx
│   │   ├── RecentSessions.jsx
│   │   ├── RegistrationForm.jsx
│   │   ├── TotalSummary.jsx
│   │   └── UserDropdown.jsx
│   ├── lib/                 # Library configurations
│   │   └── mongo.js         # MongoDB connection
│   ├── model/               # Database models
│   │   ├── session-model.js
│   │   ├── student-model.js
│   │   └── user-model.js
│   └── queries/             # Database queries
│       ├── sessions.js
│       ├── students.js
│       └── users.js
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind configuration
├── next.config.mjs          # Next.js configuration
└── package.json
```

## 🗄️ Database Schema

### User Model
```javascript
{
  userId: String,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/user),
  timestamps: true
}
```

### Session Model
```javascript
{
  sessionId: String,
  userId: String,
  mode: String (online/offline),
  sessionType: String,
  students: String (optional),
  date: String (ISO),
  start: String (ISO),
  end: String (ISO),
  timestamps: true
}
```

### Student Model
```javascript
{
  mode: String (online/offline),
  studentId: String,
  studentName: String,
  sessionType: String,
  timestamps: true
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth endpoints
- `POST /api/register` - User registration

### Sessions
- `GET /api/addSession` - Fetch sessions
- `POST /api/addSession` - Create new session
- `PUT /api/addSession` - Update session
- `DELETE /api/addSession?sessionId={id}` - Delete session

### Students
- `GET /api/addStudent?mode={mode}&type={type}` - Fetch filtered students
- `POST /api/addStudent` - Add new student

### Users
- `GET /api/users` - Fetch all users
- `GET /api/users?name={name}` - Fetch specific user with sessions

## 🎨 Key Features Implementation

### Dynamic Student Filtering
The app automatically filters students based on:
- **Mode**: Online or Offline
- **Type**: Personal, Prenatal, etc.

```javascript
// Example API call
fetch('/api/addStudent?mode=online&type=personal')
```

### Role-Based Access
- **Admin**: Access to admin dashboard, view all users
- **User**: Access to personal profile and session management

### Real-time Session Updates
- Sessions refresh automatically after create/edit/delete operations
- Optimistic UI updates with loading states

## 🚦 Getting Started Guide

### First Time Setup
1. Register a new account or use social login
2. Create your profile
3. Add students (if teaching personal/prenatal classes)
4. Start logging sessions

### Admin Setup
1. Set user role to 'admin' in MongoDB
2. Access admin dashboard at `/admin`
3. Select users to view their sessions
4. Monitor and manage all platform activities

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and not licensed for public use.

## 👤 Author

**Raghu Telkar**
- GitHub: [@raghutelkar](https://github.com/raghutelkar)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- NextAuth.js for authentication
- MongoDB for database solution
- All contributors and users of this application