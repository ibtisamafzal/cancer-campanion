# Cancer Companion

A patient-focused application for cancer treatment navigation and clinical trial discovery, developed for the **[Med-Gemma Impact Challenge](https://www.kaggle.com/competitions/med-gemma-impact-challenge)** on Kaggle.

---

## Overview

Cancer Companion helps patients and caregivers explore treatment options and find relevant clinical trials. The application provides AI-assisted treatment navigation, trial matching, and text-to-speech support for accessibility.

## Competition

This project was built as an entry for the [Med-Gemma Impact Challenge](https://www.kaggle.com/competitions/med-gemma-impact-challenge), a Kaggle competition focused on applying medical AI to real-world impact.

---

## Tech Stack

- **Frontend:** Vite, TypeScript, React  
- **UI:** shadcn-ui, Tailwind CSS  
- **Backend:** Supabase (Edge Functions)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm (recommended: [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Local Development

```bash
git clone <YOUR_GIT_URL>
cd cancer-campanion
npm install
npm run dev
```

The development server runs with hot reload. Open the URL shown in the terminal to view the app.

### Editing Options

- **Local IDE:** Clone the repository and work in your preferred editor; push changes to your remote as usual.
- **GitHub:** Use the web editor (Edit button on any file) to make and commit changes.
- **GitHub Codespaces:** Open the repo → Code → Codespaces → New codespace to develop in the cloud.

---

## Deployment: Hosting on Your Own Supabase

The backend runs on Supabase Edge Functions. You can use your own Supabase project instead of a shared instance.

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project (or use an existing one).
2. In **Project Settings → API**, note:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **Project ID** → `VITE_SUPABASE_PROJECT_ID`

### 2. Configure environment

In the project root, create or update `.env` (or `.env.local`; do not commit secrets):

```env
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

### 3. Deploy Edge Functions

Install the [Supabase CLI](https://supabase.com/docs/guides/cli), then:

```bash
npx supabase login
npx supabase link --project-ref your-project-id

npx supabase functions deploy treatment-navigator
npx supabase functions deploy trial-finder
npx supabase functions deploy tts-generate
```

### 4. Set function secrets

Configure these secrets in your Supabase project:

| Secret | Functions |
|--------|-----------|
| `AIMLAPI_API_KEY` | treatment-navigator, trial-finder |
| `FIRECRAWL_API_KEY` | treatment-navigator, trial-finder |
| `PERPLEXITY_API_KEY` | treatment-navigator, trial-finder |
| `ELEVENLABS_API_KEY` | tts-generate |

Example:

```bash
npx supabase secrets set AIMLAPI_API_KEY=your-aiml-key
npx supabase secrets set FIRECRAWL_API_KEY=your-firecrawl-key
npx supabase secrets set PERPLEXITY_API_KEY=your-perplexity-key
npx supabase secrets set ELEVENLABS_API_KEY=your-elevenlabs-key
```

### 5. Run the application

```bash
npm install
npm run dev
```

With a valid `.env`, deployed functions, and secrets set, the app runs entirely against your Supabase project.

---

## License

See the repository for license information.
