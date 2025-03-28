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
6. Create a PR in the GitHub web interface.
7. When the PR is approved, merge the changes into main: `git checkout main`

## Some guidelines

* Use descriptive names for variables, functions, classes, and files in English (except for URLs).
* Leave comments where necessary, but avoid redundant comments.
* Test changes before submitting a PR.
* Use GitHub issues for useful comments, technical details, and progress tracking.

## Run locally using Firebase Emulator

1. [Install firebase CLI](https://firebase.google.com/docs/emulator-suite/install_and_configure)
   using `npm install -g firebase-tools`. You can check what firebase version was installed using `firebase --version`
2. Initialise firebase: `firebase init` and select `Emulators: Set up local emulators for Firebase products`. When
   asked to select a project, select `Don't set up a default project `
3. For emulator setup, select `Authentication Emulator` and `Firestore Emulator`
4. Download the emulators when prompted `Would you like to download the emulators now?`
5. Start the emulator: `firebase emulators:start --project demo-hopecamp`. You can see the Users created locally
   at http://127.0.0.1:4000/auth and the firestore at http://127.0.0.1:4000/firestore
6. Create a new `.env.local` based on `.env.local.example`: `cp .env.local.example .env.local`.
7. (Optional) Create a new account for https://uploadthing.com and set the `UPLOADTHING_TOKEN` env var in `.env.local`
8. Start the server with `npm run dev`
9. Register a user. Please note that a picture is not needed.
10. Make the user admin and super admin: Go to Firestore http://127.0.0.1:4000/firestore , click on users collection,
    find your user UID and set the `isAdmin` and `isSuperAdmin` to `true`
11. Reload the page, and you should see a button for admin page. Or you can go to http://localhost:3000/admin

### Firestore access rules

You can test the access rules in emulator by changing `./firestore.emulator.rules`. The rules should be loaded after
your changes without restarting the emulator.