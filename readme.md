# Getting Started

## Starting a New Project Locally

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## How to add new features / fix bugs

1. Checkout develop branch: `git checkout develop`
2. Pull latest changes: `git pull`
3. Create a new branch: `git checkout -b <branch-name>`
4. Make changes and commit: `git commit -m "Add new feature"`
5. Push changes: `git push origin <branch-name>`
6. Create a PR in the GitHub web interface. (into develop branch)
7. When the PR is approved, merge the changes into develop: `git checkout develop`

## Some guidelines

* Use descriptive names for variables, functions, classes, and files in English (except for URLs).
* Leave comments where necessary, but avoid redundant comments.
* Test changes before submitting a PR.
* Use GitHub issues for useful comments, technical details, and progress tracking.

## Run locally using Supabase

If something goes wrong, please refer to https://supabase.com/docs/guides/local-development

1. You need to have docker installed. [Read the setup guide here](https://www.docker.com/products/docker-desktop/)
2. [Verify that supabase cli is installed](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=macos#installing-the-supabase-cli)
   using `supabase -v`.
3. Start the emulator: `supabase start` (this will take some time). Please note down the `API URL`, `anon key`
   and `service_role key`!
   You can see the dashboard at http://127.0.0.1:54323/project/default . For postgres you can use this db
   url: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`.
4. Create a new `.env.local` based on `.env.local.example`: `cp .env.local.example .env.local`.
   Populate `NEXT_PUBLIC_SUPABASE_ANON_KEY` with the `anon key`, `SUPABASE_SERVICE_ROLE_KEY` with `service_role key:`
   from step 3. Please also check that the `API URL` is the same as `NEXT_PUBLIC_SUPABASE_URL`
7. (Optional) Create a new account for https://uploadthing.com and set the `UPLOADTHING_TOKEN` env var in `.env.local`
8. Start the server with `npm run dev`
9. Register a user. Please note that a picture is not needed. You can see the emails sent at http://127.0.0.1:54324/
10. Make the user admin and super admin: Go to http://127.0.0.1:54323/project/default/editor, select
    the `users_data` table find your user UID and set the `isAdmin` and `isSuperAdmin` to `true`
11. Reload the page, and you should see a button for admin page. Or you can go to http://localhost:3000/admin
12. `supabase stop` to stop the containers

### Applying migrations

You can apply migrations locally by resetting the db: `supabase db reset`

### Supabase access rules

Supabase uses [psql row level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
