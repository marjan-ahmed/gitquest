# AI-Powered Gamified Open-Source Contribution Platform (GitQuest MVP)

An intelligent, gamified web platform that empowers beginner developers to discover actively maintained open-source repositories on GitHub, navigate unassigned issues as structured contribution missions, and build confidence with an open-source etiquette-focused Gemma AI mentor.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions were confirmed during initial requirements clarification:
> - **Discovery Mechanism**: Hybrid approach combining a curated catalog of high-quality, beginner-friendly active repositories with live GitHub API exploration and real-time issue availability checks.
> - **AI Mentor Persona**: Friendly, encouraging guide emphasizing open-source etiquette, maintainer empathy, concise actionable hints, and PR readiness.
> - **Visual Identity**: Modern dark developer console styling with crisp typographic hierarchy, deep obsidian/slate canvas (`#090D16`), and vibrant cyber neon accents (`#10B981` emerald, `#06B6D4` cyan, `#8B5CF6` violet) with zero pill clutter.

---

## 1. Overview & Core Concept

- **What It Does**: Bridges the intimidating gap between learning to code and contributing to real-world open-source software. Beginners complete a 2-minute adaptive onboarding assessment (with optional resume/portfolio ingestion) to generate a verified skill profile. The platform then pairs them with live unassigned issues structured into 8-stage "Missions," accompanied by a Gemma-powered AI Mentor that explains repository context, breaks down issues, provides progressive hints, and drafts maintainer-ready PR descriptions.
- **Target Audience**: Aspiring contributors, junior developers, bootcamp graduates, and CS students eager to gain verifiable GitHub experience without burning out or submitting spam PRs.
- **Key Value**: Replaces aimless issue searching with curated, health-verified issues, maintainer etiquette coaching, and gamified XP/badge progression that rewards contribution quality over volume.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Interactive Onboarding & Profile Generation**:
   - 5-question adaptive assessment (experience level, technologies, contribution types, Git confidence, primary goals).
   - Optional resume/portfolio dropzone with instant client/server extraction.
   - Profile review modal displaying claimed vs. demonstrated skills, starter rank, and target technologies.
2. **Mission Command (Dashboard & Explorer)**:
   - High-level contributor stats: Level, XP, contribution streak, active missions, and etiquette score.
   - Filterable Mission Explorer: filter by language (TypeScript, Python, Rust, Go, etc.), difficulty (Beginner, Intermediate, Advanced), issue type (Bug, Feature, Docs, Tests), and repository health score.
   - Live availability revalidation: confirms the issue has zero assignees and no open duplicate PRs before starting.
3. **8-Stage Mission Workspace**:
   - Stage 1: Discover & Claim Mission
   - Stage 2: Understand the Issue (AI breakdown in plain English)
   - Stage 3: Repository & Architecture Exploration
   - Stage 4: Solution Planning & Checklist
   - Stage 5: Implementation & Progressive Hints (3 progressive levels without spoiling the full solution)
   - Stage 6: Contribution Verification & Local Testing Checklist
   - Stage 7: Pull Request Generator (semantic title, linked issue, maintainer checklist)
   - Stage 8: Review & Feedback Reflection (earn XP, unlock badges)
4. **Gemma AI Mentor Panel**:
   - Dockable side drawer and inline guidance in the Mission Workspace.
   - Etiquette tips: how to ask maintainers questions politely, how to reference issues, avoiding unsolicited massive refactors.
   - Real-time Q&A grounded in issue description and repository context.

### Visual Identity & Theme

- **Aesthetic Direction**: High-performance dark developer command center, evoking modern developer tools like Raycast, Linear, and GitHub CLI, combined with tasteful gamification indicators.
- **Color Palette**:
  - Background Canvas: `#090D16` (Deep Obsidian)
  - Surface Neutral: `#111827` (Charcoal Slate) with `#1F2937` borders
  - Primary Accent: `#10B981` (Emerald Neon) for active states and success milestones
  - Secondary Accent: `#06B6D4` (Cyan Neon) for AI mentor interactions and hints
  - Gamification Accent: `#8B5CF6` (Violet) for XP, levels, and milestone badges
  - Text: `#F9FAFB` (Primary Heading), `#9CA3AF` (Muted Metadata)
- **Typography & Formatting**:
  - Sans: `Plus Jakarta Sans` / `Inter` fallback for display and body prose.
  - Monospace: `JetBrains Mono` / `tabular-nums` for code snippets, git branches, and metric counters.
  - Strict Anti-Slop: Unboxed metadata tags separated by `·`, single-line buttons, no decorative pulsing dots, zero fake telemetry tickers.

---

## 3. Key Product Decisions & Trade-Offs

- **Hybrid Repository & Issue Discovery**:
  - *Chosen Approach*: Maintain a curated list of vetted, active repositories (e.g. FreeCodeCamp, Express, Vite, Excalidraw, Supabase, Redux, Svelte, Fastify) with real-time GitHub REST API query fallback for user-entered repos or live issue state checks.
  - *Why*: Direct public GitHub Search API has strict unauthenticated rate limits (60 req/hour). A curated active repository index guarantees lightning-fast, high-quality, verified missions on first load while allowing live checks when requested.
- **Server-Side Gemini/Gemma Integration**:
  - *Chosen Approach*: Full-stack Express backend (`server.ts`) mounting the official `@google/genai` SDK (`gemini-3.8-flash` as primary inference engine for profile extraction and mentor advice), exposing clean REST endpoints (`/api/mentor/chat`, `/api/profile/analyze`, `/api/missions/revalidate`).
  - *Why*: Protects credentials, prevents client bundle bloat, and complies with AI Studio security standards.
- **Local Persistence & State Management**:
  - *Chosen Approach*: Browser `localStorage` backed by persistent mockable database service, storing user profile, active missions, completed stages, XP, badges, and etiquette ratings.
  - *Why*: Instant zero-latency offline-first responsiveness without forcing external DB setup for the initial MVP demo, with clean schema for easy PostgreSQL migration.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Browser Frontend (React 19)                    │
│                                                                        │
│   ┌────────────────────┐   ┌────────────────────┐   ┌───────────────┐  │
│   │ Onboarding Wizard  │   │  Mission Explorer  │   │ Mission Room  │  │
│   │  (5-Step + Resume) │   │ (Filter, Repos, XP)│   │ (8-Step Guide)│  │
│   └─────────┬──────────┘   └─────────┬──────────┘   └───────┬───────┘  │
│             │                        │                      │          │
│             ▼                        ▼                      ▼          │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │         Local State Store (Profile, Quests, Badges, XP)         │  │
│   └──────────────────────────────────┬──────────────────────────────┘  │
└──────────────────────────────────────┼─────────────────────────────────┘
                                       │ /api/* REST Calls
                                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Express Backend (`server.ts`)                   │
│                                                                        │
│   ┌─────────────────────┐   ┌────────────────────┐   ┌───────────────┐ │
│   │ /api/mentor/chat    │   │ /api/github/search │   │ /api/profile  │ │
│   │ (Gemma AI Guidance) │   │ (Issues & Health)  │   │ (Resume Parse)│ │
│   └─────────┬───────────┘   └─────────┬──────────┘   └───────┬───────┘ │
│             │                         │                      │         │
│             ▼                         ▼                      ▼         │
│   ┌─────────────────────┐   ┌────────────────────┐                     │
│   │ @google/genai SDK   │   │ GitHub REST API    │                     │
│   │ (gemini-3.8-flash)  │   │ (Health & Issues)  │                     │
│   └─────────────────────┘   └────────────────────┘                     │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & Entities

- **UserProfile**: `id`, `githubUsername`, `experienceLevel`, `skillsClaimed`, `skillsDemonstrated`, `interests`, `learningGoals`, `totalXp`, `level`, `badges`, `streakDays`, `etiquetteScore`.
- **Repository**: `id`, `owner`, `name`, `stars`, `forks`, `healthScore`, `lastCommitDate`, `prResponseRateHours`, `language`, `contributionGuidelinesUrl`.
- **Mission**: `id`, `repoId`, `issueNumber`, `title`, `description`, `difficulty` (`Beginner` | `Intermediate` | `Advanced`), `type` (`bug` | `feature` | `docs` | `tests`), `technologies`, `xpReward`, `isAssigned`, `availabilityStatus`, `aiExplanation`, `whyRecommended`.
- **MissionProgress**: `missionId`, `currentStage` (1 to 8), `stageChecklists`, `unlockedHints`, `notes`, `draftPr`, `completedAt`.
- **EtiquetteGuide**: Rules for commenting, claiming issues, fork-branch-PR workflow, and clean commit etiquette.

---

## 5. Verification Plan

- Run TypeScript build validation with `compile_applet`.
- Verify full-stack dev server responds at port 3000 with Vite middleware.
- Test onboarding assessment flow and instant developer profile synthesis.
- Test mission filtering, repository health calculation, and issue revalidation.
- Test Gemma AI mentor chat and progressive hints in the 8-step mission workspace.
- Confirm anti-slop visual standards: clean unboxed metadata, zero pill badge sandwiches, and responsive high-contrast dark theme.
