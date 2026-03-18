# WT PPA Interactive Services Showcase — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive hex-grid services showcase for WT Partnership's PPA team, embeddable in SharePoint via iframe.

**Architecture:** Static site built with Vite + vanilla JS. GSAP handles animation orchestration. All service data lives in a single JS data module. The hex grid is rendered to a canvas/SVG layer with DOM overlays for text. State management is plain JS (no framework).

**Tech Stack:** Vite, GSAP (core + ScrollTrigger), vanilla JS/CSS, canvas for particles

**Spec:** `docs/superpowers/specs/2026-03-18-wt-ppa-interactive-services-showcase-design.md`

---

## File Structure

```
src/
├── index.html                  # Shell with inline critical CSS, loading state
├── main.js                     # Entry point — orchestrates init sequence
├── styles/
│   ├── variables.css           # CSS custom properties (colours, spacing, breakpoints)
│   ├── base.css                # Reset, typography, body styles
│   ├── header.css              # Header bar styles
│   ├── hex-grid.css            # Hex grid container, hex shapes, connection lines
│   ├── detail-panel.css        # Glassmorphism detail panel
│   ├── filters.css             # Filter buttons, toggle controls panel
│   ├── stats-bar.css           # Stats bar section
│   ├── case-studies.css        # Case study cards, modal overlay
│   ├── contacts.css            # Contact cards section
│   ├── footer.css              # Footer styles
│   └── mobile.css              # <768px accordion fallback
├── data/
│   ├── services.js             # Complete service hierarchy, tags, bullets, contacts, relations
│   ├── case-studies.js         # Placeholder case study data
│   └── sectors.js              # Sector list + placeholder sector-service mapping
├── components/
│   ├── hex-grid/
│   │   ├── layout.js           # Force-directed hex position calculator
│   │   ├── renderer.js         # Creates hex DOM elements + SVG connection lines
│   │   ├── interactions.js     # Click, hover, focus/dim behaviours
│   │   └── animations.js       # GSAP entrance animation sequence
│   ├── detail-panel.js         # Panel open/close/swap, content rendering
│   ├── filters.js              # People/Process/Tech filter state + hex dim/glow
│   ├── toggle-controls.js      # Collapsible panel, connections/sector/tour/digital toggles
│   ├── connections.js          # Cross-C relationship lines (SVG path drawing)
│   ├── guided-tour.js          # Tour sequence, pause/resume, narrative overlay
│   ├── digital-highlight.js    # Circuit-board border animation on tech hexes
│   ├── sector-lens.js          # Sector dropdown + hex highlighting
│   ├── particles.js            # Canvas particle background with mouse parallax
│   ├── stats-bar.js            # Count-up animation on scroll into view
│   ├── case-studies.js         # Horizontal scroll, card click → modal
│   └── contacts.js             # Contact card grid rendering
├── utils/
│   ├── state.js                # Simple pub/sub state store
│   └── perf.js                 # Performance detection (backdrop-filter, reduced-motion)
public/
├── images/
│   └── wt-logo.svg             # WT logo
vite.config.js
package.json
```

---

## Chunk 1: Project Scaffold + Data Layer + Static Layout

### Task 1: Vite Project Setup

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `src/index.html`
- Create: `src/main.js`
- Create: `src/styles/variables.css`
- Create: `src/styles/base.css`

- [ ] **Step 1: Initialise Vite project**

```bash
cd C:\Users\User\Documents\Projects\PPA
npm create vite@latest . -- --template vanilla
```

Select "Ignore files and continue" if prompted about existing files.

- [ ] **Step 2: Install dependencies**

```bash
npm install gsap
npm install -D vite
```

- [ ] **Step 3: Create `vite.config.js`**

```js
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
```

- [ ] **Step 4: Create `src/styles/variables.css`**

```css
:root {
  /* WT Primary */
  --wt-blue: #0063A6;
  --wt-yellow: #FFC200;
  --light-grey: #D8DADB;
  --mid-grey: #83817E;

  /* WT Secondary */
  --deep-grey: #4E4A46;
  --process-blue: #0087CF;
  --light-blue: #E4EBF6;
  --green: #76B330;
  --orange: #F98303;
  --blue-grey: #7CA5D0;

  /* Theme */
  --bg-primary: #0A0F1A;
  --bg-secondary: #0E1425;
  --bg-tertiary: #131A2E;
  --text-primary: #F0F0F0;
  --text-secondary: #B0B0B0;

  /* Filter tags */
  --tag-people: #76B330;
  --tag-process: #7CA5D0;
  --tag-technology: #F98303;

  /* Spacing */
  --section-padding: 80px;
  --content-max-width: 1400px;

  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-normal: 300ms ease-out;
  --transition-slow: 600ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

- [ ] **Step 5: Create `src/styles/base.css`**

```css
@import './variables.css';

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
}

a {
  color: var(--process-blue);
  text-decoration: none;
}

a:hover {
  color: var(--wt-blue);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 6: Create `src/index.html` with loading state**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WT — Portfolio & Program Advisory</title>
  <style>
    body { background: #0A0F1A; margin: 0; }
    .loader { display: flex; align-items: center; justify-content: center;
      height: 100vh; gap: 8px; }
    .loader-dot { width: 8px; height: 8px; border-radius: 50%;
      background: #FFC200; animation: pulse 1.4s ease-in-out infinite; }
    .loader-dot:nth-child(2) { animation-delay: 0.2s; }
    .loader-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes pulse { 0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
      40% { opacity: 1; transform: scale(1); } }
  </style>
</head>
<body>
  <div id="loader" class="loader">
    <div class="loader-dot"></div>
    <div class="loader-dot"></div>
    <div class="loader-dot"></div>
  </div>
  <div id="app" style="display:none;"></div>
  <script type="module" src="/main.js"></script>
</body>
</html>
```

- [ ] **Step 7: Create `src/main.js` placeholder**

```js
import './styles/base.css';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('app').innerHTML = '<h1 style="padding:40px;">WT PPA Services Showcase — Loading...</h1>';
});
```

- [ ] **Step 8: Verify dev server runs**

```bash
npx vite --host
```

Expected: Opens on localhost, shows dark background with "WT PPA Services Showcase" text after loader disappears.

- [ ] **Step 9: Commit**

```bash
git add package.json vite.config.js src/index.html src/main.js src/styles/variables.css src/styles/base.css
git commit -m "feat: scaffold Vite project with loading state and design tokens"
```

---

### Task 2: Service Data Module

**Files:**
- Create: `src/data/services.js`

- [ ] **Step 1: Create complete service data**

```js
// src/data/services.js
// Complete service hierarchy: 3 C's → 7 categories → 20 services

export const pillars = [
  {
    id: 'clarity',
    name: 'Clarity',
    tagline: 'Controls and insights for capital performance',
    color: 'var(--wt-yellow)',
  },
  {
    id: 'capability',
    name: 'Capability',
    tagline: 'Right approach, roles and culture',
    color: 'var(--wt-yellow)',
  },
  {
    id: 'consistency',
    name: 'Consistency',
    tagline: 'Processes and dependable decision-making',
    color: 'var(--wt-yellow)',
  },
];

export const categories = [
  { id: 'project-controls', name: 'Project Controls', pillarId: 'clarity' },
  { id: 'tools-insights', name: 'Tools and Insights', pillarId: 'clarity' },
  { id: 'assurance', name: 'Assurance', pillarId: 'clarity' },
  { id: 'portfolio-program-mgmt', name: 'Portfolio & Program Management', pillarId: 'capability' },
  { id: 'pmo-advisory', name: 'PMO Advisory', pillarId: 'capability' },
  { id: 'change-transformation', name: 'Change & Transformation', pillarId: 'consistency' },
  { id: 'governance-process', name: 'Governance & Process', pillarId: 'consistency' },
];

export const services = [
  // --- Clarity > Project Controls ---
  {
    id: 'risk-management',
    name: 'Risk Management',
    categoryId: 'project-controls',
    tags: ['process'],
    bullets: [
      'Risk management frameworks',
      'Quantitative Schedule Risk Analysis (QSRA)',
      'Quantitative Cost Risk Analysis (QCRA)',
      'Risk register development and management',
      'Risk workshops and facilitation',
    ],
    relatedIds: ['governance-frameworks', 'planning', 'health-checks'],
    contactId: 'latham-conley',
    digital: false,
    valueStatement: 'Structured risk management that protects your investment and schedule.',
  },
  {
    id: 'planning',
    name: 'Planning',
    categoryId: 'project-controls',
    tags: ['process'],
    bullets: [
      'Program and project scheduling',
      'Baseline management',
      'Progress tracking and reporting',
      'Critical path analysis',
      'Schedule recovery planning',
    ],
    relatedIds: ['risk-management', 'cost-change-control', 'program-management'],
    contactId: 'david-mackinder',
    digital: false,
    valueStatement: 'Robust scheduling that keeps programs on track from baseline to completion.',
  },
  {
    id: 'cost-change-control',
    name: 'Cost & Change Control',
    categoryId: 'project-controls',
    tags: ['process'],
    bullets: [
      'Cost planning and forecasting',
      'Earned value management',
      'Change request management',
      'Variation tracking and assessment',
      'Budget monitoring and reporting',
    ],
    relatedIds: ['planning', 'governance-frameworks', 'reporting'],
    contactId: 'adam-robinson',
    digital: false,
    valueStatement: 'Tight cost controls and change management to protect your budget.',
  },
  // --- Clarity > Tools and Insights ---
  {
    id: 'reporting',
    name: 'Reporting',
    categoryId: 'tools-insights',
    tags: ['technology'],
    bullets: [
      'Portfolio and program dashboards',
      'Executive reporting',
      'RAG status frameworks',
      'Automated status reporting',
      'Stakeholder-specific report design',
    ],
    relatedIds: ['data-analytics', 'portfolio-management', 'cost-change-control'],
    contactId: 'danny-liston',
    digital: true,
    valueStatement: 'Dashboards and reports that give decision-makers the right information at the right time.',
  },
  {
    id: 'data-analytics',
    name: 'Data & Analytics',
    categoryId: 'tools-insights',
    tags: ['technology'],
    bullets: [
      'Data integration and consolidation',
      'Performance benchmarking',
      'Predictive analytics',
      'Portfolio data quality improvement',
    ],
    relatedIds: ['reporting', 'ai-future-methods'],
    contactId: 'danny-liston',
    digital: true,
    valueStatement: 'Turning portfolio data into actionable intelligence.',
  },
  {
    id: 'ai-future-methods',
    name: 'AI & Future Working Methods',
    categoryId: 'tools-insights',
    tags: ['technology'],
    bullets: [
      'AI-assisted status reporting',
      'Automated risk flagging',
      'Intelligent data extraction',
      'Tool evaluation and implementation',
    ],
    relatedIds: ['data-analytics', 'digital-transformation', 'reporting'],
    contactId: 'danny-liston',
    digital: true,
    valueStatement: 'Harnessing AI to reduce admin burden and surface insights faster.',
  },
  // --- Clarity > Assurance ---
  {
    id: 'health-checks',
    name: 'Health Checks',
    categoryId: 'assurance',
    tags: ['people', 'process'],
    bullets: [
      'Independent project/program health reviews',
      'Diagnostic assessments',
      'Remediation planning',
    ],
    relatedIds: ['gateway-reviews', 'independent-assurance', 'risk-management'],
    contactId: 'adam-robinson',
    digital: false,
    valueStatement: 'Independent assessments that identify issues before they become problems.',
  },
  {
    id: 'gateway-reviews',
    name: 'Gateway Reviews',
    categoryId: 'assurance',
    tags: ['process'],
    bullets: [
      'Stage gate design and implementation',
      'Independent gateway assessments',
      'Decision-support recommendations',
    ],
    relatedIds: ['health-checks', 'governance-frameworks', 'pm-frameworks'],
    contactId: 'adam-robinson',
    digital: false,
    valueStatement: 'Rigorous stage gates that ensure projects are ready to progress.',
  },
  {
    id: 'independent-assurance',
    name: 'Independent Assurance',
    categoryId: 'assurance',
    tags: ['process'],
    bullets: [
      'Portfolio assurance frameworks',
      'Compliance reviews',
      'Investment decision assurance',
    ],
    relatedIds: ['health-checks', 'gateway-reviews', 'governance-frameworks'],
    contactId: 'adam-robinson',
    digital: false,
    valueStatement: 'Confidence that investments are sound and delivery is on track.',
  },
  // --- Capability > Portfolio & Program Management ---
  {
    id: 'portfolio-management',
    name: 'Portfolio Management',
    categoryId: 'portfolio-program-mgmt',
    tags: ['people', 'process'],
    bullets: [
      'Portfolio prioritisation and optimisation',
      'Capital planning',
      'Benefits realisation',
      'Portfolio performance monitoring',
    ],
    relatedIds: ['program-management', 'reporting', 'maturity-assessments'],
    contactId: 'peter-cosman',
    digital: false,
    valueStatement: 'Strategic portfolio oversight that maximises capital performance.',
  },
  {
    id: 'program-management',
    name: 'Program Management',
    categoryId: 'portfolio-program-mgmt',
    tags: ['people', 'process'],
    bullets: [
      'Program setup and mobilisation',
      'Program delivery oversight',
      'Interdependency management',
      'Stakeholder management',
    ],
    relatedIds: ['portfolio-management', 'planning', 'change-management'],
    contactId: 'peter-cosman',
    digital: false,
    valueStatement: 'Hands-on program leadership from mobilisation through to delivery.',
  },
  // --- Capability > PMO Advisory ---
  {
    id: 'maturity-assessments',
    name: 'Maturity Assessments',
    categoryId: 'pmo-advisory',
    tags: ['people', 'process'],
    bullets: [
      'Current-state capability assessment',
      'Maturity benchmarking',
      'Uplift roadmaps',
      'Gap analysis',
    ],
    relatedIds: ['target-operating-model', 'process-improvement', 'portfolio-management'],
    contactId: 'adam-robinson',
    digital: false,
    valueStatement: 'Understanding where you are today to define the path to where you need to be.',
  },
  {
    id: 'target-operating-model',
    name: 'Target Operating Model',
    categoryId: 'pmo-advisory',
    tags: ['people', 'process'],
    bullets: [
      'Organisational design for project delivery',
      'Role and accountability mapping',
      'Operating model implementation',
    ],
    relatedIds: ['maturity-assessments', 'governance-frameworks', 'pm-frameworks'],
    contactId: 'adam-robinson',
    digital: false,
    valueStatement: 'Designing the right organisational structure for successful project delivery.',
  },
  {
    id: 'training-development',
    name: 'Training & Development',
    categoryId: 'pmo-advisory',
    tags: ['people'],
    bullets: [
      'Capability uplift programs',
      'PM competency frameworks',
      'Coaching and mentoring',
      'Knowledge transfer',
    ],
    relatedIds: ['change-management', 'maturity-assessments'],
    contactId: 'adam-robinson',
    digital: false,
    valueStatement: 'Building lasting capability in your people and teams.',
  },
  // --- Consistency > Change & Transformation ---
  {
    id: 'change-management',
    name: 'Change Management',
    categoryId: 'change-transformation',
    tags: ['people'],
    bullets: [
      'Stakeholder impact analysis',
      'Change readiness assessments',
      'Communications planning',
      'Adoption and embedding strategies',
    ],
    relatedIds: ['training-development', 'program-management', 'digital-transformation'],
    contactId: 'rachael-mccool',
    digital: false,
    valueStatement: 'Guiding people through change so new ways of working stick.',
  },
  {
    id: 'digital-transformation',
    name: 'Digital Transformation',
    categoryId: 'change-transformation',
    tags: ['people', 'technology'],
    bullets: [
      'Digital maturity assessment',
      'Tool selection and implementation',
      'System integration planning',
      'User adoption programs',
    ],
    relatedIds: ['ai-future-methods', 'change-management', 'templates-methodologies'],
    contactId: 'danny-liston',
    digital: true,
    valueStatement: 'Selecting and implementing the right digital tools for lasting impact.',
  },
  // --- Consistency > Governance & Process ---
  {
    id: 'governance-frameworks',
    name: 'Governance Frameworks',
    categoryId: 'governance-process',
    tags: ['process'],
    bullets: [
      'Decision-making structures',
      'Approval and escalation pathways',
      'Committee design',
      'Governance documentation',
    ],
    relatedIds: ['pm-frameworks', 'risk-management', 'target-operating-model'],
    contactId: 'adam-robinson',
    digital: false,
    valueStatement: 'Clear governance that enables fast, confident decisions.',
  },
  {
    id: 'pm-frameworks',
    name: 'PM Frameworks',
    categoryId: 'governance-process',
    tags: ['process'],
    bullets: [
      'Project lifecycle definition',
      'Stage gate criteria',
      'Methodology selection and tailoring',
      'RACI development',
    ],
    relatedIds: ['governance-frameworks', 'gateway-reviews', 'templates-methodologies'],
    contactId: 'adam-robinson',
    digital: false,
    valueStatement: 'Consistent project management methodology tailored to your organisation.',
  },
  {
    id: 'process-improvement',
    name: 'Process Improvement',
    categoryId: 'governance-process',
    tags: ['process'],
    bullets: [
      'Current-state process mapping',
      'Efficiency analysis',
      'Process redesign',
      'Continuous improvement programs',
    ],
    relatedIds: ['maturity-assessments', 'templates-methodologies', 'governance-frameworks'],
    contactId: 'adam-robinson',
    digital: false,
    valueStatement: 'Streamlining processes to eliminate waste and improve outcomes.',
  },
  {
    id: 'templates-methodologies',
    name: 'Templates & Methodologies',
    categoryId: 'governance-process',
    tags: ['process', 'technology'],
    bullets: [
      'Standardised project templates',
      'Methodology playbooks',
      'Reporting templates',
      'Toolkit development',
    ],
    relatedIds: ['pm-frameworks', 'process-improvement', 'digital-transformation'],
    contactId: 'danny-liston',
    digital: true,
    valueStatement: 'Ready-to-use tools and templates that drive consistency across projects.',
  },
];

export const contacts = [
  { id: 'adam-robinson', name: 'Adam Robinson', role: 'Head of Portfolio & Program Advisory', email: 'arobinson@wtpartnership.com.au' },
  { id: 'danny-liston', name: 'Danny Liston', role: 'NSW State Lead & Digital Services Lead', email: 'dliston@wtpartnership.com.au' },
  { id: 'peter-cosman', name: 'Peter Cosman', role: 'VIC & SA State Lead', email: 'pcosman@wtpartnership.com.au' },
  { id: 'jared-cathcart', name: 'Jared Cathcart', role: 'QLD & WA State Lead', email: 'jcathcart@wtpartnership.com.au' },
  { id: 'david-mackinder', name: 'David Mackinder', role: 'Planning Services Lead', email: 'dmackinder@wtpartnership.com.au' },
  { id: 'rachael-mccool', name: 'Rachael Mccool', role: 'Change Management Lead', email: 'rmccool@wtpartnership.com.au' },
  { id: 'latham-conley', name: 'Latham Conley', role: 'Risk Management Lead', email: 'lconley@wtpartnership.com.au' },
];

// Helper: get pillar for a service
export function getPillarForService(serviceId) {
  const service = services.find(s => s.id === serviceId);
  if (!service) return null;
  const category = categories.find(c => c.id === service.categoryId);
  if (!category) return null;
  return pillars.find(p => p.id === category.pillarId);
}

// Helper: get contact for a service
export function getContactForService(serviceId) {
  const service = services.find(s => s.id === serviceId);
  if (!service) return contacts.find(c => c.id === 'adam-robinson');
  return contacts.find(c => c.id === service.contactId) || contacts.find(c => c.id === 'adam-robinson');
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/services.js
git commit -m "feat: add complete service data module with hierarchy, tags, contacts, relations"
```

---

### Task 3: Case Studies + Sectors Data

**Files:**
- Create: `src/data/case-studies.js`
- Create: `src/data/sectors.js`

- [ ] **Step 1: Create case studies data**

```js
// src/data/case-studies.js
export const caseStudies = [
  { id: 'citadel', name: 'Citadel', location: 'Global', sector: 'Commercial & Workplace', serviceIds: ['portfolio-management', 'reporting', 'data-analytics'] },
  { id: 'sydney-metro', name: 'Sydney Metro', location: 'NSW', sector: 'Transport', serviceIds: ['program-management', 'risk-management', 'planning'] },
  { id: 'cairns-airport', name: 'Cairns Airport', location: 'QLD', sector: 'Aviation', serviceIds: ['portfolio-management', 'cost-change-control'] },
  { id: 'crown-resorts', name: 'Crown Resorts Limited', location: 'VIC', sector: 'Hotels & Entertainment', serviceIds: ['program-management', 'governance-frameworks'] },
  { id: 'blacktown-council', name: 'Blacktown City Council', location: 'NSW', sector: 'Public & Civic', serviceIds: ['portfolio-management', 'maturity-assessments', 'reporting'] },
  { id: 'baf-flour-mill', name: 'British Associated Foods, Flour Mill', location: 'VIC', sector: 'Industrial & Logistics', serviceIds: ['cost-change-control', 'planning'] },
  { id: 'suburban-rail-loop', name: 'Suburban Rail Loop', location: 'VIC', sector: 'Transport', serviceIds: ['program-management', 'risk-management', 'planning', 'governance-frameworks'] },
  { id: 'uniting-church', name: 'Uniting Church', location: 'VIC', sector: 'Public & Civic', serviceIds: ['portfolio-management', 'reporting'] },
  { id: 'marvel-stadium', name: 'Marvel Stadium', location: 'VIC', sector: 'Sports & Venues', serviceIds: ['program-management', 'cost-change-control'] },
  { id: 'barwon-water', name: 'Barwon Water Regional Renewable Organics Network', location: 'VIC', sector: 'Water', serviceIds: ['program-management', 'risk-management'] },
  { id: 'bridgewater-bridge', name: 'Bridgewater Bridge', location: 'TAS', sector: 'Transport', serviceIds: ['cost-change-control', 'planning', 'risk-management'] },
  { id: 'tasports', name: 'Tasports', location: 'TAS', sector: 'Transport', serviceIds: ['portfolio-management', 'reporting'] },
];
```

- [ ] **Step 2: Create sectors data**

```js
// src/data/sectors.js
export const sectors = [
  'Aviation', 'Commercial & Workplace', 'Data Centres', 'Defence',
  'Education', 'Energy', 'Healthcare', 'Hotels & Entertainment',
  'Industrial & Logistics', 'Life Sciences', 'Mixed Use', 'Public & Civic',
  'Residential', 'Retail', 'Sports & Venues', 'Transport', 'Water',
];

// Placeholder: which services are commonly engaged per sector
// To be populated with real data later
export const sectorServiceMap = {
  'Transport': ['program-management', 'risk-management', 'planning', 'cost-change-control', 'governance-frameworks', 'reporting'],
  'Healthcare': ['portfolio-management', 'program-management', 'governance-frameworks', 'reporting', 'change-management'],
  'Defence': ['portfolio-management', 'program-management', 'risk-management', 'governance-frameworks', 'independent-assurance'],
  'Education': ['portfolio-management', 'maturity-assessments', 'reporting', 'process-improvement'],
  'Commercial & Workplace': ['portfolio-management', 'cost-change-control', 'reporting', 'data-analytics'],
  'Energy': ['program-management', 'risk-management', 'planning', 'cost-change-control'],
  'Water': ['program-management', 'risk-management', 'planning'],
  'Public & Civic': ['portfolio-management', 'maturity-assessments', 'reporting', 'governance-frameworks'],
  'Aviation': ['portfolio-management', 'cost-change-control', 'planning'],
  'Hotels & Entertainment': ['program-management', 'cost-change-control', 'governance-frameworks'],
  'Sports & Venues': ['program-management', 'cost-change-control'],
  'Industrial & Logistics': ['cost-change-control', 'planning'],
  'Data Centres': ['program-management', 'planning', 'cost-change-control'],
  'Residential': ['portfolio-management', 'cost-change-control', 'reporting'],
  'Retail': ['portfolio-management', 'cost-change-control'],
  'Life Sciences': ['program-management', 'risk-management', 'governance-frameworks'],
  'Mixed Use': ['portfolio-management', 'program-management', 'cost-change-control', 'reporting'],
};
```

- [ ] **Step 3: Commit**

```bash
git add src/data/case-studies.js src/data/sectors.js
git commit -m "feat: add case studies and sector placeholder data"
```

---

### Task 4: State Management Utility

**Files:**
- Create: `src/utils/state.js`
- Create: `src/utils/perf.js`

- [ ] **Step 1: Create simple pub/sub state store**

```js
// src/utils/state.js
// Minimal reactive state — no framework needed

const state = {
  activeFilters: [],        // ['people', 'process', 'technology']
  focusedPillar: null,      // pillar id or null
  focusedCategory: null,    // category id or null
  selectedService: null,    // service id or null
  detailPanelOpen: false,
  toggles: {
    connections: false,
    sectorLens: null,       // sector name or null
    guidedTour: false,
    digitalHighlight: false,
  },
  tourState: {
    active: false,
    paused: false,
    currentStep: 0,
  },
};

const listeners = new Map();

export function getState() {
  return state;
}

export function setState(updates) {
  Object.assign(state, updates);
  listeners.forEach((callback) => callback(state));
}

export function setToggle(key, value) {
  state.toggles = { ...state.toggles, [key]: value };
  listeners.forEach((callback) => callback(state));
}

export function subscribe(id, callback) {
  listeners.set(id, callback);
  return () => listeners.delete(id);
}
```

- [ ] **Step 2: Create performance detection**

```js
// src/utils/perf.js

export const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasHover =
  window.matchMedia('(hover: hover)').matches;

let lowPerf = false;

export function detectLowPerformance() {
  let frames = 0;
  let lastTime = performance.now();
  let slowFrames = 0;

  function check(now) {
    frames++;
    if (frames > 60) {
      const elapsed = now - lastTime;
      const fps = (frames / elapsed) * 1000;
      if (fps < 40) slowFrames++;
      if (slowFrames >= 2) {
        lowPerf = true;
        return;
      }
      frames = 0;
      lastTime = now;
    }
    if (!lowPerf && frames < 300) {
      requestAnimationFrame(check);
    }
  }
  requestAnimationFrame(check);
}

export function isLowPerformance() {
  return lowPerf;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/utils/state.js src/utils/perf.js
git commit -m "feat: add state management and performance detection utilities"
```

---

### Task 5: Page Shell — Header, Stats Bar, Contacts, Footer

**Files:**
- Create: `src/styles/header.css`
- Create: `src/styles/stats-bar.css`
- Create: `src/styles/contacts.css`
- Create: `src/styles/footer.css`
- Create: `src/components/stats-bar.js`
- Create: `src/components/contacts.js`
- Modify: `src/main.js`
- Modify: `src/index.html`

- [ ] **Step 1: Create header CSS**

```css
/* src/styles/header.css */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
  position: relative;
  z-index: 10;
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header__logo-mark {
  width: 48px;
  height: 48px;
  background: var(--wt-yellow);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
  color: var(--bg-primary);
}

.header__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.header__tagline {
  font-size: 0.875rem;
  color: var(--wt-yellow);
  font-style: italic;
}
```

- [ ] **Step 2: Create stats bar**

```css
/* src/styles/stats-bar.css */
.stats-bar {
  display: flex;
  justify-content: center;
  gap: 60px;
  padding: 60px 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.stat {
  text-align: center;
}

.stat__number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--wt-yellow);
  line-height: 1.2;
}

.stat__label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 4px;
}

@media (max-width: 768px) {
  .stats-bar {
    flex-wrap: wrap;
    gap: 30px;
  }
  .stat__number { font-size: 1.8rem; }
}
```

```js
// src/components/stats-bar.js
import { prefersReducedMotion } from '../utils/perf.js';

const stats = [
  { value: 75, suffix: '+', label: 'Years of experience' },
  { value: 2000, suffix: '+', label: 'Staff globally' },
  { value: 500, suffix: '+', label: 'Specialists in Australia' },
  { value: 70, suffix: '+', label: 'Offices worldwide' },
  { value: 12, suffix: '', label: 'Offices nationwide' },
];

export function renderStatsBar(container) {
  container.innerHTML = `
    <section class="stats-bar" id="stats-bar">
      ${stats.map(s => `
        <div class="stat">
          <div class="stat__number" data-target="${s.value}" data-suffix="${s.suffix}">0${s.suffix}</div>
          <div class="stat__label">${s.label}</div>
        </div>
      `).join('')}
    </section>
  `;

  if (prefersReducedMotion) {
    container.querySelectorAll('.stat__number').forEach(el => {
      el.textContent = el.dataset.target + el.dataset.suffix;
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCountUp(container);
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(container.querySelector('.stats-bar'));
}

function animateCountUp(container) {
  container.querySelectorAll('.stat__number').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix;
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
```

- [ ] **Step 3: Create contacts section**

```css
/* src/styles/contacts.css */
.contacts {
  padding: var(--section-padding) 40px;
}

.contacts__title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 40px;
  text-align: center;
}

.contacts__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  max-width: var(--content-max-width);
  margin: 0 auto;
}

.contact-card {
  background: var(--bg-secondary);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 24px;
  transition: border-color var(--transition-normal);
}

.contact-card:hover {
  border-color: var(--wt-blue);
}

.contact-card__name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--wt-yellow);
  margin-bottom: 4px;
}

.contact-card__role {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.contact-card__email {
  font-size: 0.85rem;
  color: var(--process-blue);
}
```

```js
// src/components/contacts.js
import { contacts } from '../data/services.js';

export function renderContacts(container) {
  container.innerHTML = `
    <section class="contacts">
      <h2 class="contacts__title">Our Team</h2>
      <div class="contacts__grid">
        ${contacts.map(c => `
          <div class="contact-card">
            <div class="contact-card__name">${c.name}</div>
            <div class="contact-card__role">${c.role}</div>
            <a class="contact-card__email" href="mailto:${c.email}">${c.email}</a>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}
```

- [ ] **Step 4: Create footer**

```css
/* src/styles/footer.css */
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.footer__tagline {
  color: var(--wt-yellow);
  font-style: italic;
}
```

- [ ] **Step 5: Update `main.js` to render full page shell**

```js
// src/main.js
import './styles/base.css';
import './styles/header.css';
import './styles/stats-bar.css';
import './styles/contacts.css';
import './styles/footer.css';
import { renderStatsBar } from './components/stats-bar.js';
import { renderContacts } from './components/contacts.js';
import { detectLowPerformance } from './utils/perf.js';

document.addEventListener('DOMContentLoaded', () => {
  detectLowPerformance();

  const app = document.getElementById('app');
  app.innerHTML = `
    <header class="header">
      <div class="header__logo">
        <div class="header__logo-mark">WT</div>
        <div>
          <div class="header__title">Portfolio & Program Advisory</div>
          <div class="header__tagline">Empowering growth.</div>
        </div>
      </div>
    </header>

    <main>
      <section id="hex-grid-section" style="min-height:700px; display:flex; align-items:center; justify-content:center;">
        <p style="color: var(--text-secondary);">Hex grid will render here</p>
      </section>

      <div id="stats-bar-container"></div>

      <section id="case-studies-section" style="padding: 80px 40px;">
        <p style="color: var(--text-secondary);">Case studies will render here</p>
      </section>

      <div id="contacts-container"></div>
    </main>

    <footer class="footer">
      <div class="header__logo-mark" style="width:36px;height:36px;font-size:14px;">WT</div>
      <span class="footer__tagline">Empowering growth.</span>
      <span>&copy; ${new Date().getFullYear()} WT Partnership</span>
    </footer>
  `;

  renderStatsBar(document.getElementById('stats-bar-container'));
  renderContacts(document.getElementById('contacts-container'));

  // Hide loader, show app
  document.getElementById('loader').style.display = 'none';
  app.style.display = 'block';
});
```

- [ ] **Step 6: Verify page renders**

```bash
npx vite --host
```

Expected: Dark page with header, placeholder hex grid area, stats bar with count-up animation, contact cards, footer.

- [ ] **Step 7: Commit**

```bash
git add src/styles/header.css src/styles/stats-bar.css src/styles/contacts.css src/styles/footer.css src/components/stats-bar.js src/components/contacts.js src/main.js
git commit -m "feat: add page shell with header, stats bar, contacts, footer"
```

---

## Chunk 2: Hex Grid — Layout, Rendering, Entrance Animation

### Task 6: Hex Position Layout Calculator

**Files:**
- Create: `src/components/hex-grid/layout.js`

- [ ] **Step 1: Create force-directed hex position calculator**

This calculates x/y positions for all 30 hexes within a given viewport. The 3 C's form a central triangle, categories radiate outward from their parent C, services radiate from their parent category.

```js
// src/components/hex-grid/layout.js

const HEX_SIZE_PILLAR = 70;    // radius for C hexes
const HEX_SIZE_CATEGORY = 55;  // radius for category hexes
const HEX_SIZE_SERVICE = 40;   // radius for service hexes

export const HEX_SIZES = {
  pillar: HEX_SIZE_PILLAR,
  category: HEX_SIZE_CATEGORY,
  service: HEX_SIZE_SERVICE,
};

/**
 * Calculate positions for all hexes.
 * @param {number} width - viewport width
 * @param {number} height - viewport height
 * @param {object} data - { pillars, categories, services }
 * @returns {Map<string, {x, y, size, type}>}
 */
export function calculateLayout(width, height, { pillars, categories, services }) {
  const positions = new Map();
  const cx = width / 2;
  const cy = height / 2;

  // 3 C's in a tight triangle
  const pillarRadius = 90;
  const pillarAngles = [-Math.PI / 2, Math.PI / 6 + Math.PI, Math.PI / 6]; // top, bottom-left, bottom-right
  const pillarOrder = ['clarity', 'capability', 'consistency'];

  pillarOrder.forEach((id, i) => {
    positions.set(id, {
      x: cx + Math.cos(pillarAngles[i]) * pillarRadius,
      y: cy + Math.sin(pillarAngles[i]) * pillarRadius,
      size: HEX_SIZE_PILLAR,
      type: 'pillar',
    });
  });

  // Categories radiate from their parent pillar
  const categorySpread = 180;
  const pillarCategoryAngles = {
    clarity: -Math.PI / 2,       // up
    capability: (5 * Math.PI) / 6, // bottom-left
    consistency: Math.PI / 6,    // bottom-right
  };

  const categoriesByPillar = {};
  categories.forEach(cat => {
    if (!categoriesByPillar[cat.pillarId]) categoriesByPillar[cat.pillarId] = [];
    categoriesByPillar[cat.pillarId].push(cat);
  });

  Object.entries(categoriesByPillar).forEach(([pillarId, cats]) => {
    const pillarPos = positions.get(pillarId);
    const baseAngle = pillarCategoryAngles[pillarId];
    const angleSpan = Math.PI * 0.7;
    const startAngle = baseAngle - angleSpan / 2;

    cats.forEach((cat, i) => {
      const angle = cats.length === 1
        ? baseAngle
        : startAngle + (i / (cats.length - 1)) * angleSpan;
      positions.set(cat.id, {
        x: pillarPos.x + Math.cos(angle) * categorySpread,
        y: pillarPos.y + Math.sin(angle) * categorySpread,
        size: HEX_SIZE_CATEGORY,
        type: 'category',
      });
    });
  });

  // Services radiate from their parent category
  const serviceSpread = 110;

  const servicesByCategory = {};
  services.forEach(svc => {
    if (!servicesByCategory[svc.categoryId]) servicesByCategory[svc.categoryId] = [];
    servicesByCategory[svc.categoryId].push(svc);
  });

  Object.entries(servicesByCategory).forEach(([catId, svcs]) => {
    const catPos = positions.get(catId);
    if (!catPos) return;
    // Find parent pillar to determine outward direction
    const cat = categories.find(c => c.id === catId);
    const pillarPos = positions.get(cat.pillarId);
    const outwardAngle = Math.atan2(catPos.y - pillarPos.y, catPos.x - pillarPos.x);

    const angleSpan = Math.PI * 0.6;
    const startAngle = outwardAngle - angleSpan / 2;

    svcs.forEach((svc, i) => {
      const angle = svcs.length === 1
        ? outwardAngle
        : startAngle + (i / (svcs.length - 1)) * angleSpan;
      positions.set(svc.id, {
        x: catPos.x + Math.cos(angle) * serviceSpread,
        y: catPos.y + Math.sin(angle) * serviceSpread,
        size: HEX_SIZE_SERVICE,
        type: 'service',
      });
    });
  });

  return positions;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/hex-grid/layout.js
git commit -m "feat: add hex grid force-directed layout calculator"
```

---

### Task 7: Hex Grid DOM Renderer + SVG Connection Lines

**Files:**
- Create: `src/components/hex-grid/renderer.js`
- Create: `src/styles/hex-grid.css`

- [ ] **Step 1: Create hex-grid CSS**

```css
/* src/styles/hex-grid.css */
.hex-grid-section {
  position: relative;
  width: 100%;
  height: 700px;
  overflow: hidden;
}

.hex-grid {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform var(--transition-slow);
}

.hex-grid--shifted {
  transform: translateX(-25%) scale(0.75);
}

.hex-grid__connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.hex-grid__connections line {
  stroke: var(--wt-blue);
  stroke-width: 1;
  opacity: 0.2;
  transition: opacity var(--transition-normal);
}

.hex {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: transform var(--transition-fast), opacity var(--transition-normal), filter var(--transition-normal);
  z-index: 2;
  /* Hex shape via clip-path */
  clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
}

.hex--pillar {
  background: linear-gradient(135deg, rgba(255, 194, 0, 0.15), rgba(255, 194, 0, 0.05));
  border: 2px solid var(--wt-yellow);
}

.hex--category {
  background: linear-gradient(135deg, rgba(0, 99, 166, 0.2), rgba(0, 99, 166, 0.05));
}

.hex--service {
  background: linear-gradient(135deg, rgba(0, 135, 207, 0.15), rgba(0, 135, 207, 0.05));
}

.hex__label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-primary);
  padding: 8px;
  line-height: 1.2;
  pointer-events: none;
}

.hex--pillar .hex__label {
  font-size: 0.85rem;
}

.hex__tagline {
  font-size: 0.55rem;
  color: var(--text-secondary);
  margin-top: 2px;
  pointer-events: none;
}

.hex--dimmed {
  opacity: 0.15;
  transform: scale(0.92);
  filter: grayscale(0.5);
}

/* Hex outline (drawn with a pseudo-element since clip-path clips border) */
.hex::before {
  content: '';
  position: absolute;
  inset: 0;
  clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
  border: 1.5px solid var(--wt-blue);
  opacity: 0.4;
  transition: opacity var(--transition-fast), border-color var(--transition-fast);
  pointer-events: none;
}

.hex--pillar::before {
  border-color: var(--wt-yellow);
  opacity: 0.7;
}

@media (hover: hover) {
  .hex:hover {
    transform: scale(1.08);
    filter: brightness(1.3);
  }
  .hex:hover::before {
    opacity: 1;
  }
}

/* Digital highlight */
.hex--digital-highlight::after {
  content: '';
  position: absolute;
  inset: -2px;
  clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
  border: 2px solid var(--orange);
  opacity: 0;
  animation: circuit-trace 3s linear infinite;
}

@keyframes circuit-trace {
  0% { opacity: 0; }
  30% { opacity: 0.6; }
  70% { opacity: 0.6; }
  100% { opacity: 0; }
}
```

- [ ] **Step 2: Create renderer**

```js
// src/components/hex-grid/renderer.js
import { calculateLayout, HEX_SIZES } from './layout.js';
import { pillars, categories, services } from '../../data/services.js';

/**
 * Renders the hex grid into the given container.
 * Returns a Map of hex elements keyed by id.
 */
export function renderHexGrid(container) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  container.innerHTML = '';
  container.classList.add('hex-grid-section');

  // Grid wrapper (transforms as a unit)
  const grid = document.createElement('div');
  grid.className = 'hex-grid';
  grid.id = 'hex-grid';
  container.appendChild(grid);

  // SVG for connection lines
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('hex-grid__connections');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  grid.appendChild(svg);

  // Calculate positions
  const positions = calculateLayout(width, height, { pillars, categories, services });

  const hexElements = new Map();
  const lineElements = [];

  // Render pillar hexes
  pillars.forEach(p => {
    const pos = positions.get(p.id);
    const el = createHexElement(p.id, p.name, pos, 'pillar', p.tagline);
    grid.appendChild(el);
    hexElements.set(p.id, el);
  });

  // Render category hexes + lines to parent
  categories.forEach(cat => {
    const pos = positions.get(cat.id);
    const el = createHexElement(cat.id, cat.name, pos, 'category');
    grid.appendChild(el);
    hexElements.set(cat.id, el);

    const parentPos = positions.get(cat.pillarId);
    const line = createLine(svg, parentPos, pos);
    lineElements.push({ line, from: cat.pillarId, to: cat.id });
  });

  // Render service hexes + lines to parent
  services.forEach(svc => {
    const pos = positions.get(svc.id);
    const el = createHexElement(svc.id, svc.name, pos, 'service');
    grid.appendChild(el);
    hexElements.set(svc.id, el);

    const parentPos = positions.get(svc.categoryId);
    const line = createLine(svg, parentPos, pos);
    lineElements.push({ line, from: svc.categoryId, to: svc.id });
  });

  return { hexElements, lineElements, positions, grid, svg };
}

function createHexElement(id, label, pos, type, tagline) {
  const size = HEX_SIZES[type] * 2;
  const el = document.createElement('div');
  el.className = `hex hex--${type}`;
  el.dataset.id = id;
  el.dataset.type = type;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.left = `${pos.x - size / 2}px`;
  el.style.top = `${pos.y - size / 2}px`;
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', label);

  let inner = `<span class="hex__label">${label}</span>`;
  if (tagline) {
    inner += `<span class="hex__tagline">${tagline}</span>`;
  }
  el.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;">${inner}</div>`;

  return el;
}

function createLine(svg, from, to) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', from.x);
  line.setAttribute('y1', from.y);
  line.setAttribute('x2', to.x);
  line.setAttribute('y2', to.y);
  svg.appendChild(line);
  return line;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/hex-grid.css src/components/hex-grid/renderer.js
git commit -m "feat: add hex grid DOM renderer with SVG connection lines"
```

---

### Task 8: Entrance Animation

**Files:**
- Create: `src/components/hex-grid/animations.js`

- [ ] **Step 1: Create GSAP entrance animation**

```js
// src/components/hex-grid/animations.js
import gsap from 'gsap';
import { prefersReducedMotion } from '../../utils/perf.js';

/**
 * Animate hex grid entrance.
 * @param {Map} hexElements - Map of id → DOM element
 * @param {Array} lineElements - Array of { line, from, to }
 */
export function playEntranceAnimation(hexElements, lineElements) {
  if (prefersReducedMotion) {
    // Just show everything immediately
    hexElements.forEach(el => { el.style.opacity = 1; });
    lineElements.forEach(({ line }) => { line.style.opacity = 0.2; });
    return Promise.resolve();
  }

  // Start everything hidden
  hexElements.forEach(el => { el.style.opacity = 0; el.style.transform += ' scale(0.5)'; });
  lineElements.forEach(({ line }) => { line.style.opacity = 0; });

  const tl = gsap.timeline();

  // Phase 1: Pillar hexes fade in
  const pillarEls = [];
  hexElements.forEach((el, id) => {
    if (el.dataset.type === 'pillar') pillarEls.push(el);
  });
  tl.to(pillarEls, {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: 'back.out(1.7)',
    stagger: 0.1,
    clearProps: 'transform',
  });

  // Phase 2: Connection lines to categories draw in
  const catLines = lineElements.filter(l =>
    hexElements.get(l.to)?.dataset.type === 'category'
  );
  tl.to(catLines.map(l => l.line), {
    opacity: 0.2,
    duration: 0.4,
    stagger: 0.05,
  }, '-=0.2');

  // Phase 3: Category hexes fly in
  const catEls = [];
  hexElements.forEach((el) => {
    if (el.dataset.type === 'category') catEls.push(el);
  });
  tl.to(catEls, {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease: 'back.out(1.4)',
    stagger: 0.06,
    clearProps: 'transform',
  }, '-=0.2');

  // Phase 4: Service connection lines
  const svcLines = lineElements.filter(l =>
    hexElements.get(l.to)?.dataset.type === 'service'
  );
  tl.to(svcLines.map(l => l.line), {
    opacity: 0.2,
    duration: 0.3,
    stagger: 0.02,
  }, '-=0.2');

  // Phase 5: Service hexes cascade in
  const svcEls = [];
  hexElements.forEach((el) => {
    if (el.dataset.type === 'service') svcEls.push(el);
  });
  tl.to(svcEls, {
    opacity: 1,
    scale: 1,
    duration: 0.4,
    ease: 'back.out(1.2)',
    stagger: 0.03,
    clearProps: 'transform',
  }, '-=0.2');

  return tl;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/hex-grid/animations.js
git commit -m "feat: add GSAP entrance animation for hex grid assembly"
```

---

### Task 9: Wire Hex Grid Into Main + Verify

**Files:**
- Modify: `src/main.js`

- [ ] **Step 1: Update main.js to render and animate hex grid**

Replace the hex grid placeholder section in `main.js`:

```js
// src/main.js
import './styles/base.css';
import './styles/header.css';
import './styles/hex-grid.css';
import './styles/stats-bar.css';
import './styles/contacts.css';
import './styles/footer.css';
import { renderHexGrid } from './components/hex-grid/renderer.js';
import { playEntranceAnimation } from './components/hex-grid/animations.js';
import { renderStatsBar } from './components/stats-bar.js';
import { renderContacts } from './components/contacts.js';
import { detectLowPerformance } from './utils/perf.js';

document.addEventListener('DOMContentLoaded', async () => {
  detectLowPerformance();

  const app = document.getElementById('app');
  app.innerHTML = `
    <header class="header">
      <div class="header__logo">
        <div class="header__logo-mark">WT</div>
        <div>
          <div class="header__title">Portfolio & Program Advisory</div>
          <div class="header__tagline">Empowering growth.</div>
        </div>
      </div>
    </header>

    <main>
      <div id="hex-grid-container"></div>
      <div id="stats-bar-container"></div>
      <section id="case-studies-section" style="padding: 80px 40px;">
        <p style="color: var(--text-secondary); text-align:center;">Case studies coming soon</p>
      </section>
      <div id="contacts-container"></div>
    </main>

    <footer class="footer">
      <div class="header__logo-mark" style="width:36px;height:36px;font-size:14px;">WT</div>
      <span class="footer__tagline">Empowering growth.</span>
      <span>&copy; ${new Date().getFullYear()} WT Partnership</span>
    </footer>
  `;

  // Render hex grid
  const gridContainer = document.getElementById('hex-grid-container');
  const { hexElements, lineElements } = renderHexGrid(gridContainer);

  // Hide loader, show app
  document.getElementById('loader').style.display = 'none';
  app.style.display = 'block';

  // Play entrance animation
  await playEntranceAnimation(hexElements, lineElements);

  // Render remaining sections
  renderStatsBar(document.getElementById('stats-bar-container'));
  renderContacts(document.getElementById('contacts-container'));
});
```

- [ ] **Step 2: Verify the hex grid renders and animates**

```bash
npx vite --host
```

Expected: Dark page, loader disappears, hex grid assembles with staggered animation — 3 yellow C hexes in centre, blue category hexes radiating out, smaller service hexes on the outside, connected by faint lines. Stats bar counts up on scroll, contacts show below.

- [ ] **Step 3: Commit**

```bash
git add src/main.js
git commit -m "feat: wire hex grid into main page with entrance animation"
```

---

## Chunk 3: Interactions — Click, Detail Panel, Filters

### Task 10: Hex Click Interactions (Focus/Dim)

**Files:**
- Create: `src/components/hex-grid/interactions.js`

- [ ] **Step 1: Create click interaction handler**

```js
// src/components/hex-grid/interactions.js
import gsap from 'gsap';
import { getState, setState, subscribe } from '../../utils/state.js';
import { categories, services } from '../../data/services.js';

/**
 * Attach click/keyboard interactions to hex elements.
 */
export function initHexInteractions(hexElements, grid) {
  hexElements.forEach((el, id) => {
    const handler = () => handleHexClick(id, hexElements, grid);
    el.addEventListener('click', handler);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  });

  // Click background to reset
  grid.addEventListener('click', (e) => {
    if (e.target === grid || e.target.closest('svg')) {
      resetFocus(hexElements, grid);
    }
  });

  // Escape to reset
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      resetFocus(hexElements, grid);
    }
  });

  // React to state changes
  subscribe('hex-interactions', (state) => {
    applyVisualState(hexElements, grid, state);
  });
}

function handleHexClick(id, hexElements, grid) {
  const el = hexElements.get(id);
  const type = el.dataset.type;
  const state = getState();

  if (type === 'pillar') {
    if (state.focusedPillar === id) {
      setState({ focusedPillar: null, focusedCategory: null });
    } else {
      setState({ focusedPillar: id, focusedCategory: null, selectedService: null, detailPanelOpen: false });
    }
  } else if (type === 'category') {
    setState({ focusedCategory: state.focusedCategory === id ? null : id });
  } else if (type === 'service') {
    // Clear filters if clicking a dimmed hex
    const isDimmed = el.classList.contains('hex--dimmed');
    if (isDimmed) {
      setState({ activeFilters: [] });
    }
    setState({ selectedService: id, detailPanelOpen: true });
  }
}

function resetFocus(hexElements, grid) {
  setState({
    focusedPillar: null,
    focusedCategory: null,
    selectedService: null,
    detailPanelOpen: false,
  });
}

function applyVisualState(hexElements, grid, state) {
  const { focusedPillar, focusedCategory, selectedService, detailPanelOpen, activeFilters } = state;

  // Shift grid when detail panel is open
  grid.classList.toggle('hex-grid--shifted', detailPanelOpen);

  hexElements.forEach((el, id) => {
    const type = el.dataset.type;
    let dimmed = false;

    // Pillar focus: dim other branches
    if (focusedPillar) {
      const pillarId = getPillarIdForHex(id, type);
      if (pillarId && pillarId !== focusedPillar) {
        dimmed = true;
      }
    }

    // Active filters
    if (activeFilters.length > 0 && type === 'service') {
      const svc = services.find(s => s.id === id);
      if (svc && !activeFilters.some(f => svc.tags.includes(f))) {
        dimmed = true;
      }
    }

    el.classList.toggle('hex--dimmed', dimmed);
  });
}

function getPillarIdForHex(id, type) {
  if (type === 'pillar') return id;
  if (type === 'category') {
    const cat = categories.find(c => c.id === id);
    return cat?.pillarId || null;
  }
  if (type === 'service') {
    const svc = services.find(s => s.id === id);
    if (!svc) return null;
    const cat = categories.find(c => c.id === svc.categoryId);
    return cat?.pillarId || null;
  }
  return null;
}
```

- [ ] **Step 2: Wire into main.js** — add after `playEntranceAnimation`:

```js
import { initHexInteractions } from './components/hex-grid/interactions.js';
// ... after playEntranceAnimation:
initHexInteractions(hexElements, gridContainer.querySelector('.hex-grid'));
```

- [ ] **Step 3: Verify** — clicking a C hex dims other branches, clicking background resets, Escape resets.

- [ ] **Step 4: Commit**

```bash
git add src/components/hex-grid/interactions.js src/main.js
git commit -m "feat: add hex click interactions with focus/dim behaviour"
```

---

### Task 11: Detail Panel

**Files:**
- Create: `src/components/detail-panel.js`
- Create: `src/styles/detail-panel.css`

- [ ] **Step 1: Create detail panel CSS**

```css
/* src/styles/detail-panel.css */
.detail-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 55%;
  height: 100vh;
  background: rgba(14, 20, 37, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 100;
  transform: translateX(100%);
  transition: transform var(--transition-slow);
  overflow-y: auto;
  padding: 60px 48px;
}

.detail-panel--open {
  transform: translateX(0);
}

.detail-panel__close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  background: transparent;
  color: var(--text-primary);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color var(--transition-fast);
}

.detail-panel__close:hover {
  border-color: var(--wt-yellow);
}

.detail-panel__pillar-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--wt-yellow);
  background: rgba(255, 194, 0, 0.1);
  padding: 4px 12px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.detail-panel__name {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.detail-panel__tags {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.detail-panel__tag {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.detail-panel__tag--people { background: rgba(118, 179, 48, 0.15); color: var(--green); }
.detail-panel__tag--process { background: rgba(124, 165, 208, 0.15); color: var(--blue-grey); }
.detail-panel__tag--technology { background: rgba(249, 131, 3, 0.15); color: var(--orange); }

.detail-panel__value {
  font-size: 1.1rem;
  color: var(--text-secondary);
  font-style: italic;
  margin-bottom: 28px;
  line-height: 1.5;
}

.detail-panel__bullets {
  list-style: none;
  padding: 0;
  margin-bottom: 32px;
}

.detail-panel__bullets li {
  padding: 8px 0;
  padding-left: 20px;
  position: relative;
  color: var(--text-primary);
  font-size: 0.95rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.detail-panel__bullets li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--wt-blue);
  transform: translateY(-50%);
}

.detail-panel__section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.detail-panel__related {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
}

.detail-panel__related-item {
  font-size: 0.8rem;
  padding: 6px 14px;
  background: var(--bg-tertiary);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: var(--process-blue);
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.detail-panel__related-item:hover {
  border-color: var(--process-blue);
}

.detail-panel__contact {
  background: var(--bg-tertiary);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.detail-panel__contact-name {
  font-weight: 600;
  color: var(--wt-yellow);
}

.detail-panel__contact-role {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.detail-panel__contact-email {
  font-size: 0.85rem;
  color: var(--process-blue);
  margin-top: 4px;
  display: block;
}

@media (max-width: 1279px) {
  .detail-panel {
    width: 100%;
    height: 70vh;
    top: auto;
    bottom: 0;
    transform: translateY(100%);
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px 20px 0 0;
  }
  .detail-panel--open {
    transform: translateY(0);
  }
}
```

- [ ] **Step 2: Create detail panel component**

```js
// src/components/detail-panel.js
import { services, categories, pillars, getContactForService, getPillarForService } from '../data/services.js';
import { getState, setState, subscribe } from '../utils/state.js';

let panelEl = null;

export function initDetailPanel() {
  panelEl = document.createElement('div');
  panelEl.className = 'detail-panel';
  panelEl.innerHTML = '<button class="detail-panel__close" aria-label="Close">&times;</button><div class="detail-panel__content"></div>';
  document.body.appendChild(panelEl);

  panelEl.querySelector('.detail-panel__close').addEventListener('click', closePanel);

  // Click outside to close (on the backdrop area)
  document.addEventListener('click', (e) => {
    if (getState().detailPanelOpen && !panelEl.contains(e.target) && !e.target.closest('.hex')) {
      closePanel();
    }
  });

  subscribe('detail-panel', (state) => {
    if (state.detailPanelOpen && state.selectedService) {
      renderContent(state.selectedService);
      panelEl.classList.add('detail-panel--open');
    } else {
      panelEl.classList.remove('detail-panel--open');
    }
  });
}

function closePanel() {
  setState({ selectedService: null, detailPanelOpen: false });
}

function renderContent(serviceId) {
  const svc = services.find(s => s.id === serviceId);
  if (!svc) return;

  const pillar = getPillarForService(serviceId);
  const contact = getContactForService(serviceId);
  const contentEl = panelEl.querySelector('.detail-panel__content');

  contentEl.innerHTML = `
    <div class="detail-panel__pillar-badge">${pillar?.name || ''}</div>
    <h2 class="detail-panel__name">${svc.name}</h2>
    <div class="detail-panel__tags">
      ${svc.tags.map(t => `<span class="detail-panel__tag detail-panel__tag--${t}">${t}</span>`).join('')}
    </div>
    <p class="detail-panel__value">${svc.valueStatement}</p>

    <ul class="detail-panel__bullets">
      ${svc.bullets.map(b => `<li>${b}</li>`).join('')}
    </ul>

    ${svc.relatedIds.length ? `
      <div class="detail-panel__section-title">Related Services</div>
      <div class="detail-panel__related">
        ${svc.relatedIds.map(rid => {
          const related = services.find(s => s.id === rid);
          return related ? `<button class="detail-panel__related-item" data-id="${rid}">${related.name}</button>` : '';
        }).join('')}
      </div>
    ` : ''}

    <div class="detail-panel__section-title">Contact</div>
    <div class="detail-panel__contact">
      <div class="detail-panel__contact-name">${contact.name}</div>
      <div class="detail-panel__contact-role">${contact.role}</div>
      <a class="detail-panel__contact-email" href="mailto:${contact.email}">${contact.email}</a>
    </div>
  `;

  // Related service click handlers
  contentEl.querySelectorAll('.detail-panel__related-item').forEach(btn => {
    btn.addEventListener('click', () => {
      setState({ selectedService: btn.dataset.id });
    });
  });
}
```

- [ ] **Step 3: Wire into main.js** — add import and call `initDetailPanel()` after hex grid init.

- [ ] **Step 4: Verify** — click a service hex, grid shifts left, detail panel slides in with all content. Click related service, panel cross-fades. Close works.

- [ ] **Step 5: Commit**

```bash
git add src/styles/detail-panel.css src/components/detail-panel.js src/main.js
git commit -m "feat: add glassmorphism detail panel with service info and related services"
```

---

### Task 12: People / Process / Technology Filters

**Files:**
- Create: `src/components/filters.js`
- Create: `src/styles/filters.css`

- [ ] **Step 1: Create filter CSS**

```css
/* src/styles/filters.css */
.filters {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  position: relative;
  z-index: 5;
}

.filter-btn {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 8px 20px;
  border-radius: 20px;
  border: 1.5px solid;
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.filter-btn--people { border-color: var(--tag-people); color: var(--tag-people); }
.filter-btn--process { border-color: var(--tag-process); color: var(--tag-process); }
.filter-btn--technology { border-color: var(--tag-technology); color: var(--tag-technology); }

.filter-btn--people.active { background: rgba(118, 179, 48, 0.2); }
.filter-btn--process.active { background: rgba(124, 165, 208, 0.2); }
.filter-btn--technology.active { background: rgba(249, 131, 3, 0.2); }
```

- [ ] **Step 2: Create filter component**

```js
// src/components/filters.js
import { getState, setState, subscribe } from '../utils/state.js';

export function renderFilters(container) {
  const tags = ['people', 'process', 'technology'];
  const html = `
    <div class="filters">
      ${tags.map(t => `<button class="filter-btn filter-btn--${t}" data-tag="${t}">${t}</button>`).join('')}
    </div>
  `;
  container.insertAdjacentHTML('beforebegin', html);

  const filterBar = container.previousElementSibling;
  filterBar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;
      const state = getState();
      const filters = [...state.activeFilters];
      const idx = filters.indexOf(tag);
      if (idx >= 0) filters.splice(idx, 1);
      else filters.push(tag);
      setState({ activeFilters: filters });
    });
  });

  subscribe('filters', (state) => {
    filterBar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', state.activeFilters.includes(btn.dataset.tag));
    });
  });
}
```

- [ ] **Step 3: Wire into main.js** — call `renderFilters(gridContainer)` before rendering the hex grid.

- [ ] **Step 4: Verify** — filter buttons appear above hex grid. Clicking "people" dims non-people services. Multiple filters are additive.

- [ ] **Step 5: Commit**

```bash
git add src/styles/filters.css src/components/filters.js src/main.js
git commit -m "feat: add people/process/technology filter buttons"
```

---

## Chunk 4: Toggle Features — Connections, Sector Lens, Digital Highlight, Particles

### Task 13: Toggle Controls Panel + Connections View

**Files:**
- Create: `src/components/toggle-controls.js`
- Create: `src/components/connections.js`

- [ ] **Step 1: Create toggle controls panel**

```js
// src/components/toggle-controls.js
import { getState, setToggle, subscribe } from '../utils/state.js';

export function initToggleControls(container) {
  const panel = document.createElement('div');
  panel.className = 'toggle-panel';
  panel.innerHTML = `
    <button class="toggle-panel__trigger" aria-label="Settings">&#9881;</button>
    <div class="toggle-panel__body">
      <label class="toggle-item">
        <input type="checkbox" data-toggle="connections" /> Connections
      </label>
      <label class="toggle-item">
        <input type="checkbox" data-toggle="digitalHighlight" /> Digital
      </label>
      <div class="toggle-item">
        <select data-toggle="sectorLens">
          <option value="">Sector Lens</option>
        </select>
      </div>
    </div>
  `;
  container.appendChild(panel);

  // Populate sectors
  import('../data/sectors.js').then(({ sectors }) => {
    const select = panel.querySelector('select[data-toggle="sectorLens"]');
    sectors.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      select.appendChild(opt);
    });
  });

  // Toggle trigger
  panel.querySelector('.toggle-panel__trigger').addEventListener('click', () => {
    panel.classList.toggle('toggle-panel--open');
  });

  // Checkbox toggles
  panel.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', () => {
      setToggle(input.dataset.toggle, input.checked);
    });
  });

  // Sector dropdown
  panel.querySelector('select').addEventListener('change', (e) => {
    setToggle('sectorLens', e.target.value || null);
  });
}
```

Add corresponding CSS for `.toggle-panel` (positioned bottom-right, collapsible) to `src/styles/filters.css` or a new file.

- [ ] **Step 2: Create connections renderer**

```js
// src/components/connections.js
import { services } from '../data/services.js';
import { subscribe } from '../utils/state.js';

export function initConnections(svg, positions) {
  const crossLines = [];

  // Pre-create all cross-C connection lines (hidden)
  services.forEach(svc => {
    svc.relatedIds.forEach(relId => {
      // Avoid duplicates (only draw A→B, not B→A)
      if (svc.id < relId) {
        const from = positions.get(svc.id);
        const to = positions.get(relId);
        if (from && to) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', from.x);
          line.setAttribute('y1', from.y);
          line.setAttribute('x2', to.x);
          line.setAttribute('y2', to.y);
          line.style.stroke = 'var(--wt-yellow)';
          line.style.strokeWidth = '0.8';
          line.style.opacity = '0';
          line.style.strokeDasharray = '4 4';
          line.style.transition = 'opacity var(--transition-normal)';
          svg.appendChild(line);
          crossLines.push(line);
        }
      }
    });
  });

  subscribe('connections', (state) => {
    const show = state.toggles.connections;
    crossLines.forEach(line => {
      line.style.opacity = show ? '0.3' : '0';
    });
  });
}
```

- [ ] **Step 3: Wire both into main.js**

- [ ] **Step 4: Commit**

```bash
git add src/components/toggle-controls.js src/components/connections.js src/main.js
git commit -m "feat: add toggle controls panel and connections view"
```

---

### Task 14: Digital Highlight + Sector Lens

**Files:**
- Create: `src/components/digital-highlight.js`
- Create: `src/components/sector-lens.js`

- [ ] **Step 1: Create digital highlight** — subscribes to state, toggles `.hex--digital-highlight` class on digital services.

- [ ] **Step 2: Create sector lens** — subscribes to state, uses `sectorServiceMap` to dim/highlight hexes when a sector is selected.

- [ ] **Step 3: Wire into main.js**

- [ ] **Step 4: Commit**

```bash
git add src/components/digital-highlight.js src/components/sector-lens.js src/main.js
git commit -m "feat: add digital highlight and sector lens toggles"
```

---

### Task 15: Particle Background

**Files:**
- Create: `src/components/particles.js`

- [ ] **Step 1: Create lightweight canvas particle system**

A canvas element behind the hex grid. ~50 slow-moving dots that drift subtly in response to mouse position. Respects `prefers-reduced-motion` (disabled) and `isLowPerformance()` (halves density).

- [ ] **Step 2: Wire into main.js** — init after entrance animation completes.

- [ ] **Step 3: Commit**

```bash
git add src/components/particles.js src/main.js
git commit -m "feat: add ambient particle background with mouse parallax"
```

---

## Chunk 5: Case Studies, Guided Tour, Polish

### Task 16: Case Studies Section

**Files:**
- Create: `src/components/case-studies.js`
- Create: `src/styles/case-studies.css`

- [ ] **Step 1: Create horizontal scrolling case study cards with modal overlay on click.** Cards show project name, location, sector tag. Modal uses same glassmorphism as detail panel.

- [ ] **Step 2: Commit**

```bash
git add src/components/case-studies.js src/styles/case-studies.css src/main.js
git commit -m "feat: add case studies horizontal scroll with modal overlay"
```

---

### Task 17: Guided Tour

**Files:**
- Create: `src/components/guided-tour.js`

- [ ] **Step 1: Create guided tour** — GSAP timeline that steps through 6 services, highlights each hex, shows narrative overlay text, auto-advances with pause/skip controls. Resets filters on start. Pauses on hex click.

- [ ] **Step 2: Add a "Take a Tour" button to toggle controls panel.**

- [ ] **Step 3: Commit**

```bash
git add src/components/guided-tour.js src/main.js
git commit -m "feat: add guided tour with animated walkthrough"
```

---

### Task 18: Mobile Fallback (<768px)

**Files:**
- Create: `src/styles/mobile.css`

- [ ] **Step 1: Create accordion layout** for `<768px` — hides hex grid, shows vertical accordion of 3 C's → categories → services with expandable sections. Same content, different presentation.

- [ ] **Step 2: Commit**

```bash
git add src/styles/mobile.css src/main.js
git commit -m "feat: add mobile accordion fallback for sub-768px viewports"
```

---

### Task 19: Final Polish + Build Verification

- [ ] **Step 1: Run production build**

```bash
npx vite build
```

Expected: Clean build in `dist/`, no errors. Check output size < 2MB.

- [ ] **Step 2: Test in Edge** — open `dist/index.html` via a local server, verify animations run smoothly.

- [ ] **Step 3: Verify reduced motion** — enable `prefers-reduced-motion` in devtools, confirm entrance animation is skipped and particles are disabled.

- [ ] **Step 4: Commit and push**

```bash
git add -A
git commit -m "feat: production build and final polish"
git push
```
