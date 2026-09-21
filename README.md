# Darukaa.Earth: AI Biodiversity Intelligence System

[![CI Pipeline](https://github.com/darukaa-earth-submission/ai-biodiversity-intelligence/actions/workflows/ci.yml/badge.svg)](https://github.com/darukaa-earth-submission/ai-biodiversity-intelligence/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Stack](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green.svg)](backend)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Next.js%20%7C%20Tailwind-blue.svg)](frontend)

> **Hackathon Challenge Solution**: A knowledge-grounded AI Environmental Scientist conversational system designed for depth of thinking, multi-variable ecological reasoning, and evidence-backed land restoration.

---

## 🌿 System Overview

Unlike shallow LLM wrappers or generic chatbots, the **Darukaa.Earth AI Biodiversity Intelligence System** is engineered from first principles as an **AI Environmental Scientist**. It dynamically evaluates coupled ecological relationships across **$\ge 3$ interconnected environmental variables** (Soil Organic Carbon, Precipitation/Moisture Regimes, Land Cover Stratification, Soil Microbiome/Mycorrhizae, and Trophic Pollinator Corridors) and produces **non-obvious, quantifiable, evidence-backed recommendations** grounded in peer-reviewed scientific studies from **FAO, IPCC AR6, IPBES, ICRAF/World Agroforestry, Nature, and Science**.

```
                               ┌────────────────────────────────────────────────────────┐
                               │       Frontend: Next.js + React + Tailwind CSS         │
                               │  - Interactive Scientific Conversational Workbench     │
                               │  - Multi-Metric Trajectory Forecaster (1, 3, 10 Yrs)   │
                               │  - Mechanistic Biochemical Causal Graph Viewer         │
                               │  - Live RAG Evidence Inspector (FAO, IPCC, IPBES)      │
                               │  - Geo-Spatial Parameter Sandbox & Coordinate Lookup   │
                               └───────────────────────────┬────────────────────────────┘
                                                           │ REST API (JSON)
                                                           ▼
                               ┌────────────────────────────────────────────────────────┐
                               │         Backend: Node.js + Express (ES Modules)        │
                               │                                                        │
                               │  ┌──────────────────────────────────────────────────┐  │
                               │  │   Dialogue State Manager & Clarification Engine  │  │
                               │  │   - Multi-turn conversation memory               │  │
                               │  │   - Parameter extractor (SOC %, rainfall, crop)  │  │
                               │  │   - Intelligent clarification prompts            │  │
                               │  └────────────────────────┬─────────────────────────┘  │
                               │                           │                            │
                               │  ┌────────────────────────▼─────────────────────────┐  │
                               │  │        Multi-Metric Reasoning Engine             │  │
                               │  │   - Connects >= 3 environmental variables        │  │
                               │  │   - Biochemical & hydrological causal pathways   │  │
                               │  │   - Quantified delta forecasting matrix          │  │
                               │  └────────────────────────┬─────────────────────────┘  │
                               │                           │                            │
                               │  ┌────────────────────────▼─────────────────────────┐  │
                               │  │       Knowledge Layer & Hybrid Vector RAG        │  │
                               │  │   - Curated scientific corpus (FAO, IPCC, etc.)  │  │
                               │  │   - Vector TF-IDF / Cosine semantic search       │  │
                               │  │   - Transparent citation & DOI attribution       │  │
                               │  └──────────────────────────────────────────────────┘  │
                               └────────────────────────────────────────────────────────┘
```

---

## 🎯 Core Requirements & Technical Highlights

| Requirement | Implementation Detail |
| :--- | :--- |
| **1. Knowledge System (Critical)** | Structured knowledge layer indexing 8+ peer-reviewed reports (FAO 2022, IPCC AR6 WGII Ch. 5, IPBES Global Assessment 2019, ICRAF 2020, Nature Plants 2023). Uses Hybrid Vector RAG with TF-IDF, cosine similarity, and taxonomy boosting. |
| **2. Conversational Intelligence** | Multi-turn state manager. Detects incomplete inputs (e.g. *"Biodiversity is declining on my land"*) and generates targeted clarifying questions for missing variables (SOC %, rainfall pattern, land use). |
| **3. Evidence-Backed Recommendations** | Strict zero-shallow policy. Prescribes exact interventions with **What to do**, **Why it works (biochemical/hydrological mechanisms)**, **Impacted metric deltas**, and **Authoritative citations**. |
| **4. Multi-Metric Coupling ($\ge 3$ variables)** | Analyzes complex feedback loops between **Soil Health (SOC, pH)** $\leftrightarrow$ **Hydrological/Climate Stress (aridity, VPD)** $\leftrightarrow$ **Land Cover** $\leftrightarrow$ **Soil Biome (AMF mycorrhizae, earthworms)** $\leftrightarrow$ **Wild Pollinators**. |
| **5. Input Handling & Spatial Context** | Natural language text, structured JSON parameter runner, and Geo-coordinates resolution (auto-resolves Köppen climate classes, rainfall averages, and soil orders like Vertisols/Alfisols). |
| **6. Output Quality & Trajectories** | Delivers 3-tier quantitative trajectory forecasting matrix for **Year 1 (Short Term)**, **Year 3 (Medium Term)**, and **Year 10 (Climax)**. |

---

## 🔬 Benchmark Case Study Validation

### Input (Challenge Specification Benchmark)
* **Soil Organic Carbon (SOC)**: `0.3%`
* **Rainfall**: `Low (semi-arid)`
* **Crop**: `Monoculture wheat`
* **Region**: `Semi-arid`

### AI Environmental Scientist Output
1. **Primary Intervention**: **Reverse-Phenology Evergreen Agroforestry with *Faidherbia albida* (30 trees/ha) + *Cajanus cajan* (Pigeon Pea)**
   * **Why It Works**: *Faidherbia albida* exhibits reverse phenology—it drops nitrogen-rich leaves during the rainy crop season (eliminating canopy light competition with wheat) and supplies 35–55 kg bioavailable N/ha. 15m taproots execute hydraulic lift, drawing subterranean water to upper horizons. Glomalin exudation cements soil micro-aggregates.
   * **Quantified Deltas**:
     * Soil Organic Carbon: $+18\%$ to $+32\%$ over 3 years (reaching $\approx 0.48\%$ SOC).
     * Topsoil Water-Holding Capacity: $+28\%$ to $+38\%$ moisture retention.
     * Canopy Temperature Buffer: $2.2^\circ\text{C}$ to $3.8^\circ\text{C}$ mid-day cooling (IPCC AR6).
   * **Citations**: `FAO (2022) Recarbonizing Global Soils (Vol 3)` & `IPCC (2022) AR6 WGII Ch. 5`.

2. **Secondary Intervention**: **Native Perennial Flowering Bio-Corridors & Keyline Infiltration Earthworks**
   * **Quantified Deltas**: $+65\%$ wild pollinator richness; Shannon Diversity Index $H'$ increases by $+0.80$ points; $85\text{--}95\%$ episodic runoff capture.
   * **Citations**: `IPBES (2019) Global Assessment on Pollinators` & `Tschumi et al. (2022) Conservation Biology`.

---

## 📂 Repository Structure

```
AI_Biodiversity/
├── backend/                             # Node.js + Express Backend (ES Modules)
│   ├── src/
│   │   ├── knowledge/
│   │   │   ├── corpus.js               # Curated scientific knowledge corpus (FAO, IPCC, IPBES)
│   │   │   └── ragEngine.js            # Hybrid Vector RAG Search & Taxonomy Booster
│   │   ├── reasoning/
│   │   │   ├── causalGraph.js          # Biochemical & hydrological causal chain generator
│   │   │   └── ecologicalModel.js      # Multi-metric coupled reasoning & trajectory forecaster
│   │   ├── conversation/
│   │   │   ├── sessionManager.js       # Multi-turn memory & accumulated state manager
│   │   │   └── diagnosticAgent.js      # Parameter extractor & clarifying question engine
│   │   ├── spatial/
│   │   │   └── geoResolver.js          # Geo-coordinates & ecoregion climate resolver
│   │   ├── submission/
│   │   │   └── generateDocx.js         # Word submission document generator (.docx)
│   │   └── server.js                   # Express REST API routes
│   ├── tests/
│   │   └── runAllTests.js              # Automated verification test suite
│   └── package.json
│
├── frontend/                            # Next.js + React + Tailwind CSS Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.jsx              # App layout, metadata, Google fonts
│   │   │   ├── page.jsx                # Main workspace orchestrator
│   │   │   └── globals.css             # Tailwind CSS tokens & glassmorphism
│   │   └── components/
│   │       ├── Header.jsx              # Status bar & Word docx export trigger
│   │       ├── ChatPanel.jsx           # Multi-turn conversational scientist UI
│   │       └── ReasoningDashboard.jsx  # Multi-metric diagnosis, trajectory charts, RAG inspector
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml                      # GitHub Actions automated test & build pipeline
└── README.md
```

---

## 🚀 Local Setup & Quick Start

### Prerequisites
* Node.js $\ge 18.x$ (or $\ge 20.x$)
* npm $\ge 9.x$

### 1. Start the Express Backend
```bash
cd backend
npm install
npm start
```
* Backend will be running at `http://localhost:5000`
* Health Check: `http://localhost:5000/api/health`

### 2. Start the React / Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
* Open your browser at `http://localhost:3000`

---

## 🧪 Running the Automated Test Suite

To verify all RAG retrieval precision, multi-variable coupling, conversational state transitions, and `.docx` generation:

```bash
cd backend
npm test
```

### Verification Output:
```
=================================================
🧪 RUNNING AI BIODIVERSITY INTELLIGENCE TEST SUITE (ES MODULES)
=================================================

✅ PASS: Knowledge Corpus Integrity
✅ PASS: RAG Hybrid Search & Source Grounding
✅ PASS: Multi-Metric Coupling & Non-Shallow Reasoning (>= 3 variables)
✅ PASS: Dialogue Agent: Clarifying Questions on Incomplete Query
✅ PASS: Dialogue Agent: Multi-Turn Context Accumulation
✅ PASS: Geo-Spatial Context Resolution
✅ PASS: Submission Word Document (.docx) Generation

=================================================
RESULTS: 7 Passed, 0 Failed
=================================================
```

---

## 📑 Repository Access & Reviewer Information

As required by the **Darukaa.Earth Hackathon Submission Guidelines**, review and evaluation access is provisioned for:
* `ankita.dasgupta@darukaa.com`
* `harsh.kumar@darukaa.com`
* `utkarsh.gauniyal@darukaa.com`
* `guneet.mutreja@darukaa.com`

*One-Click Submission Document*: The official formatted Word document can be generated or downloaded via the application header or via `GET /api/export/docx`.
