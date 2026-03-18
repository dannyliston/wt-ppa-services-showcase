// Complete service hierarchy: 3 C's → 7 categories → 20 services

export const pillars = [
  { id: 'clarity', name: 'Clarity', tagline: 'Controls and insights for capital performance' },
  { id: 'capability', name: 'Capability', tagline: 'Right approach, roles and culture' },
  { id: 'consistency', name: 'Consistency', tagline: 'Processes and dependable decision-making' },
];

export const categories = [
  { id: 'project-controls', name: 'Project Controls', pillarId: 'clarity' },
  { id: 'tools-insights', name: 'Tools & Insights', pillarId: 'clarity' },
  { id: 'assurance', name: 'Assurance', pillarId: 'clarity' },
  { id: 'portfolio-program-mgmt', name: 'Portfolio & Program Mgmt', pillarId: 'capability' },
  { id: 'pmo-advisory', name: 'PMO Advisory', pillarId: 'capability' },
  { id: 'change-transformation', name: 'Change & Transformation', pillarId: 'consistency' },
  { id: 'governance-process', name: 'Governance & Process', pillarId: 'consistency' },
];

export const services = [
  {
    id: 'risk-management', name: 'Risk Management', categoryId: 'project-controls',
    tags: ['process'], digital: false, contactId: 'latham-conley',
    valueStatement: 'Structured risk management that protects your investment and schedule.',
    bullets: ['Risk management frameworks', 'Quantitative Schedule Risk Analysis (QSRA)', 'Quantitative Cost Risk Analysis (QCRA)', 'Risk register development and management', 'Risk workshops and facilitation'],
    relatedIds: ['governance-frameworks', 'planning', 'health-checks'],
  },
  {
    id: 'planning', name: 'Planning', categoryId: 'project-controls',
    tags: ['process'], digital: false, contactId: 'david-mackinder',
    valueStatement: 'Robust scheduling that keeps programs on track from baseline to completion.',
    bullets: ['Program and project scheduling', 'Baseline management', 'Progress tracking and reporting', 'Critical path analysis', 'Schedule recovery planning'],
    relatedIds: ['risk-management', 'cost-change-control', 'program-management'],
  },
  {
    id: 'cost-change-control', name: 'Cost & Change Control', categoryId: 'project-controls',
    tags: ['process'], digital: false, contactId: 'adam-robinson',
    valueStatement: 'Tight cost controls and change management to protect your budget.',
    bullets: ['Cost planning and forecasting', 'Earned value management', 'Change request management', 'Variation tracking and assessment', 'Budget monitoring and reporting'],
    relatedIds: ['planning', 'governance-frameworks', 'reporting'],
  },
  {
    id: 'reporting', name: 'Reporting', categoryId: 'tools-insights',
    tags: ['technology'], digital: true, contactId: 'danny-liston',
    valueStatement: 'Dashboards and reports that give decision-makers the right information at the right time.',
    bullets: ['Portfolio and program dashboards', 'Executive reporting', 'RAG status frameworks', 'Automated status reporting', 'Stakeholder-specific report design'],
    relatedIds: ['data-analytics', 'portfolio-management', 'cost-change-control'],
  },
  {
    id: 'data-analytics', name: 'Data & Analytics', categoryId: 'tools-insights',
    tags: ['technology'], digital: true, contactId: 'danny-liston',
    valueStatement: 'Turning portfolio data into actionable intelligence.',
    bullets: ['Data integration and consolidation', 'Performance benchmarking', 'Predictive analytics', 'Portfolio data quality improvement'],
    relatedIds: ['reporting', 'ai-future-methods'],
  },
  {
    id: 'ai-future-methods', name: 'AI & Future Methods', categoryId: 'tools-insights',
    tags: ['technology'], digital: true, contactId: 'danny-liston',
    valueStatement: 'Harnessing AI to reduce admin burden and surface insights faster.',
    bullets: ['AI-assisted status reporting', 'Automated risk flagging', 'Intelligent data extraction', 'Tool evaluation and implementation'],
    relatedIds: ['data-analytics', 'digital-transformation', 'reporting'],
  },
  {
    id: 'health-checks', name: 'Health Checks', categoryId: 'assurance',
    tags: ['people', 'process'], digital: false, contactId: 'adam-robinson',
    valueStatement: 'Independent assessments that identify issues before they become problems.',
    bullets: ['Independent project/program health reviews', 'Diagnostic assessments', 'Remediation planning'],
    relatedIds: ['gateway-reviews', 'independent-assurance', 'risk-management'],
  },
  {
    id: 'gateway-reviews', name: 'Gateway Reviews', categoryId: 'assurance',
    tags: ['process'], digital: false, contactId: 'adam-robinson',
    valueStatement: 'Rigorous stage gates that ensure projects are ready to progress.',
    bullets: ['Stage gate design and implementation', 'Independent gateway assessments', 'Decision-support recommendations'],
    relatedIds: ['health-checks', 'governance-frameworks', 'pm-frameworks'],
  },
  {
    id: 'independent-assurance', name: 'Independent Assurance', categoryId: 'assurance',
    tags: ['process'], digital: false, contactId: 'adam-robinson',
    valueStatement: 'Confidence that investments are sound and delivery is on track.',
    bullets: ['Portfolio assurance frameworks', 'Compliance reviews', 'Investment decision assurance'],
    relatedIds: ['health-checks', 'gateway-reviews', 'governance-frameworks'],
  },
  {
    id: 'portfolio-management', name: 'Portfolio Management', categoryId: 'portfolio-program-mgmt',
    tags: ['people', 'process'], digital: false, contactId: 'kristian-lojszczyk',
    valueStatement: 'Strategic portfolio oversight that maximises capital performance.',
    bullets: ['Portfolio prioritisation and optimisation', 'Capital planning', 'Benefits realisation', 'Portfolio performance monitoring'],
    relatedIds: ['program-management', 'reporting', 'maturity-assessments'],
  },
  {
    id: 'program-management', name: 'Program Management', categoryId: 'portfolio-program-mgmt',
    tags: ['people', 'process'], digital: false, contactId: 'kristian-lojszczyk',
    valueStatement: 'Hands-on program leadership from mobilisation through to delivery.',
    bullets: ['Program setup and mobilisation', 'Program delivery oversight', 'Interdependency management', 'Stakeholder management'],
    relatedIds: ['portfolio-management', 'planning', 'change-management'],
  },
  {
    id: 'maturity-assessments', name: 'Maturity Assessments', categoryId: 'pmo-advisory',
    tags: ['people', 'process'], digital: false, contactId: 'adam-robinson',
    valueStatement: 'Understanding where you are today to define the path forward.',
    bullets: ['Current-state capability assessment', 'Maturity benchmarking', 'Uplift roadmaps', 'Gap analysis'],
    relatedIds: ['target-operating-model', 'process-improvement', 'portfolio-management'],
  },
  {
    id: 'target-operating-model', name: 'Target Operating Model', categoryId: 'pmo-advisory',
    tags: ['people', 'process'], digital: false, contactId: 'adam-robinson',
    valueStatement: 'Designing the right organisational structure for successful project delivery.',
    bullets: ['Organisational design for project delivery', 'Role and accountability mapping', 'Operating model implementation'],
    relatedIds: ['maturity-assessments', 'governance-frameworks', 'pm-frameworks'],
  },
  {
    id: 'training-development', name: 'Training & Development', categoryId: 'pmo-advisory',
    tags: ['people'], digital: false, contactId: 'adam-robinson',
    valueStatement: 'Building lasting capability in your people and teams.',
    bullets: ['Capability uplift programs', 'PM competency frameworks', 'Coaching and mentoring', 'Knowledge transfer'],
    relatedIds: ['change-management', 'maturity-assessments'],
  },
  {
    id: 'change-management', name: 'Change Management', categoryId: 'change-transformation',
    tags: ['people'], digital: false, contactId: 'rachael-mccool',
    valueStatement: 'Guiding people through change so new ways of working stick.',
    bullets: ['Stakeholder impact analysis', 'Change readiness assessments', 'Communications planning', 'Adoption and embedding strategies'],
    relatedIds: ['training-development', 'program-management', 'digital-transformation'],
  },
  {
    id: 'digital-transformation', name: 'Digital Transformation', categoryId: 'change-transformation',
    tags: ['people', 'technology'], digital: true, contactId: 'danny-liston',
    valueStatement: 'Selecting and implementing the right digital tools for lasting impact.',
    bullets: ['Digital maturity assessment', 'Tool selection and implementation', 'System integration planning', 'User adoption programs'],
    relatedIds: ['ai-future-methods', 'change-management', 'templates-methodologies'],
  },
  {
    id: 'governance-frameworks', name: 'Governance Frameworks', categoryId: 'governance-process',
    tags: ['process'], digital: false, contactId: 'adam-robinson',
    valueStatement: 'Clear governance that enables fast, confident decisions.',
    bullets: ['Decision-making structures', 'Approval and escalation pathways', 'Committee design', 'Governance documentation'],
    relatedIds: ['pm-frameworks', 'risk-management', 'target-operating-model'],
  },
  {
    id: 'pm-frameworks', name: 'PM Frameworks', categoryId: 'governance-process',
    tags: ['process'], digital: false, contactId: 'adam-robinson',
    valueStatement: 'Consistent project management methodology tailored to your organisation.',
    bullets: ['Project lifecycle definition', 'Stage gate criteria', 'Methodology selection and tailoring', 'RACI development'],
    relatedIds: ['governance-frameworks', 'gateway-reviews', 'templates-methodologies'],
  },
  {
    id: 'process-improvement', name: 'Process Improvement', categoryId: 'governance-process',
    tags: ['process'], digital: false, contactId: 'adam-robinson',
    valueStatement: 'Streamlining processes to eliminate waste and improve outcomes.',
    bullets: ['Current-state process mapping', 'Efficiency analysis', 'Process redesign', 'Continuous improvement programs'],
    relatedIds: ['maturity-assessments', 'templates-methodologies', 'governance-frameworks'],
  },
  {
    id: 'templates-methodologies', name: 'Templates & Methodologies', categoryId: 'governance-process',
    tags: ['process', 'technology'], digital: true, contactId: 'danny-liston',
    valueStatement: 'Ready-to-use tools and templates that drive consistency across projects.',
    bullets: ['Standardised project templates', 'Methodology playbooks', 'Reporting templates', 'Toolkit development'],
    relatedIds: ['pm-frameworks', 'process-improvement', 'digital-transformation'],
  },
];

export const contacts = [
  { id: 'adam-robinson', name: 'Adam Robinson', role: 'Head of Portfolio & Program Advisory', email: 'arobinson@wtpartnership.com.au' },
  { id: 'danny-liston', name: 'Danny Liston', role: 'NSW State Lead & Digital Services Lead', email: 'dliston@wtpartnership.com.au' },
  { id: 'david-mackinder', name: 'David Mackinder', role: 'Planning Services Lead', email: 'dmackinder@wtpartnership.com.au' },
  { id: 'jared-cathcart', name: 'Jared Cathcart', role: 'QLD & WA State Lead', email: 'jcathcart@wtpartnership.com.au' },
  { id: 'kristian-lojszczyk', name: 'Kristian Lojszczyk', role: 'Associate Director, VIC', email: 'klojszczyk@wtpartnership.com.au' },
  { id: 'rachael-mccool', name: 'Rachael Mccool', role: 'Change Management Lead', email: 'rmccool@wtpartnership.com.au' },
  { id: 'latham-conley', name: 'Latham Conley', role: 'Risk Management Lead', email: 'lconley@wtpartnership.com.au' },
  { id: 'pamela-doyle', name: 'Pamela Doyle', role: 'Senior Consultant', email: 'pdoyle@wtpartnership.com.au' },
];

export function getPillarForService(serviceId) {
  const svc = services.find(s => s.id === serviceId);
  if (!svc) return null;
  const cat = categories.find(c => c.id === svc.categoryId);
  if (!cat) return null;
  return pillars.find(p => p.id === cat.pillarId);
}

export function getContactForService(serviceId) {
  const svc = services.find(s => s.id === serviceId);
  if (!svc) return contacts[0];
  return contacts.find(c => c.id === svc.contactId) || contacts[0];
}
