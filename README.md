# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## Host on your own Supabase

You can run the backend (Edge Functions) and point the app to **your own** Supabase project instead of the one Lovable set up.

### 1. Create or use your Supabase project

- Go to [supabase.com](https://supabase.com) and create a project (or use an existing one).
- In **Project Settings → API**, copy:
  - **Project URL** → use as `VITE_SUPABASE_URL`
  - **anon public** key → use as `VITE_SUPABASE_PUBLISHABLE_KEY`
  - **Project ID** (in the URL or settings) → use as `VITE_SUPABASE_PROJECT_ID`

### 2. Point the app to your project

In the project root, create or update `.env`:

```env
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

Do **not** commit real keys; use `.env.local` or keep `.env` in `.gitignore` if it isn’t already.

### 3. Link and deploy Edge Functions

Install the [Supabase CLI](https://supabase.com/docs/guides/cli) if needed, then:

```sh
# Log in and link this repo to your project
npx supabase login
npx supabase link --project-ref your-project-id

# Deploy all Edge Functions
npx supabase functions deploy treatment-navigator
npx supabase functions deploy trial-finder
npx supabase functions deploy tts-generate
```

If your `supabase/config.toml` has a different `project_id`, linking overrides it for CLI commands.

### 4. Set Edge Function secrets

Your functions need these env vars (set as Supabase “secrets”):

| Secret | Used by |
|--------|--------|
| `AIMLAPI_API_KEY` | treatment-navigator, trial-finder |
| `FIRECRAWL_API_KEY` | treatment-navigator, trial-finder |
| `PERPLEXITY_API_KEY` | treatment-navigator, trial-finder |
| `ELEVENLABS_API_KEY` | tts-generate |

Example (replace with your real values):

```sh
npx supabase secrets set AIMLAPI_API_KEY=your-aiml-key
npx supabase secrets set FIRECRAWL_API_KEY=your-firecrawl-key
npx supabase secrets set PERPLEXITY_API_KEY=your-perplexity-key
npx supabase secrets set ELEVENLABS_API_KEY=your-elevenlabs-key
```

### 5. Run the app

```sh
npm i
npm run dev
```

The app uses only `VITE_SUPABASE_*` to talk to Supabase; there is no Lovable-specific backend. Once the env points to your project and the functions are deployed and secrets are set, everything runs on your Supabase.
