# 🦅 Flap Agent: The Autonomous Intelligence Engine

![Flap Agent Banner](https://flapagent.sh/hero_agent_avatar_1773475109161.png)

**Flap Agent** is a next-generation decentralised platform for building, deploying, and managing autonomous AI agents. Powered by advanced multi-modal models and integrated with the BNB Chain ecosystem, Flap Agent allows anyone to transform natural language into powerful, persistent digital workers.

[![Twitter](https://img.shields.io/badge/Twitter-@flapagentdotsh-black?logo=x)](https://x.com/flapagentdotsh)
[![Chain](https://img.shields.io/badge/Ecosystem-BNB_Chain-yellow)](https://www.bnbchain.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Deployment](https://img.shields.io/badge/Live-flapagent.sh-ff007f)](https://flapagent.sh)
[![Next.js](https://img.shields.io/badge/Built_with-Next.js_16-black?logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?logo=supabase)](https://supabase.com)

---

## 🗺️ Table of Contents

- [Vision & Mission](#vision--mission)
- [Key Features](#key-features)
- [Platform Pages](#platform-pages)
- [Agent Creation Flow](#agent-creation-flow)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema-supabase)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Developer API](#developer-api)
- [Web SDK](#web-sdk-integration)
- [CLI Reference](#cli-reference)
- [Tokenomics & Launch](#tokenomics--launch)
- [Roadmap](#roadmap)
- [Community & Support](#community--support)

---

## 🌐 Vision & Mission

### Our Vision
To establish a trustless ecosystem where **Agentic Swarms** collaborate seamlessly using **Verifiable Compute (TEE/zk-ML)**, democratizing enterprise-grade AI deployment globally. Flap Agent is engineered to be the foundational decentralized intelligence primitive for autonomous AI execution.

### Our Mission
Bridge the gap between natural language prompts and deterministic Web3 operations via **Neuromorphic LLM Routing** and **Graph RAG Self-Healing** workflows. We believe that anyone — regardless of technical background — should be able to create, monetize, and compose autonomous AI agents.

---

## 🚀 Key Features

### 🧠 Advanced AI Core
- **Neuromorphic LLM Routing**: Dynamically routes compute across **GPT-4o**, **Claude 3.5**, **DeepSeek V3**, and **xAI Grok-4.1-Fast-Reasoning** based on cognitive load and task complexity.
- **Graph RAG & Self-Healing Workflows**: Evolving beyond standard vector retrieval, agents build dynamic knowledge graphs to self-correct execution paths without human intervention.
- **Agentic Swarms**: Orchestrate multi-agent collaborations (e.g., Security Auditor + Market Scanner + Operations) to handle complex, multi-step objectives autonomously.
- **Long-Term Memory (LTM)**: Every agent can be equipped with persistent memory backed by Supabase PostgreSQL, allowing contextual conversations that span multiple sessions.

### 🎨 Multi-Modal Ecosystem
- **Verifiable Compute (zk-ML & TEE)**: Trustless execution environments guarantee that your agent's digital footprint and logic processing are mathematically verifiable on-chain.
- **Text-to-Image / Video & 3D Gen**: Generate high-fidelity assets, neuromorphic voices, and immersive 3D architectures directly via natural language.
- **Interactive Flow Logic**: Design complex deterministic logic gates and autonomous workflows with an interactive, zoomable node interface.
- **Web Embed**: Embed any free agent directly into your website using a single `<script>` or `<iframe>` snippet — no backend required.

### 🔍 Deterministic Web3 Primitives
- **Flap Scanner (DeFi Intel)**: Real-time, sub-second token analysis via DexScreener. Paste any contract address for instant liquidity framing and volume parsing.
- **Native BNB Smart Chain Support**: Built specifically for the BNB Chain to ensure low-latency agent operations, capable of autonomous transaction abstraction and signing.
- **Agent Marketplace**: Publish your agents globally. Set prices in BNB. Community ratings, premium badges, and integration tutorials built-in.

### 🔐 Security & Identity
- **Row Level Security (RLS)**: All Supabase tables are protected by PostgreSQL RLS policies ensuring strict multi-tenancy.
- **API Key Management**: Per-agent API keys are generated and tracked in the `api_keys` table, scoped to individual users.
- **Two-Factor Authentication (2FA)**: TOTP-based 2FA support built into the profile security modal.

---

## 🖥️ Platform Pages

| Page | Route | Description |
|------|--------|-------------|
| Home | `/` | Landing page with hero section and product overview |
| Marketplace | `/market` | Browse, purchase, or use all deployed agents |
| Console | `/console` | AI Terminal + Agent Deployer + File Manager |
| Flow Builder | `/flow` | Visual node editor for agent logic DAGs |
| Chat | `/chat` | Direct multi-model chat interface |
| My Agents | `/my-agents` | Dashboard for managing your deployed agents |
| Profile | `/profile` | User identity, settings, and security |
| Docs | `/docs` | Platform whitepaper and technical guide |

---

## ⚙️ Agent Creation Flow

```
1. DESIGN  → Open the Console (/console)
              ├── Chat with AI Terminal to generate agent logic
              ├── Use File Manager to organize generated files
              └── Configure the Agent Deployer (name, model, description, skills)

2. BUILD   → Open in Flow Builder (/flow)
              ├── Connect nodes visually into a logic DAG
              ├── Test in the built-in Chat Emulator panel
              └── Add Knowledge Base (RAG) documents or tools

3. DEPLOY  → Click "DEPLOY AGENT" in Console
              ├── Agent data is inserted into the `agents` Supabase table
              ├── Auto-redirected to Marketplace
              └── Agent is immediately visible to all users globally

4. MONETIZE → Manage in My Agents (/my-agents)
              ├── Track API call counts
              ├── Monitor BNB revenue
              └── Update agent pricing or configuration
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend Core** | Next.js 16 (Turbopack), React 19, Framer Motion |
| **Decentralized Backend** | Node.js, Serverless Edge Runtime (Vercel) |
| **State & Memory Layer** | Supabase (PostgreSQL + RLS) for LTM |
| **Intelligence Orchestration** | OpenAI SDK (GPT-4o), xAI (grok-4-1-fast-reasoning), DeepSeek V3 |
| **DeFi Data** | DexScreener Public API |
| **Styling** | Vanilla CSS + Custom Neon Glassmorphism Design System |
| **Animation** | Framer Motion (spring physics, exit transitions) |
| **Auth** | Supabase Auth (Email/Password + JWT) |

---

## 🗄️ Database Schema (Supabase)

The platform uses a multi-table relational schema with Row Level Security enabled on all tables.

```sql
-- User Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  bio TEXT,
  interests TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Definitions (Creator Schema)
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  model_type TEXT DEFAULT 'gpt-4o',
  system_prompt TEXT,
  config_json JSONB DEFAULT '{}',
  avatar_url TEXT,
  visibility TEXT DEFAULT 'public',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace Listings
CREATE TABLE public.agent_market (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  price TEXT DEFAULT 'Free',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User API Keys per Agent
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  key_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

> **RLS Policies**: All tables have Row Level Security enabled. Users can only read/write their own data. Agents and Market listings are publicly readable.

---

## 📂 Project Structure

```bash
flap-agent/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── market/           # Agent Marketplace
│   │   ├── console/          # AI Terminal + Deployer
│   │   ├── flow/             # Visual Flow Builder
│   │   ├── chat/             # Multi-model Chat
│   │   ├── my-agents/        # User Agent Dashboard
│   │   ├── profile/          # User Profile & Settings
│   │   ├── docs/             # Whitepaper / Docs
│   │   └── api/chat/         # Edge API route (AI backend)
│   ├── components/
│   │   ├── AuthContext.tsx    # Supabase Auth provider & client export
│   │   ├── ChatInterface.tsx  # Multi-model chat UI component
│   │   ├── Navbar.tsx         # Responsive navigation (auth-aware)
│   │   └── Footer.tsx         # Site footer
│   └── lib/
│       └── utils.ts           # Shared helpers
├── public/                    # Static assets & generated agent avatars
├── .env.local                 # Environment secrets (not committed)
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Custom theme & neon components
└── README.md                  # This document
```

---

## 🔧 Getting Started

### Prerequisites
- Node.js 20+
- Supabase Account (for Auth + LTM + Agent storage)
- OpenAI API Key
- xAI API Key (optional, for Grok model)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/flap-agent.git
   cd flap-agent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables** (`.env.local`):
   ```env
   OPENAI_API_KEY=your_openai_key
   XAI_API_KEY=your_xai_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   ```

4. **Initialize the Supabase database:**
   Run the SQL schema from the [Database Schema](#database-schema-supabase) section in your Supabase SQL Editor.

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Deploy to production (Vercel):**
   ```bash
   npx vercel --prod
   ```

---

## 🔌 Developer API

Every agent you deploy can be called programmatically via our secure REST API endpoints, allowing for seamless integration into any external application, Telegram/X bots, or custom dashboards.

### Chat Endpoint

```
POST https://api.flapagent.sh/v1/chat/{AGENT_ID}
```

**Headers:**
```http
Authorization: Bearer flp_live_xxx
Content-Type: application/json
```

**Request Body:**
```json
{
  "prompt": "Analyze the current market conditions for BNB...",
  "stream": true
}
```

**Response:**
```json
{
  "id": "msg_abc123",
  "content": "Based on current DeFi data...",
  "model": "grok-4-1-fast-reasoning",
  "tokens_used": 342
}
```

### Webhook Integration (Telegram Bot)

```python
import requests

WEBHOOK_URL = "https://api.flapagent.sh/v1/webhook/your_agent_id"
API_KEY = "sk_flap_your_agent_key_xxxxx"

def send_to_agent(user_message):
    response = requests.post(
        WEBHOOK_URL,
        headers={"Authorization": f"Bearer {API_KEY}"},
        json={"prompt": user_message, "platform": "telegram"}
    )
    return response.json()["content"]
```

> ⚠️ **Security Notice**: Never expose your API keys in client-side code. Always interact with the Flap Agent API via your secure backend servers.

---

## 🧩 Web SDK Integration

Integrate Flap Agent intelligence directly into your React, Next.js, or Vue applications with our lightweight SDK.

```bash
npm install @flapagent/sdk
```

```javascript
import { FlapSDK } from "@flapagent/sdk";

const sdk = new FlapSDK({ apiKey: "flp_live_xxx" });

async function analyzeToken(address) {
  const response = await sdk.chat({
    agentId: "flap_scanner_v1",
    prompt: `Analyze token ${address}`,
    model: "grok-4-1-fast-reasoning",
    stream: false
  });
  return response.content;
}

// Web Embed (iframe)
// <iframe src="https://flapagent.sh/embed/your_agent_id" width="400" height="600" />

// Script Tag Embed
// <script src="https://flapagent.sh/embed.js" data-agent="your_agent_id"></script>
```

---

## 💻 CLI Reference

Manage your agents directly from your terminal with our official command-line interface (Beta).

```bash
# Install the Flap CLI globally
npm install -g @flapagent/cli

# Authenticate with your API key
flap auth login --key flp_live_xxx

# Deploy an agent from a config file
flap deploy --agent my-scanner --chain bnb

# List all your deployed agents
flap agents list

# Check agent status and call metrics
flap agents status --id your_agent_id

# Stream live agent logs
flap logs --agent my-scanner --follow

# Delist an agent from the marketplace
flap agents delist --id your_agent_id
```

---

## 💎 Tokenomics & Launch

The Flap Agent ecosystem will be powered by a native utility token. The **Token Generation Event (TGE)** and official protocol launch will take place on our primary portal: **[flap.sh](https://flap.sh)**.

### Utility Mechanics

| Use Case | Description |
|----------|-------------|
| **Agent Minting** | Pay network fees to mint your agent configurations immutably on-chain |
| **Marketplace Currency** | The primary base pair for buying and leasing community-built agents |
| **API Consumption** | Stake tokens to increase Developer API rate limits and compute quotas |
| **Revenue Sharing** | Agent creators earn BNB from every API call made to their agent |
| **Governance** | Token holders vote on platform upgrades, fee structures, and whitelisted models |

> 📅 Token details, vesting schedules, and sale tiers will be announced at **[flap.sh](https://flap.sh)**.

## 📝 Changelog & Recent Fixes

### v0.1.1 (Current)
- **Fix (Console):** Resolved an issue where the `/console` page would render completely blank on mobile devices due to flexbox height clipping (`h-screen` and `overflow-hidden`). Added safe vertical scrolling for smaller viewports.
- **Fix (Flow):** Corrected Framer Motion `dragConstraints` on the `/flow` visual builder canvas, preventing the canvas from being locked and allowing infinite horizontal/vertical panning.
- **Feat (i18n):** Full internationalization (EN/ZH) completed, with persistent state navigation across all pages using Next.js `Link` components.
- **Feat (Release):** Official **Developer SDK (@flapagent/sdk)** and **CLI (@flapagent/cli)** released. Built for seamless autonomous agent integration and deployment.

## 🛠️ Developer SDK & CLI (v0.1.1)

We are excited to release the first modular developer tools for the Flap Network.

### 📦 TypeScript SDK
Integrated fully with our Grok-4.1-Fast and GPT-4o models.
```typescript
import { FlapSDK } from "@flapagent/sdk";

const sdk = new FlapSDK({ apiKey: "flp_live_xxx" });

// Stream chat from a deployed agent
const response = await sdk.chat({ 
  agentId: "defi-scanner-v2", 
  prompt: "Check volume for $BNB" 
});

console.log(response.content);
```

### 💻 Flap CLI
Manage your agents directly from the terminal.
```bash
# Register your API key
flap auth login --key flp_live_xxx

# Deploy a new agent
flap deploy --agent "MarketWatcher" --model grok --chain bnb

# Stream live agent logs
flap logs --agent MarketWatcher --follow
```
See the [packages/](file:///packages/) directory for full source code.

---

## 🗺️ Roadmap

| Phase | Status | Milestone |
|-------|--------|-----------|
| **Phase 1** | ✅ Live | Platform launch, AI Terminal, Agent Marketplace, Flow Builder |
| **Phase 2** | ✅ Live | Supabase LTM integration, real agent deployment, profile persistence |
| **Phase 3** | 🔄 In Progress | Token Generation Event (TGE), on-chain agent minting |
| **Phase 4** | 📅 Planned | zk-ML verifiable compute layer, multi-chain expansion |
| **Phase 5** | 📅 Planned | Agentic Swarm orchestration, autonomous transaction signing |
| **Phase 6** | 📅 Planned | Mobile SDK (iOS/Android), Plugin Marketplace |

---

## 🤝 Community & Support

- **Twitter/X**: [@flapagentdotsh](https://x.com/flapagentdotsh)
- **Website**: [flapagent.sh](https://flapagent.sh)
- **Token Portal**: [flap.sh](https://flap.sh)
- **Documentation**: [flapagent.sh/docs](https://flapagent.sh/docs)

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Flap Agent

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">
  <strong>Built with ❤️ on BNB Chain</strong><br/>
  <sub>Copyright &copy; 2026 Flap Agent. All rights reserved.</sub>
</div>
