# 🎓 CareerGuide AI — Agentic AI Career Guidance Chatbot

An autonomous full-stack AI career guidance web application that actively guides students through a structured discovery process using **multi-step agentic reasoning** and **dynamic tool use**, rather than single-shot static responses.

---

## 🌟 Key Features

- **Autonomous Multi-Step Agentic Loop**: Turn-by-turn, the agent inspects what it knows about the student, decides which tools to invoke, processes results, updates persistent profile memory, and formulates grounded recommendations.
- **6 Autonomous Agent Tools**:
  1. `get_user_profile()` — Retrieve interests, skills, academic background, and constraints from conversation memory.
  2. `update_user_profile(field, value)` — Dynamically extract and persist newly discovered profile attributes.
  3. `search_careers(criteria)` — Query curated career pathways with growth rates, median compensation, and prerequisites.
  4. `search_courses(career_path)` — Look up accredited courses and certifications (Harvard CS50, DeepLearning.AI, Fast.ai, Google Certs, etc.).
  5. `assess_skill_gap(current_skills, target_career)` — Compare existing skills against target career requirements to calculate match percentages and missing critical skills.
  6. `generate_roadmap(career_path, timeframe)` — Produce a step-by-step phased learning and portfolio capstone action plan.
- **Real-Time Agent Thought & Tool Execution Inspector**: Watch the agent execute reasoning steps, view tool arguments, and inspect returned outputs in real time.
- **Live Dynamic Profile Sidebar**: Synchronizes user skills, interests, academic stage, and study constraints in real time with interactive tag management.
- **Interactive Rich Artifacts**:
  - Visual career recommendation cards with salary/growth indicators.
  - Skill gap breakdown matrices (Mastered vs Critical Missing vs Electives).
  - Phased learning roadmaps with interactive weekly checklists.
  - Course cards with provider badges and direct links.
- **Export & Sharing**: Export complete personalized guidance reports and roadmaps to Markdown (`.md`) or JSON (`.json`).
- **Flexible AI Engines**: Supports Anthropic Claude 3.7 Sonnet (Messages API Tool Use) or the built-in Intelligent Autonomous Simulator (zero configuration required).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **npm**: v9+

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*The backend server will start on `http://localhost:5000`.*

Optional: To configure an Anthropic API key, create a `.env` file in `backend/`:
```env
PORT=5000
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```
*(If no API key is provided, the backend seamlessly runs using its built-in Autonomous Multi-Step Reasoning Engine!)*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*The frontend Vite dev server will start on `http://localhost:5173`.*

---

## 🏗️ Architecture & Project Structure

```
career-guidance-agent/
├── backend/
│   ├── src/
│   │   ├── agent/
│   │   │   ├── agentLoop.ts       # Main agent turn orchestrator
│   │   │   ├── tools.ts           # 6 Tool definitions & universal dispatcher
│   │   │   ├── prompt.ts          # Agent system prompt & behavioral instructions
│   │   │   ├── claudeAdapter.ts   # Anthropic Claude 3.7 Sonnet tool_use loop
│   │   │   └── fallbackAgent.ts   # Autonomous zero-config multi-step reasoning engine
│   │   ├── data/
│   │   │   ├── careers.json       # 18+ comprehensive career pathways
│   │   │   └── courses.json       # 21+ curated accredited courses & certifications
│   │   ├── store/
│   │   │   └── sessionStore.ts    # Persistent multi-session memory & profile store
│   │   ├── tests/
│   │   │   ├── tools.test.ts      # Automated unit test suite for all 6 tools
│   │   │   └── server.test.ts     # End-to-end integration test suite
│   │   └── server.ts              # Express REST & SSE streaming server
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx         # Navbar with session management & export
│   │   │   ├── ChatContainer.tsx  # Message thread with quick starter chips
│   │   │   ├── MessageItem.tsx    # Markdown renderer with interactive card embeds
│   │   │   ├── AgentThoughtPill.tsx # Collapsible agent reasoning & tool execution inspector
│   │   │   ├── ProfileSidebar.tsx # Live student profile dashboard
│   │   │   ├── CareerCard.tsx     # Career recommendation card
│   │   │   ├── SkillGapView.tsx   # Skill gap percentage & breakdown view
│   │   │   ├── RoadmapView.tsx    # Phased interactive learning roadmap
│   │   │   ├── CourseList.tsx     # Course & certification card list
│   │   │   ├── SettingsModal.tsx  # AI Provider & API Key modal
│   │   │   └── ExportModal.tsx    # Markdown / JSON report exporter
│   │   ├── services/
│   │   │   └── api.ts             # REST & SSE streaming API client
│   │   ├── types/
│   │   │   └── index.ts           # TypeScript interfaces & data models
│   │   ├── App.tsx                # Root layout & state coordinator
│   │   ├── index.css              # Tailwind CSS styles & animations
│   │   └── main.tsx               # React application entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md
```

---

## 🧪 Testing

Run tool unit tests:
```bash
cd backend
npx tsx src/tests/tools.test.ts
```

Run full end-to-end multi-turn chat integration tests:
```bash
cd backend
npx tsx src/tests/server.test.ts
```
