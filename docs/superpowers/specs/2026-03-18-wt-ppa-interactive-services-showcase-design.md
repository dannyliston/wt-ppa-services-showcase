# WT PPA Interactive Services Showcase — Design Spec

## Purpose

An interactive, visually premium web-based tool showcasing WT Partnership's Portfolio & Program Advisory (PPA) services. Designed to be embedded in SharePoint via iframe but built as a standalone static site. Functions as an internal marketing tool — impressing internal stakeholders with both the breadth of PPA services and the quality of the presentation itself.

**This is not an intranet page.** It should look and feel like a beautifully designed product website that happens to live inside SharePoint.

## Target Audience

Internal WT staff browsing the SharePoint intranet. The goal is to make PPA's services visible, understandable, and impressive to people across the firm who may not know what the team does or how the services connect.

## Hosting & Deployment

- **Build output:** Static site (HTML, CSS, JS) — no backend, no database
- **Primary hosting target:** Azure Static Web Apps (free tier)
- **Embed method:** SharePoint iframe/embed web part pointing to the hosted URL
- **Fallback:** HTML file in SharePoint document library (if tenant allows HTML rendering)

## Tech Stack

- **Build tool:** Vite (vanilla JS — no React/Vue)
- **Animations:** GSAP (core + ScrollTrigger) for hex grid assembly, transitions, and orchestrated sequences. CSS transitions for simple hover/toggle states.
- **Particle effects:** Lightweight canvas-based implementation (custom or tsParticles)
- **No heavy frameworks** (React, Vue, etc.) — unnecessary complexity for a static showcase. Alpine.js is acceptable if lightweight reactivity is needed for filter/toggle state.
- **Responsive:** Desktop-first. Must work at 1280px+ (primary) and 768px+ (tablet). Below 768px: graceful fallback showing a simplified vertical layout of the service hierarchy without the hex grid.

### Breakpoints
| Breakpoint | Behaviour |
|------------|-----------|
| ≥1280px | Full hex grid experience |
| 768–1279px | Hex grid scales down, detail panel overlays instead of side-panel |
| <768px | Fallback: vertical accordion layout of 3 C's → categories → services. No hex grid. |

## Colour Palette

### WT Primary
| Name | Hex |
|------|-----|
| WT Blue | #0063A6 |
| WT Yellow | #FFC200 |
| Light Grey | #D8DADB |
| Mid Grey | #83817E |

### WT Secondary
| Name | Hex |
|------|-----|
| Deep Grey | #4E4A46 |
| Process Blue | #0087CF |
| Light Blue | #E4EBF6 |
| Green | #76B330 |
| Orange | #F98303 |
| Blue Grey | #7CA5D0 |

### Theme (Dark Background)
| Name | Hex |
|------|-----|
| Primary background | #0A0F1A |
| Secondary background | #0E1425 |
| Tertiary background | #131A2E |
| Primary text | #F0F0F0 |

### Colour Usage
- **Dark theme throughout** — primary background #0A0F1A as base
- **WT Blue (#0063A6)** — primary interactive elements, hex borders, active states
- **WT Yellow (#FFC200)** — accents, highlights, the 3 C's centre hexes, CTAs
- **Process Blue (#0087CF)** — secondary interactive elements, hover states
- **Light Blue (#E4EBF6)** — subtle text highlights, tag backgrounds (at low opacity)
- **Green (#76B330)** — "People" filter tag colour
- **Orange (#F98303)** — "Technology" filter tag colour
- **Blue Grey (#7CA5D0)** — "Process" filter tag colour

## Information Architecture

### The 3 C's Framework

Each C maps to service categories, which contain individual services, which contain bullet-point detail.

#### Clarity — Controls and insights for capital performance

**Project Controls**
- Risk Management
  - Risk management frameworks
  - Quantitative Schedule Risk Analysis (QSRA)
  - Quantitative Cost Risk Analysis (QCRA)
  - Risk register development and management
  - Risk workshops and facilitation
- Planning
  - Program and project scheduling
  - Baseline management
  - Progress tracking and reporting
  - Critical path analysis
  - Schedule recovery planning
- Cost & Change Control
  - Cost planning and forecasting
  - Earned value management
  - Change request management
  - Variation tracking and assessment
  - Budget monitoring and reporting

**Tools and Insights**
- Reporting
  - Portfolio and program dashboards
  - Executive reporting
  - RAG status frameworks
  - Automated status reporting
  - Stakeholder-specific report design
- Data & Analytics
  - Data integration and consolidation
  - Performance benchmarking
  - Predictive analytics
  - Portfolio data quality improvement
- AI & Future Working Methods
  - AI-assisted status reporting
  - Automated risk flagging
  - Intelligent data extraction
  - Tool evaluation and implementation

**Assurance**
- Health Checks
  - Independent project/program health reviews
  - Diagnostic assessments
  - Remediation planning
- Gateway Reviews
  - Stage gate design and implementation
  - Independent gateway assessments
  - Decision-support recommendations
- Independent Assurance
  - Portfolio assurance frameworks
  - Compliance reviews
  - Investment decision assurance

#### Capability — Right approach, roles and culture

**Portfolio and Program Management**
- Portfolio Management
  - Portfolio prioritisation and optimisation
  - Capital planning
  - Benefits realisation
  - Portfolio performance monitoring
- Program Management
  - Program setup and mobilisation
  - Program delivery oversight
  - Interdependency management
  - Stakeholder management

**PMO Advisory**
- Maturity Assessments
  - Current-state capability assessment
  - Maturity benchmarking
  - Uplift roadmaps
  - Gap analysis
- Target Operating Model
  - Organisational design for project delivery
  - Role and accountability mapping
  - Operating model implementation
- Training & Development
  - Capability uplift programs
  - PM competency frameworks
  - Coaching and mentoring
  - Knowledge transfer

#### Consistency — Processes and dependable decision-making

**Change and Transformation**
- Change Management
  - Stakeholder impact analysis
  - Change readiness assessments
  - Communications planning
  - Adoption and embedding strategies
- Digital Transformation
  - Digital maturity assessment
  - Tool selection and implementation
  - System integration planning
  - User adoption programs

**Governance & Process**
- Governance Frameworks
  - Decision-making structures
  - Approval and escalation pathways
  - Committee design
  - Governance documentation
- PM Frameworks
  - Project lifecycle definition
  - Stage gate criteria
  - Methodology selection and tailoring
  - RACI development
- Process Improvement
  - Current-state process mapping
  - Efficiency analysis
  - Process redesign
  - Continuous improvement programs
- Templates & Methodologies
  - Standardised project templates
  - Methodology playbooks
  - Reporting templates
  - Toolkit development

### Service Tags

Every individual service is tagged with one or more of:
- **People** (Green #76B330) — services primarily about human capability, culture, change
- **Process** (Blue Grey #7CA5D0) — services primarily about frameworks, governance, methodology
- **Technology** (Orange #F98303) — services with strong digital/technology component

Tag mapping:

| Service | People | Process | Technology |
|---------|--------|---------|------------|
| Risk Management | | x | |
| Planning | | x | |
| Cost & Change Control | | x | |
| Reporting | | | x |
| Data & Analytics | | | x |
| AI & Future Working Methods | | | x |
| Health Checks | x | x | |
| Gateway Reviews | | x | |
| Independent Assurance | | x | |
| Portfolio Management | x | x | |
| Program Management | x | x | |
| Maturity Assessments | x | x | |
| Target Operating Model | x | x | |
| Training & Development | x | | |
| Change Management | x | | |
| Digital Transformation | x | | x |
| Governance Frameworks | | x | |
| PM Frameworks | | x | |
| Process Improvement | | x | |
| Templates & Methodologies | | x | x |

### Contact-to-Service Map

| Contact | Service Areas |
|---------|--------------|
| Adam Robinson | All (Head of PPA) — shown as fallback when no specific lead applies |
| Danny Liston | Reporting, Data & Analytics, AI & Future Working Methods, Digital Transformation, Templates & Methodologies |
| David Mackinder | Planning |
| Rachael Mccool | Change Management |
| Latham Conley | Risk Management |
| Peter Cosman | Portfolio Management, Program Management (VIC/SA) |
| Jared Cathcart | Portfolio Management, Program Management (QLD/WA) |

For services without a specific lead (Maturity Assessments, Target Operating Model, Training & Development, Governance Frameworks, PM Frameworks, Process Improvement, Health Checks, Gateway Reviews, Independent Assurance, Cost & Change Control), show Adam Robinson as the contact.

### Related Services Map

Cross-C connections that appear in the detail panel's "Related services" section and in the Connections View toggle:

| Service | Related Services |
|---------|-----------------|
| Risk Management | Governance Frameworks, Planning, Health Checks |
| Planning | Risk Management, Cost & Change Control, Program Management |
| Cost & Change Control | Planning, Governance Frameworks, Reporting |
| Reporting | Data & Analytics, Portfolio Management, Cost & Change Control |
| Data & Analytics | Reporting, AI & Future Working Methods |
| AI & Future Working Methods | Data & Analytics, Digital Transformation, Reporting |
| Health Checks | Gateway Reviews, Independent Assurance, Risk Management |
| Gateway Reviews | Health Checks, Governance Frameworks, PM Frameworks |
| Independent Assurance | Health Checks, Gateway Reviews, Governance Frameworks |
| Portfolio Management | Program Management, Reporting, Maturity Assessments |
| Program Management | Portfolio Management, Planning, Change Management |
| Maturity Assessments | Target Operating Model, Process Improvement, Portfolio Management |
| Target Operating Model | Maturity Assessments, Governance Frameworks, PM Frameworks |
| Training & Development | Change Management, Maturity Assessments |
| Change Management | Training & Development, Program Management, Digital Transformation |
| Digital Transformation | AI & Future Working Methods, Change Management, Templates & Methodologies |
| Governance Frameworks | PM Frameworks, Risk Management, Target Operating Model |
| PM Frameworks | Governance Frameworks, Gateway Reviews, Templates & Methodologies |
| Process Improvement | Maturity Assessments, Templates & Methodologies, Governance Frameworks |
| Templates & Methodologies | PM Frameworks, Process Improvement, Digital Transformation |

### Sector List (for Sector Lens toggle)

Aviation, Commercial & Workplace, Data Centres, Defence, Education, Energy, Healthcare, Hotels & Entertainment, Industrial & Logistics, Life Sciences, Mixed Use, Public & Civic, Residential, Retail, Sports & Venues, Transport, Water

Sector-to-service mapping is placeholder data for now — will be populated later.

## Page Structure

### 1. Header Bar
- WT logo (top-left)
- "Portfolio & Program Advisory" title
- Tagline: "Empowering growth."
- Subtle, minimal — doesn't compete with the hex grid

### 2. Hero / Hex Grid Section (Primary)
The centrepiece of the page. Full-width, generous height.

#### Hex Grid Layout

The grid is organic and asymmetric — the 3 C's have different numbers of children and that's fine. The layout should feel natural, like a network graph, not forced into rigid symmetry.

- **Centre cluster:** Three slightly larger hexes for Clarity, Capability, Consistency — arranged in a tight triangle. Each hex has the C name and its tagline. WT Yellow border/glow treatment.
  - Clarity (top) — 3 categories, 9 services
  - Capability (bottom-left) — 2 categories, 5 services
  - Consistency (bottom-right) — 2 categories, 6 services
- **Middle ring:** Service category hexes radiating from their parent C. Connected to parent by thin animated lines. WT Blue treatment. Positioned using force-directed layout logic — categories space themselves evenly around their parent C with enough room for their children.
- **Outer ring:** Individual service hexes radiating from their parent category. ~70% the size of category hexes. Connected by thinner lines. Process Blue or Blue Grey treatment.
- **Total hex count:** 3 (C's) + 7 (categories) + 20 (services) = 30 hexes. The grid should fit comfortably within a 1280x700px viewport without scrolling.

#### Entrance Animation
On page load, the grid assembles:
1. The 3 C's hexes appear first (fade in + subtle scale)
2. Connection lines draw outward from each C
3. Service category hexes fly in along the connection lines and lock into place
4. Outer service hexes cascade in with a slight stagger
5. Particle background fades in underneath
6. Total animation: ~2-3 seconds, eased, not frantic

#### Interaction — Base Experience
- **Hover on any hex:** Subtle glow intensifies, hex lifts slightly (scale + shadow), connected lines brighten
- **Click a C hex:** Other branches fade to 20% opacity and scale down slightly. The clicked C's branch recentres in the viewport via smooth transform (no actual zoom/scale — just translate + opacity changes). Click the same C again, click the background, or press Escape to reset.
- **Click a service category hex:** Its child service hexes pulse and brighten. If children were too tightly packed, they spread slightly for legibility.
- **Click an individual service hex:** The entire grid smoothly translates left (transform: translateX) to occupy ~45% of the viewport width, scaling down proportionally. The detail panel slides in from the right to fill the remaining ~55%. No hexes are removed or repositioned — it's a single transform on the grid container.

#### Detail Panel
- Appears on right side when a service is clicked
- Dark glassmorphism card (semi-transparent with blur backdrop)
- Contains:
  - Service name (large)
  - Parent C badge (small coloured tag)
  - People/Process/Technology tags
  - Value statement (one sentence — placeholder text for now, to be replaced with real copy)
  - Bullet points (the detailed offerings — content defined in Information Architecture section)
  - "Related services" — small clickable hex icons for connected services (see Related Services Map below)
  - Contact — relevant team lead for that service area (see Contact-to-Service Map below)
- Close button or click outside to dismiss
- Transitions seamlessly if you click a related service (panel content swaps with animation)

#### People / Process / Technology Filter
- Three filter buttons, always visible (above or beside the grid)
- Each styled with its tag colour
- Click one: non-matching hexes dim and recede, matching hexes glow and pull slightly forward
- Can activate multiple filters simultaneously (additive)
- Click again to deactivate
- Smooth animation on filter toggle (~300ms)

### 3. Toggle Controls Panel
A small collapsible control bar anchored to the **bottom-right** of the hex section (avoids competing with the header, stays out of the way of the grid). A small gear/settings icon that expands upward into a vertical pill-shaped panel with toggle switches. Collapses back to the icon when not in use.

#### Connections View
- Shows dependency/relationship lines between services across different C's
- Lines animate on (drawn like being sketched)
- Shows that services are an integrated system, not siloed
- Example connections: Risk Management ↔ Governance Frameworks, Digital Transformation ↔ AI & Future Working Methods, Maturity Assessments ↔ Process Improvement

#### Sector Lens
- Dropdown of 17 sectors
- Selecting a sector highlights services commonly engaged for that sector
- Non-relevant hexes dim
- Placeholder data for now

#### Guided Tour
- "Play" button that triggers an animated walkthrough
- Highlights a typical client journey through the hex grid
- Step sequence (example): Maturity Assessment → Target Operating Model → Governance Frameworks → Portfolio Management → Reporting → Assurance
- Each step: hex pulses, connection line animates, brief narrative text appears (2-3 sentences)
- Auto-advances with pause/skip controls
- Can be exited at any time

#### Digital Highlight
- Toggles the circuit-board edge animation on tech-heavy services
- Faint glowing trace line animates around the hex border
- Applied to: Reporting, Data & Analytics, AI & Future Working Methods, Digital Transformation, Templates & Methodologies

### 4. Stats Bar
- Persistent bar (below hero or as a divider between hero and case studies)
- Key credentials with count-up animation on first scroll into view:
  - 75+ years of experience
  - 2,000+ staff globally
  - 500+ specialists in Australia
  - 70+ offices worldwide
  - 12 offices nationwide
- Clean horizontal layout, subtle styling

### 5. Case Studies Section
- Below the hex grid
- Horizontal scrollable row of case study cards
- Each card:
  - Project image (placeholder)
  - Project name
  - Location
  - Sector tag
  - Service tags (which PPA services were involved)
- Click a card: expands as a modal overlay (dark glassmorphism, same treatment as detail panel) with placeholder content. Does not push other cards.
- Bonus interaction: clicking a case study highlights the relevant service hexes in the grid above (scroll-to + highlight animation)
- Case study-to-service mapping: placeholder data for now (listed under Out of Scope)

#### Placeholder Case Studies (from PDF)
- Citadel | Global
- Sydney Metro | NSW
- Cairns Airport | QLD
- Crown Resorts Limited | VIC
- Blacktown City Council | NSW
- British Associated Foods, Flour Mill | VIC
- Suburban Rail Loop | VIC
- Uniting Church | VIC
- Marvel Stadium | VIC
- Barwon Water Regional Renewable Organics Network | VIC
- Bridgewater Bridge | TAS
- Tasports | TAS

### 6. Contacts Section
- Grid or card layout of leadership team
- Each contact card:
  - Name
  - Role
  - Email (clickable mailto link)
  - Optional: headshot placeholder
- Styled to match the dark theme

#### Contacts
- Adam Robinson — Head of Portfolio & Program Advisory
- Danny Liston — NSW State Lead & Digital Services Lead
- Peter Cosman — VIC & SA State Lead
- Jared Cathcart — QLD & WA State Lead
- David Mackinder — Planning Services Lead
- Rachael Mccool — Change Management Lead
- Latham Conley — Risk Management Lead

### 7. Footer
- Minimal
- WT logo
- "Empowering growth." tagline
- Copyright

## Ambient Effects

### Particle Background
- Slow-moving dots of light on the dark background
- Respond subtly to mouse movement (parallax drift)
- Very low density — atmospheric, not distracting
- Inspired by the dot-map style from the PDF
- Fades in after hex grid assembly completes

### General Animation Principles
- All transitions eased (ease-out or cubic-bezier)
- Nothing instant, nothing slow — 200-400ms for interactions, 2-3s for entrance
- Hover states respond immediately (<100ms)
- No animation for animation's sake — everything should feel intentional and purposeful
- Respect `prefers-reduced-motion` media query

## Interaction Edge Cases

### Filter + Toggle Combinations
- **People/Process/Tech filter + Sector Lens:** Combined as intersection. A hex must match both the active filter AND the selected sector to remain highlighted. If no hexes match, show a subtle "No matching services" message.
- **People/Process/Tech filter + Connections View:** Only show connection lines between currently highlighted (non-dimmed) hexes.
- **Any filter/toggle + Guided Tour:** Starting the tour resets all active filters and toggles. Tour has exclusive control.
- **Dimmed hexes are still clickable.** Clicking a dimmed hex opens its detail panel and simultaneously clears the active filter. This prevents dead zones.

### Detail Panel States
- **Detail panel open + filter toggled:** Panel stays open. If the currently shown service becomes dimmed by the filter, panel remains but a subtle indicator shows it's outside the current filter.
- **Detail panel open + click another service:** Panel content cross-fades to the new service (no close/reopen).
- **Detail panel open + Escape key or click background:** Panel slides out, grid translates back to centre.

### Guided Tour Interruption
- **Click a hex mid-tour:** Tour pauses. A small "Resume tour" button appears. The clicked hex opens its detail panel.
- **Toggle a filter mid-tour:** Tour cancels with a graceful fade-out of tour UI elements.
- **Navigate away (scroll to case studies) mid-tour:** Tour pauses, resumes if user scrolls back up.

### Loading and Fallback
- **Initial load state:** Dark background (#0A0F1A) appears immediately (inline CSS). A minimal WT logo + subtle loading animation (three dots pulsing in WT Yellow) shows centre-screen while JS loads. The entrance animation then replaces this seamlessly.
- **iframe embed failure:** Not handled in-app (SharePoint will show its own iframe error). The hosted URL should work standalone as a fallback.
- **Slow connection:** GSAP and critical CSS load first (<50KB). Particle effects and case study images load lazily after the grid is interactive.

### Touch / Tablet
- **No hover on touch:** Hover glow effects are suppressed via `@media (hover: hover)`. First tap on a hex selects it (equivalent to click). The hex gets the glow/lift treatment on selection instead.
- **Detail panel on tablet (768-1279px):** Overlays as a full-width panel from the bottom (slide up), rather than side panel, to preserve grid visibility.

### Browser Navigation
- **No URL state management.** This is an iframe embed — manipulating history would affect the parent SharePoint page. All state (active filters, open panels, tour progress) is in-memory JS only. Browser back button is not intercepted.

## Performance Requirements
- First meaningful paint < 2 seconds
- Total page weight < 2MB gzipped (excluding case study images). GSAP core ~30KB, app JS + CSS ~100-200KB, fonts ~100KB, particle engine ~20KB. Budget is comfortable.
- **Graceful degradation:** If `backdrop-filter` causes frame drops (detectable via `requestAnimationFrame` timing), fall back to solid semi-transparent backgrounds (no blur). Particle density halves on detected low performance.
- Smooth 60fps animations
- No layout shift after initial load
- Works in Edge (primary — SharePoint users) and Chrome

## Accessibility
- All interactive elements keyboard-navigable
- Hex grid content available via screen reader (hidden semantic structure)
- Sufficient colour contrast on all text
- Reduced motion mode disables particle effects and entrance animations
- Detail panel content is the same whether accessed via click or keyboard

## Out of Scope
- Backend / CMS / database
- User authentication
- Content editing by non-developers
- Mobile-first responsive design (tablet minimum)
- Real case study content (placeholders only)
- Real sector-to-service mapping data (placeholders only)
- Case study-to-service mapping data (placeholders only)
- Real value statements per service (placeholder text)
- Guided tour narrative copy (placeholder text)
- Search functionality
- Print/export functionality
- Analytics/tracking
