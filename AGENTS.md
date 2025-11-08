# Edusama - Educational Management System

## Project Overview

Edusama is a comprehensive educational management system designed for schools and educational institutions. It provides a full-stack solution for managing students, teachers, assessments, attendance, curriculum, and various administrative tasks.

## Architecture & Tech Stack

### Frontend (React/TypeScript)

- **Framework**: React 19 with TypeScript
- **Routing**: TanStack Router for file-based routing
- **State Management**: Zustand for global state, TanStack Query for server state
- **Styling**: TailwindCSS with Radix UI components
- **API Client**: tRPC for type-safe API communication
- **Request Pattern**: React Query (TanStack Query) hooks combined with tRPC for server state management:
  - `useQuery` for data fetching: `useQuery(trpc.exampleEndpoint.queryOptions(filters))`
  - `useMutation` for data modification: `useMutation(trpc.exampleMutation.mutationOptions())`
- **Authentication**: Custom JWT-based authentication with bcrypt password hashing
- **Internationalization**: i18next with English and Turkish support
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite

### Backend (Node.js/TypeScript)

- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **API Layer**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom JWT authentication with access/refresh tokens, bcrypt password hashing, email invitations, OTP verification
- **File Storage**: AWS S3 integration
- **Email Service**: Nodemailer
- **SMS Service**: Custom SMS service
- **Logging**: Winston with daily rotate file transport
- **Validation**: Zod for schema validation

### Development & Infrastructure

- **Monorepo**: Yarn workspaces with packages and apps structure
- **Database Migrations**: Prisma migrations
- **Containerization**: Docker with docker-compose
- **Testing**: Vitest for unit and integration tests
- **Linting**: ESLint with custom configurations
- **Formatting**: Prettier

## Key Features & Modules

### Core Modules

1. **Authentication & Users**
   - Custom JWT-based authentication with access/refresh tokens
   - Role-based access control (RBAC) with granular permissions
   - Multi-user type support (users, students, parents)
   - Password reset, email invitations, and OTP verification

2. **Student Management**
   - Student profiles and enrollment
   - Parent associations
   - Academic records and progress tracking

3. **Assessment System**
   - Quiz and exam creation
   - Grade management
   - Assessment analytics

4. **Attendance Tracking**
   - Daily attendance recording
   - Attendance notifications (SMS/Email)
   - Attendance reports and analytics

5. **Classroom Management**
   - Classroom creation and scheduling
   - Teacher assignments
   - Student enrollment

6. **Curriculum & Subjects**
   - Subject management
   - Curriculum planning
   - Lesson planning and modules

7. **Device Management**
   - Asset tracking (laptops, tablets, etc.)
   - Assignment to students/teachers
   - Maintenance and repair tracking

8. **Branch & Company Management**
   - Multi-branch support
   - Company-wide settings
   - Branch-specific configurations

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key entities include:

- **Users**: Core user entity with role-based access
- **Students**: Student profiles with academic information
- **Parents**: Parent/guardian information linked to students
- **Teachers**: Teacher profiles and subject specializations
- **Classrooms**: Physical/virtual classroom management
- **Assessments**: Quizzes, exams, and grading
- **Attendance**: Daily attendance records
- **Curriculum**: Subject and lesson management
- **Devices**: Asset tracking for school equipment
- **Companies/Branches**: Multi-tenant architecture support

## API Structure

The backend uses tRPC for type-safe API routes organized by domain:

```
- auth: Authentication and user management
- user: General user operations
- student: Student management
- parent: Parent/guardian management
- assessment: Quiz and grading system
- attendance: Attendance tracking
- classroom: Classroom management
- curriculum: Subject and lesson planning
- device: Asset management
- role/permission: Access control
- branch/company: Multi-tenant management
```

## Internationalization

The application supports multiple languages with i18next:

- **English** (`en`): Primary language
- **Turkish** (`tr`): Secondary language

Translation files are organized by feature:

- `common`: Shared UI elements and messages
- `auth`: Authentication-related text
- `students`: Student management translations
- `assessments`: Assessment system text
- And more...

## Development Guidelines

### Code Style

- **Variables**: Use `const` and `let`, avoid `var`
- **Functions**: Prefer regular functions over arrow functions unless really required (e.g., for compact inline callbacks or maintaining lexical scope)
- **Comments**: Add comments only when necessary and functional
- **File Structure**: Follow the established patterns in existing files

### Adding Translations

When adding new UI text that requires translation:

1. Check if `en.ts` and `tr.ts` files exist for the feature
2. Update both English and Turkish translation files
3. Use the translation keys consistently across components

### Database Changes

- Use Prisma migrations for schema changes
- Run `prisma generate` after schema updates
- Test migrations in development before production

### API Development

- Use tRPC for new API routes to maintain type safety
- Follow existing router patterns in `/api` directory
- Add proper Zod validation for inputs and outputs

## Project Structure

```
edusama/
├── apps/
│   ├── web/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── features/    # Feature-specific components
│   │   │   ├── lib/         # Utilities and configurations
│   │   │   ├── routes/      # Route components
│   │   │   └── stores/      # Global state stores
│   └── server/              # Node.js backend
│       ├── src/
│       │   ├── api/         # tRPC API routes by domain
│       │   ├── prisma/      # Database schema and migrations
│       │   ├── trpc/        # tRPC configuration
│       │   ├── utils/       # Utility functions
│       │   └── middlewares/ # Express middlewares
├── packages/
│   ├── common/              # Shared types and utilities
│   ├── eslint # ESLint configurations
│   └── prettier/            # Prettier configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Docker (optional, for containerized development)

### Development Setup

1. **Install dependencies**: `yarn install`
2. **Set up database**: Configure `DATABASE_URL` in `.env`
3. **Run migrations**: `yarn workspace @edusama/server prisma:migrate`
4. **Start development servers**:
   - Frontend: `yarn workspace @edusama/web start`
   - Backend: `yarn workspace @edusama/server start:dev`

### Production Deployment

1. **Build applications**:
   - Frontend: `yarn workspace @edusama/web build`
   - Backend: `yarn workspace @edusama/server build`
2. **Run with Docker**: Use provided Dockerfiles and docker-compose files

## Common Development Tasks

- **Add new feature**: Create components in `features/` directory
- **Add API endpoint**: Add router in appropriate `api/` subdirectory
- **Database changes**: Update Prisma schema and generate migrations
- **Add translations**: Update both `en.ts` and `tr.ts` files
- **Testing**: Add tests in `__tests__` directories or test files
- **Linting**: Run `yarn fix:all` to format and lint code

## Key Files for Reference

- **Frontend entry**: `apps/web/src/main.tsx`
- **Backend entry**: `apps/server/src/server.ts`
- **Database schema**: `apps/server/src/prisma/schema.prisma`
- **tRPC configuration**: `apps/server/src/trpc/`
- **Translation files**: `apps/web/src/lib/i18n/`
- **Type definitions**: `packages/common/src/types.ts`

This documentation provides context for AI assistants working with the Edusama codebase. When making changes, ensure you follow the established patterns and update translations when adding user-facing text.
