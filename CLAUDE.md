# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start Next.js development server
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality
- `npm run test:integration` - Run integration tests with Jest (runs serially with `--runInBand`)

## Local Development Setup

This project uses Supabase for backend services. For local development:

1. Install Docker and Supabase CLI
2. Start Supabase locally: `supabase start`
3. Create `.env.local` from `.env.local.example` with the local Supabase credentials
4. Run `npm run dev` to start development server
5. Register a user and manually set `isAdmin` and `isSuperAdmin` to `true` in the database
6. Access admin panel at `/admin`

**Important**: When switching branches or pulling changes with new migrations, run `supabase db reset` to apply the latest schema.

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Backend**: Supabase (PostgreSQL database, Auth, Storage)
- **Styling**: Tailwind CSS with Radix UI components
- **Forms**: React Hook Form with Zod validation
- **File Upload**: UploadThing integration
- **State Management**: React Context (AuthContext) + SWR for data fetching

### Key Directory Structure
- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable UI components organized by feature
- `lib/supabase/` - Supabase client configuration and database utilities
- `contexts/` - React Context providers (authentication)
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions
- `supabase/` - Database migrations and configuration

### Authentication & Authorization
- Uses Supabase Auth with phone number verification
- AuthContext provides user state management across the app
- Row Level Security (RLS) implemented in Supabase
- **Permission-Based Access Control (RBAC)**: Granular permissions system with admin_permissions and user_permissions tables
- Admin roles: `isAdmin` and `isSuperAdmin` flags in user profiles (legacy, replaced by permissions)
- Protected routes use `RequireAuth` and `AdminProtected` components with specific permission requirements
- Permission categories: users, market, messages, financial, admin, groups, settings
- Super admins have all permissions by default, regular admins start with no permissions

### Database Pattern
- Database operations are abstracted in `lib/supabase/database/` modules
- Each entity (user, registration, message, etc.) has its own database module
- Integration tests are located in `lib/supabase/database/__tests__/`
- Helper functions for testing are in `lib/supabase/database/__tests__/helpers/`

### Key Features
- **Registration System**: Multi-step camp registration with user profiles
- **Admin Panel**: User management, financial tracking, message system with permission-based access
- **Market System**: Transaction tracking with debt management and configurable thresholds
- **Permission Management**: Granular admin permissions with role-based access control
- **File Upload**: Profile images via UploadThing/Supabase Storage
- **Authentication**: Phone-based auth with OTP verification
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Group Management**: Small group assignment and management system

## Branch Strategy
- `main` - Production branch
- `develop` - Development branch (default for PRs)
- Feature branches should be created from `develop`

## Testing
- Integration tests use Jest with Supabase local database
- Tests run serially (`--runInBand`) to avoid conflicts
- Test helpers available in `lib/supabase/database/__tests__/helpers/`

## Environment Variables
- Local development uses `.env.local` with Supabase local credentials
- UploadThing token required for file uploads (optional for basic development)
- SMS OTP is redirected to Mailpit in local development (http://127.0.0.1:54324/)

## Recent Updates & New Features - 24 July 2025

### Permission-Based Access Control System (RBAC)
- **Database Schema**: Added `admin_permissions` and `user_permissions` tables
- **Permission Categories**: users, market, messages, financial, admin, groups, settings
- **Permission Service**: Centralized permission management in `lib/supabase/database/permissions.ts`
- **Auth Context Enhancement**: Added permission state and checking functions
- **Custom Hook**: `use-permissions.ts` provides convenient permission checking utilities
- **UI Components**: All admin pages now use `AdminProtected` wrapper with specific permission requirements
- **Navigation Security**: Menu items are hidden based on user permissions
- **Admin Management**: Permission assignment interface for managing admin access

### Market System Enhancements
- **Debt Tracking**: Real-time debt calculation and display
- **Configurable Thresholds**: Admin-settable debt thresholds for filtering
- **Mobile-Responsive UI**: Improved mobile experience for debt management
- **Transaction Management**: Enhanced transaction creation and editing

### UI/UX Improvements
- **Consistent Container Sizing**: Standardized admin page layouts
- **Mobile Optimization**: Better mobile experience across all admin pages
- **Permission-Based UI**: Dynamic UI based on user permissions
- **Improved Forms**: Better form validation and user feedback

### Database Migrations
- `20250723000001_create_admin_permissions_system.sql` - Permission system foundation
- `20250723000002_seed_default_permissions.sql` - Default permissions and auto-grants

### Development Guidelines
- **Permission Checking**: Always use permission-based access instead of simple admin flags
- **UI Protection**: Use `AdminProtected` component for page-level protection
- **Navigation**: Update navigation permissions when adding new admin features
- **Testing**: Include permission scenarios in integration tests