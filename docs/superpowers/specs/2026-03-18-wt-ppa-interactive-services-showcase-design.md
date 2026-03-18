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

- **Framework:** Vanilla HTML/CSS/JS or lightweight framework (e.g. Vite + vanilla JS)
- **Animations:** CSS animations + a lightweight library (GSAP or anime.js) for the hex grid assembly, transitions, and particle effects
- **No heavy frameworks** (React, Vue, etc.) — unnecessary complexity for a static showcase
- **Responsive:** Must work on desktop (primary) and tablet. Mobile is a nice-to-have but not critical for a SharePoint embed

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
- **Centre cluster:** Three slightly larger hexes for Clarity, Capability, Consistency — arranged in a tight triangle. Each hex has the C name and its tagline. WT Yellow border/glow treatment.
- **Middle ring:** Service category hexes (Project Controls, Tools & Insights, Assurance, Portfolio & Program Mgmt, PMO Advisory, Change & Transformation, Governance & Process) radiating from their parent C. Connected to parent by thin animated lines. WT Blue treatment.
- **Outer ring:** Individual service hexes radiating from their parent category. Slightly smaller. Connected by thinner lines. Lighter treatment (Process Blue or Blue Grey).

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
- **Click a C hex:** Zooms/focuses on that C's branch, other branches dim. Click again or click background to reset.
- **Click a service category hex:** Expands to show its child services more prominently
- **Click an individual service hex:** Grid compresses to the left, detail panel slides in from the right

#### Detail Panel
- Appears on right side when a service is clicked
- Dark glassmorphism card (semi-transparent with blur backdrop)
- Contains:
  - Service name (large)
  - Parent C badge (small coloured tag)
  - People/Process/Technology tags
  - Value statement (one sentence)
  - Bullet points (the detailed offerings)
  - "Related services" — small clickable hex icons for connected services
  - Contact — relevant team lead for that service area
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
A small collapsible control bar (icon in top-right or bottom-right of the hex section). Expands to reveal toggles:

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
- Click a card: expands to show more detail (placeholder content for now)
- Bonus interaction: clicking a case study highlights the relevant service hexes in the grid above (scroll-to + highlight animation)

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

## Performance Requirements
- First meaningful paint < 2 seconds
- Total page weight < 2MB (excluding case study images)
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
- Search functionality
