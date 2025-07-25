# HopeCamp - Event Management Platform

## Overview

HopeCamp is a comprehensive event management platform built for youth camps and events. This full-stack application streamlines participant registration, financial tracking, and administrative management, providing organizers with powerful tools to manage events from signup to completion.

## Key Features

### 🎯 **Multi-Step Registration System**
- **Smart Registration Flow**: Multi-step registration process with form validation using React Hook Form and Zod
- **Profile Management**: Complete participant profiles with photo uploads, personal details, and preferences
- **Dynamic Date Selection**: Flexible camp duration selection with automatic pricing calculations
- **Transport Coordination**: Transport preference management (personal car, shared rides, group transport)
- **Family Integration**: Support for family member registrations with special pricing

### 💰 **Financial Management**
- **Payment Tracking**: Track payments made by participants with multiple collector options
- **Market Transaction System**: Debt and payment tracking system with real-time calculations
- **Financial Dashboard**: Live tracking of payments, debts, and financial summaries
- **Configurable Debt Thresholds**: Admin-settable thresholds for debt filtering and management
- **Expense and Income Tracking**: Comprehensive financial management with categorized transactions

### 👥 **Admin Panel**
- **Permission-Based Access Control**: Granular RBAC system with categories (users, market, messages, financial, admin, groups, settings)
- **User Management**: Complete participant management with search, filter, edit, and delete operations
- **Group Management**: Small group creation and assignment system for participants
- **Message System**: Built-in messaging system for participant communication
- **Market Management**: Transaction management with debt tracking and mobile-responsive interface
- **CSV Export**: Export participant data and financial information

### 🔐 **Security & Authentication**
- **Phone-Based Authentication**: OTP verification using Supabase Auth
- **Role-Based Access Control**: Granular permissions system replacing simple admin flags
- **Row Level Security**: Database-level security using Supabase RLS
- **Protected Routes**: Page-level protection with permission requirements

### 📱 **Mobile-First Design**
- **Responsive Interface**: Optimized for all device sizes with consistent container layouts
- **Mobile-Optimized Forms**: Touch-friendly forms and transaction management
- **Adaptive UI**: Components that adjust based on screen size and user permissions

## Technical Stack

### 🚀 **Core Technologies**
- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Backend**: Supabase (PostgreSQL database, Auth, Storage, Real-time)
- **UI Framework**: Tailwind CSS with Radix UI components
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Context (AuthContext) + SWR for data fetching
- **File Upload**: UploadThing integration for profile images

### 🏗️ **Architecture**
- **Modular Design**: Feature-based organization with clean separation of concerns
- **Type Safety**: Full TypeScript implementation with strict typing
- **Database Abstraction**: Clean database layer with dedicated modules per entity
- **Component Library**: Reusable UI components with consistent design system
- **Testing**: Integration tests with Jest and Supabase local database

## Core Functionality

### 📝 **Registration Process**
- Multi-step form with validation at each step
- Profile photo upload with UploadThing
- Dynamic pricing based on duration and family status
- Transport preference selection
- Automatic confirmation and status tracking

### 💳 **Financial Tracking**
- Individual participant payment tracking
- Market transaction system for camp store/marketplace
- Real-time debt calculations displayed in cents, converted to RON
- Configurable debt thresholds with mobile-responsive filtering
- Income and expense categorization

### 👨‍💼 **Administration**
- Permission-based admin access with specific role assignments
- User profile editing with full data management
- Small group assignment and management
- Message system for communication
- Financial oversight with comprehensive reporting

### 🏷️ **Permission System**
- **users.read/edit/delete**: Participant management permissions
- **market.read/edit**: Market transaction permissions  
- **messages.read**: Communication system access
- **financial.read**: Financial data access
- **groups.manage**: Small group management
- **settings.manage**: System configuration
- **admins.manage**: Admin user management

## Technical Highlights

### 🔧 **Database Design**
- PostgreSQL with Supabase for backend services
- Row Level Security for data protection
- Migration-based schema management
- Dedicated database modules for each entity

### 🎨 **User Experience**
- Consistent design system across all interfaces
- Mobile-first responsive design
- Permission-based UI that adapts to user roles
- Intuitive navigation with role-appropriate menu items

### ⚡ **Performance**
- Optimized queries and data fetching
- Mobile-responsive components with adaptive layouts
- Efficient state management with React Context
- Local development environment with Docker and Supabase CLI

## Development Features

### 🧪 **Quality Assurance**
- Integration testing with Jest
- TypeScript for type safety
- ESLint for code quality
- Database migration system
- Local development with Mailpit for SMS testing

### 📊 **Data Management**
- CSV export functionality for participant data
- Real-time data synchronization
- Comprehensive participant profiles
- Financial transaction history

## Deployment & Setup

### 🚀 **Local Development**
- Docker-based Supabase local environment
- Hot reload development server
- Local SMS redirection to Mailpit
- Database migrations and seeding

### 🔧 **Configuration**
- Environment-based configuration
- Supabase integration for auth and database
- UploadThing for file uploads
- Configurable business logic (pricing, thresholds, etc.)

## Use Cases

### 🏕️ **Youth Camps**
- Multi-day camp registration and management
- Participant grouping and activity coordination
- Financial tracking for camp fees and marketplace transactions

### ⛪ **Religious Organizations**  
- Church retreat and conference management
- Multi-generational event coordination
- Community group organization

---

*A modern, type-safe event management platform built with Next.js and Supabase, designed for scalability and ease of use.*