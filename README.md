# GitQuest ⚡
> **AI-Powered Gamified Open-Source Contribution Platform**  
> *Discover your true capabilities. Claim verified missions. Become a trusted open-source contributor.*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.x-black?style=flat-square&logo=express)](https://expressjs.com/)
[![Gemini API](https://img.shields.io/badge/AI-Gemma%20%2F%20Gemini%20API-8E75C4?style=flat-square&logo=google)](https://ai.google.dev/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-green.svg?style=flat-square)](LICENSE)

---

## 🎯 Overview

Open-source contribution is notoriously intimidating for beginner and intermediate developers. They encounter abandoned repositories, unassigned issues that are already taken, dread of negative maintainer reactions, and difficulty navigating complex codebases.

**GitQuest** turns the open-source journey into an authentic, gamified flight deck:
1. **Inspects your real GitHub repositories** to distinguish **demonstrated capabilities** from self-reported buzzwords.
2. **Filters out zombie projects** by calculating real repository health scores and maintainer velocity metrics.
3. **Pairs you with active bounties** using a personalized dynamic **Affinity Score (0–100%)**.
4. **Guides you with the Gemma AI Tactical Mentor**, delivering progressive hints (from architectural nudge down to code diffs) and maintainer-compliant PR descriptions.

---

## ✨ Key Features

### 1. 🔍 Real GitHub Profile Introspection
- Connects live to GitHub's REST API (`/users/:username` & `/users/:username/repos`).
- Automatically scans public repos to determine demonstrated languages and commit patterns.
- Distinguishes **Demonstrated Skills** (verified by public code) from **Claimed Skills** (self-reported during onboarding).

### 2. 🎯 Dynamic Affinity Matching
- Every bounty on the Bounty Board is ranked with a real-time **% Affinity** calculation:
  $$\text{Affinity} = (0.40 \times \text{Demonstrated Tech}) + (0.25 \times \text{Claimed Tech}) + (0.20 \times \text{Difficulty Fit}) + (0.15 \times \text{Health Velocity})$$
- Visual difficulty rank badges:
  - `[RANK D · NOVICE]` (50–100 XP)
  - `[RANK B · SKILLED]` (150–200 XP)
  - `[RANK S · ELITE]` (250+ XP)

### 3. 🤖 Gemma Tactical Co-Pilot
- Server-side integration with **Gemini 3.1 Flash Lite** (with automatic fallback to **Gemini 3.8 Flash**).
- **Progressive Intel Hints**:
  - **Tier 1 (Recon)**: Conceptual architecture nudge
  - **Tier 2 (Vector)**: Specific files, functions, and line pointers
  - **Tier 3 (Code Diff)**: Concrete implementation strategy
- Real-time conversational guidance emphasizing polite open-source etiquette and volunteer maintainer respect.

### 4. 🚀 8-Stage Operational Flight Deck
Guided workflow preventing PR noise and common pitfalls:
- `01. Recon & Issue Verification` (Live GitHub check confirming unassigned/open state)
- `02. Local Sector Cloning & Workspace Setup`
- `03. Bug Reproduction & Test Isolation`
- `04. Tactical Exploration & Architectural Mapping`
- `05. Patch Formulation with Gemma Hints`
- `06. Verification & Test Suite Execution`
- `07. Maintainer-Compliant PR Dispatch` (Auto-generates clean PR markdown)
- `08. Debrief, Contributor XP, & Medal Award`

### 5. 📡 Sector Radar (Live Repository Health Audit)
- Audits **any** GitHub repository URL or slug (e.g., `facebook/react`, `tailwindlabs/tailwindcss`, `vercel/next.js`).
- Evaluates commit recency, abandonment risk, open issue ratios, license presence, and maintainer response velocity.

### 6. 🛡️ Maintainer Etiquette & OSS Karma Codex
- Interactive maintainer dilemma drills testing real-world contribution judgment.
- Clear **Do vs. Don't** standards for issue claiming, PR scoping, and communication.
- The **GitQuest Contributor Pledge** awarding the `Etiquette Scholar` medal and +50 XP.

### 7. 🎖️ Contributor Dossier & Service Medals
- Track progression through contributor ranks:
  - `Rank 1: Scout`
  - `Rank 2: Initiate`
  - `Rank 3: Operative`
  - `Rank 4: Specialist`
  - `Rank 5: Commander`
- Service medal rack (`First Recon`, `Etiquette Scholar`, `Clean PR Diff`, `Bug Hunter`, `Maintainer Ally`).
- Complete mission history and verified skill matrix.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion
- **Backend**: Node.js, Express, TypeScript (`tsx`)
- **AI Engine**: `@google/genai` (Gemini 3.1 Flash Lite / Gemini 3.8 Flash)
- **External APIs**: GitHub REST API v3

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- Google Gemini API Key ([Get an API key here](https://aistudio.google.com/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/gitquest.git
   cd gitquest
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   PORT=3000
   ```

4. **Launch development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/github/user/:username` | Fetches real GitHub user profile and extracts demonstrated languages |
| `GET` | `/api/github/repo/:owner/:repo` | Audits any GitHub repository for health score, abandonment risk, and signals |
| `GET` | `/api/github/search` | Queries live GitHub issues (`is:issue is:open no:assignee label:"good first issue"`) |
| `POST` | `/api/profile/analyze` | AI analysis synthesizing claimed vs. demonstrated skills from GitHub profile data |
| `POST` | `/api/mentor/chat` | Real-time Gemma co-pilot conversation with stage-aware open-source guidance |
| `POST` | `/api/mentor/generate-pr` | Generates maintainer-compliant pull request description with test instructions |
| `POST` | `/api/missions/revalidate` | Real-time validation verifying if an issue is still open and unassigned on GitHub |

---

## 📜 The Contributor Pledge

> *"I pledge to verify issue eligibility before coding, respect maintainer time by keeping pull requests scoped and clean, provide reproduction steps for all bug fixes, and treat open-source maintainers as valued community volunteers."*

---

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.
