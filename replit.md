# Hostel Management System

## Overview

This is a comprehensive hostel management system built as a full-stack web application. The system manages multiple entities including hostels, corporate offices, and individual users with role-based access control. Key features include user management, member tracking, meal recording, payment processing, and feedback collection. The application serves hostel owners, corporate administrators, and super admins with tailored dashboards and functionality for each role.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing instead of React Router
- Single-page application (SPA) architecture with route-based code splitting

**UI Component Strategy**
- Shadcn/ui component library based on Radix UI primitives for accessible, unstyled components
- Material Design system as the visual design language (Roboto font family, elevation patterns)
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables for theming support (light/dark mode ready)
- Component composition pattern with compound components for complex UI elements

**State Management**
- TanStack Query (React Query) for server state management with automatic caching and background refetching
- React Context API for authentication state and user session management
- Local component state with useState/useReducer for UI-specific state
- No global state management library (Redux/Zustand) - server state handled by React Query

**Data Fetching Pattern**
- Centralized API request wrapper in `lib/api.ts` with automatic token injection
- React Query hooks for declarative data fetching with loading/error states
- Optimistic updates and cache invalidation for mutations
- Bearer token authentication passed in Authorization headers

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for the REST API server
- HTTP server created using Node's built-in `http` module
- Middleware-based request/response pipeline with custom logging

**Authentication & Authorization**
- JWT (JSON Web Tokens) for stateless authentication with 7-day expiration
- Bcrypt for password hashing with 10 salt rounds
- Custom auth middleware for protected routes that verifies JWT and attaches user context
- Role-based permission system with permission arrays stored in role records
- Session secret must be configured via `SESSION_SECRET` environment variable

**API Design**
- RESTful API architecture with resource-based endpoints (`/api/users`, `/api/hostels`, etc.)
- Standard HTTP methods (GET, POST, PUT, DELETE) for CRUD operations
- JSON request/response bodies with appropriate status codes
- Error responses include descriptive error messages in `{ error: "message" }` format

**Data Access Layer**
- Storage abstraction interface (`IStorage`) defining all data operations
- Separation of concerns: routes handle HTTP, storage handles database operations
- Type-safe database operations using Drizzle ORM's query builder
- Repository pattern for each entity type (users, roles, hostels, etc.)

### Database Architecture

**ORM & Database**
- Drizzle ORM for type-safe database queries and migrations
- PostgreSQL as the primary database (via Neon serverless driver)
- Schema-first approach with TypeScript schema definitions in `shared/schema.ts`
- Auto-generated UUIDs for primary keys using `gen_random_uuid()`

**Schema Design**
- **Roles Table**: Stores role definitions with name, description, and permission arrays
- **Users Table**: User accounts with email/password, linked to roles and entities (hostel/corporate/individual)
- **Hostels Table**: Hostel properties with contact info and capacity
- **Corporate Offices Table**: Corporate office locations and contact information
- **Members Table**: Hostel/corporate members with entity association via `entityType` and `entityId`
- **Meal Records Table**: Tracks meal consumption with member, date, and meal type
- **Payments Table**: Payment records with amount, status, and entity association
- **Feedback Table**: User feedback with ratings, categories, and comments

**Entity Relationship Pattern**
- Polymorphic associations using `entityType` + `entityId` pattern
- Users can be associated with Hostels, Corporate Offices, or be Individual
- Members belong to either Hostels or Corporate Offices via the same pattern
- Foreign key references for type-safe relationships (users -> roles, etc.)

### Module Organization

**Shared Code**
- `shared/schema.ts`: Database schema and Zod validation schemas shared between client and server
- Type definitions exported for use in both frontend and backend
- Ensures type consistency across the full stack

**Client Structure**
- `client/src/pages/`: Top-level route components (dashboard, users, roles, etc.)
- `client/src/components/`: Reusable UI components organized by function
- `client/src/components/ui/`: Low-level Shadcn UI components
- `client/src/lib/`: Utilities (auth context, API client, query client, utils)
- `client/src/hooks/`: Custom React hooks (toast notifications, mobile detection)

**Server Structure**
- `server/index.ts`: Application entry point with Express setup
- `server/routes.ts`: API route definitions and handlers
- `server/auth.ts`: Authentication middleware and JWT utilities
- `server/storage.ts`: Database storage interface definition
- `server/db.ts`: Database connection and Drizzle instance
- `server/seed.ts`: Database seeding script for development
- `server/vite.ts`: Vite development server integration

## External Dependencies

### Third-Party Services
- **Neon Database**: Serverless PostgreSQL database hosting (requires `DATABASE_URL` environment variable)
- **Stripe**: Payment processing integration (Stripe.js and React Stripe.js libraries included)
- **Google Fonts**: Roboto font family and Material Icons loaded via CDN

### Key NPM Packages
- **Frontend**: React, Wouter, TanStack Query, Radix UI primitives, Recharts (for data visualization), React Hook Form with Zod resolvers
- **Backend**: Express, Drizzle ORM, Neon serverless driver, Bcrypt, JSON Web Token, TypeScript
- **Build Tools**: Vite, esbuild, TypeScript compiler, PostCSS with Tailwind CSS
- **Development**: tsx for TypeScript execution, Drizzle Kit for migrations

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `SESSION_SECRET`: JWT signing secret (required, must not use default value)
- `NODE_ENV`: Environment setting (development/production)
- `REPL_ID`: Replit-specific environment detection for development features