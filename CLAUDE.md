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
- Admin roles: `isAdmin` and `isSuperAdmin` flags in user profiles
- Protected routes use `RequireAuth` and `AdminProtected` components

### Database Pattern
- Database operations are abstracted in `lib/supabase/database/` modules
- Each entity (user, registration, message, etc.) has its own database module
- Integration tests are located in `lib/supabase/database/__tests__/`
- Helper functions for testing are in `lib/supabase/database/__tests__/helpers/`

### Key Features
- **Registration System**: Multi-step camp registration with user profiles
- **Admin Panel**: User management, financial tracking, message system
- **File Upload**: Profile images via UploadThing/Supabase Storage
- **Authentication**: Phone-based auth with OTP verification
- **Responsive Design**: Mobile-first with Tailwind CSS

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