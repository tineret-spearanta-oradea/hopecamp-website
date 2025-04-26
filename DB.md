## Application Workflow

1. **User Registration**: A new user registers through the application form. This creates an entry in `auth.users` and,
   via the `handle_new_user` trigger, inserts records into `user_profiles` and `registrations` (if the current edition
   is open). Initially, the user is not confirmed (`is_confirmed = false` in `registrations`).
2. **User Confirmation**: An admin reviews the registration. If approved, the admin marks the registration as
   confirmed (`is_confirmed = true`). Only confirmed users can send messages.
3. **Admin Role**: A confirmed user can be granted the 'admin' role **for an edition** by an existing admin or
   superadmin. This is stored in the `user_registration_roles` table (`is_admin = true`). Admins can:
    * View and edit other users' registration and profile data.
    * Confirm new user registrations.
    * View financial data (incomes and expenses).
    * Mark messages as read.
    * Assign/remove the 'admin' role for other users.
4. **Superadmin Role**: An admin can be further promoted to 'superadmin'. This is stored in the `user_roles`
   table (`is_super_admin = true`). Superadmins have all admin privileges plus the ability to:
    * Delete users entirely from the system (including their auth entry, profile, and registrations).
    * Assign/remove the 'superadmin' role for other users.
5. **Messaging**: Confirmed users can send messages (`messages` table). Admins can view all messages and mark them as
   read.
6. **Financials**: Admins can view aggregated income (from `registrations.amount_paid`) and add/view
   expenses (`expenses` table).

## Database Structure Overview

This section outlines the main tables and their corresponding TypeScript interfaces used in the application.

| Table Name                | Migration File                                            | TypeScript Interface                  | Interface File              | Description                                                             |
|:--------------------------|:----------------------------------------------------------|:--------------------------------------|:----------------------------|:------------------------------------------------------------------------|
| `auth.users`              | (Supabase internal)                                       | `User` (from `@supabase/supabase-js`) | `@supabase/supabase-js`     | Stores authentication information (email, password hash, etc.).         |
| `editions`                | `20250410180529_create_editions_table.sql`                | `Edition`                             | `types/edition.ts`          | Defines camp editions (e.g., "Hope Camp 2025"), dates, and open status. |
| `user_profiles`           | `20250410180527_create_user_profiles_table.sql`           | `UserProfile`                         | `types/userProfile.ts`      | Stores basic user profile information (name, age, phone, image).        |
| `user_roles`              | `20250410180528_create_user_roles_table.sql`              | (Part of `UserProfile`)               | `types/userProfile.ts`      | Stores the global superadmin role status for a user.                    |
| `registrations`           | `20250410180530_create_registrations_table.sql`           | `UserRegistration`                    | `types/userRegistration.ts` | Links users to specific editions and stores registration details.       |
| `user_registration_roles` | `20250410180531_create_user_registration_roles_table.sql` | (Part of `UserRegistration`)          | `types/userRegistration.ts` | Stores the admin role status for a specific user *registration*.        |
| `messages`                | `20250413130554_create_messages_table.sql`                | `Message`                             | `types/message.ts`          | Stores messages sent by users, linked to their registration.            |
| `expenses`                | `20250413140419_create_expenses_table.sql`                | `Expense`, `NewExpense`               | `types/expense.ts`          | Stores camp expenses added by admins.                                   |
| `auth_users_view`         | `20250413182523_create_users_view.sql`                    | (Used internally in queries)          | N/A                         | A view exposing `id` and `email` from `auth.users` for easier joins.    |

**Combined Interface:**

* `RegistrationWithProfile` (`types/registrationWithProfile.ts`): Combines `UserRegistration` and `UserProfile` for
  convenience when fetching comprehensive user data related to a specific registration.

**Triggers:**

* `handle_new_user` (`20250410180532_create_auth_trigger.sql`): Triggered on `auth.users` insert. Creates corresponding
  entries in `user_profiles` and `registrations` based on metadata provided during signup.

### SQL to PostgREST

Use [this tool to convert the SQL query to js code](https://supabase.com/docs/guides/api/sql-to-rest).

### Applying migrations locally

`supabase db reset`. **Warning!** This will delete all data in your local database!

### SQL to Javascript / REST API

You can use the [SQL to REST API translator](https://supabase.com/docs/guides/api/sql-to-rest) to help convert SQL
queries to Supabase JavaScript client code.

### DB Tests

Integration tests for database functions are located in `lib/supabase/database/__tests__`.

**Prerequisites:**

* Supabase local development environment must be running (`supabase start`).
* Environment variables must be set up correctly (`.env.local` must be correctly set).

**Running Tests:**

* Run all integration tests: `npm run test:integration`
* Run tests in a specific file: `npm run test:integration -- <path_to_test_file>` (
  e.g., `npm run test:integration -- lib/supabase/database/__tests__/registration.integration.test.ts`)

**Warning:** Running the integration tests will **delete all data** in the connected local Supabase database instance
before execution, ensuring a clean state for each run. Do **NOT** run these tests against a production database.
