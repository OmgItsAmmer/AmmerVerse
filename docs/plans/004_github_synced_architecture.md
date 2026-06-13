# Auto-Sync Architecture: GitHub → Portfolio
*Goal: new/updated repos on your GitHub automatically appear as project cards on AmmerVerse, no manual editing.*

---

## High-Level Flow

```
[You push to GitHub]
        │
        ▼
[GitHub Webhook] ──fires on push/repo events──▶ [Sync Service]
        │
        ▼
[Sync Service]
  1. Fetch repo metadata (GitHub API)
  2. Extract README, topics/tags, language stats
  3. Generate description/summary (optional: LLM)
  4. Classify domain (LLM/AI, Mobile, Web, Desktop) via topics/tags
  5. Write structured JSON
        │
        ▼
[Content Store] ── projects.json / database
        │
        ▼
[Portfolio Frontend] ── fetches at build time OR runtime
        │
        ▼
[Live Site Updates] (auto-redeploy or instant client fetch)
```

---

## Two Implementation Approaches

### Approach A — "Build-Time" (Vercel-style, recommended)
This mirrors exactly how Vercel auto-deploys: a webhook triggers a rebuild, the new build pulls fresh data and bakes it into static pages.

**Stack:**
- **Frontend:** Next.js (or any SSG: Astro, Vite+React with static fetch)
- **Hosting:** Vercel / Netlify / Cloudflare Pages (free tier is enough)
- **Data source:** GitHub REST API, called during build via `getStaticProps` / build script

**Flow:**
1. GitHub webhook (repo `push` event) → calls a **Deploy Hook URL** (Vercel gives you one per project)
2. Vercel triggers a new build
3. During build, a script calls `https://api.github.com/users/<you>/repos`
4. Filters repos (e.g. only repos with topic `portfolio`), extracts metadata
5. Generates `projects.json` consumed by the projects grid component
6. Site redeploys automatically — new project appears live within ~1-2 min

**Pros:** Zero servers to maintain, free, exactly the Vercel pattern you described
**Cons:** Slight delay (build time), GitHub API rate limits (60/hr unauthenticated, 5000/hr with token)

---

### Approach B — "Runtime Sync" (live without rebuild)
For instant updates without redeploying.

**Stack:**
- **Sync Service:** small serverless function (Vercel Function / Cloudflare Worker / AWS Lambda)
- **Storage:** lightweight DB (Supabase, PlanetScale, or even a GitHub Gist/JSON file in a separate repo acting as a "data repo")
- **Frontend:** fetches `projects.json` from storage at runtime (client-side `fetch` or ISR)

**Flow:**
1. GitHub webhook → serverless function endpoint (`/api/github-webhook`)
2. Function verifies webhook signature (HMAC with shared secret)
3. Function fetches updated repo metadata via GitHub API
4. Function classifies + writes to Supabase table `projects`
5. Frontend either:
   - Polls/fetches `projects` table on page load, OR
   - Uses Supabase Realtime subscription for instant updates

**Pros:** Instant, no rebuild needed, more flexible (can add LLM-generated summaries async)
**Cons:** Needs a small DB + serverless function (still free-tier friendly)

---

## Recommended: Hybrid (Best of Both)

```
GitHub repo (new/updated)
   │
   ├─ Webhook ──▶ Serverless Function
   │                  │
   │                  ├─ 1. Verify signature
   │                  ├─ 2. Fetch repo data (GitHub API)
   │                  ├─ 3. Classify domain
   │                  │     (based on repo topics: "llm", "mobile", "web", "desktop")
   │                  ├─ 4. Optional: call LLM to write a polished 1-line description
   │                  ├─ 5. Upsert into Supabase `projects` table
   │                  └─ 6. Trigger Vercel Deploy Hook (rebuild for SEO/static pages)
   │
   └─ Frontend (Next.js)
        ├─ ISR (Incremental Static Regeneration) — page revalidates every X min
        └─ Pulls from Supabase `projects` table
```

---

## Step-by-Step Setup

### 1. Define a "Portfolio-Ready" Convention
Tag repos you want shown with a GitHub **topic**: `portfolio`
Optionally add domain topics: `llm`, `mobile`, `web`, `desktop`, `devops`

### 2. GitHub Webhook Setup
- Repo (or org) → Settings → Webhooks → Add webhook
- Payload URL: your serverless function endpoint
- Content type: `application/json`
- Secret: random string (used for HMAC verification)
- Events: `Push`, `Repository` (for new repos), `Release` (optional)

### 3. Serverless Function (example structure, Node.js)

```javascript
// /api/github-webhook.js
import crypto from 'crypto';

export default async function handler(req, res) {
  // 1. Verify signature
  const signature = req.headers['x-hub-signature-256'];
  const expected = 'sha256=' + crypto
    .createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');
  if (signature !== expected) return res.status(401).end();

  const { repository } = req.body;

  // 2. Check if repo has 'portfolio' topic
  const topicsRes = await fetch(
    `https://api.github.com/repos/${repository.full_name}/topics`,
    { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                  Accept: 'application/vnd.github+json' } }
  );
  const { names: topics } = await topicsRes.json();
  if (!topics.includes('portfolio')) return res.status(200).end();

  // 3. Fetch README for description
  const readmeRes = await fetch(
    `https://api.github.com/repos/${repository.full_name}/readme`,
    { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
  );
  const readme = await readmeRes.json();
  const readmeText = Buffer.from(readme.content, 'base64').toString('utf-8');

  // 4. Classify domain from topics
  const domainMap = { llm: 'LLM/AI', mobile: 'Mobile', web: 'Web', desktop: 'Desktop', devops: 'LLM/AI' };
  const domain = topics.find(t => domainMap[t]) ? domainMap[topics.find(t => domainMap[t])] : 'Other';

  // 5. (Optional) Generate polished summary via Claude API
  const summary = await generateSummary(readmeText); // your own function

  // 6. Upsert into Supabase
  await supabase.from('projects').upsert({
    repo_name: repository.name,
    full_name: repository.full_name,
    url: repository.html_url,
    description: summary || repository.description,
    domain,
    topics,
    stars: repository.stargazers_count,
    updated_at: repository.pushed_at,
  }, { onConflict: 'full_name' });

  // 7. Trigger rebuild (optional, for static pages/SEO)
  await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' });

  return res.status(200).json({ ok: true });
}
```

### 4. Frontend Fetch (Next.js example)

```javascript
// app/projects/page.js
export const revalidate = 300; // ISR: refresh every 5 min

async function getProjects() {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false });
  return data;
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectGrid projects={projects} />;
}
```

---

## Optional Enhancements

| Feature | How |
|---------|-----|
| **AI-generated descriptions** | On webhook, send README text to Claude API → returns a polished 1-2 sentence summary, stored alongside raw description |
| **Auto screenshot generation** | Use a headless browser service (e.g. `screenshotone.com` or Puppeteer in a function) to capture a live demo URL and store the image |
| **Tech stack detection** | GitHub API `languages` endpoint returns language breakdown → auto-generate tech pill tags |
| **README-based feature extraction** | LLM parses README → extracts "Tech Stack", "Features" sections automatically into your card format |
| **Star/activity badges** | Pull `stargazers_count`, `forks_count`, last commit date → show "Active" badge if updated in last 30 days |
| **Filter sync** | Domain auto-detected from GitHub topics maps directly to your portfolio's filter bar (LLM/AI, Mobile, Web, Desktop) |

---

## Minimal Free-Tier Setup Summary

| Component | Service | Cost |
|-----------|---------|------|
| Hosting + ISR | Vercel (Hobby) | Free |
| Serverless function | Vercel Functions | Free |
| Database | Supabase (Free tier) | Free |
| GitHub API | Personal Access Token | Free (5000 req/hr) |
| AI summaries (optional) | Claude API | Pay-per-use, cheap for short text |

---

## Your Workflow Going Forward

1. Push code to a new/updated repo
2. Add topic `portfolio` (+ domain topic like `llm`)
3. Webhook fires automatically
4. Within seconds: project appears in Supabase
5. Within ~1-5 min: live on your site (ISR refresh or instant if client-fetched)

This is functionally identical to "Vercel auto-deploy" — except instead of deploying code, you're syncing *project metadata* into your portfolio's data layer.