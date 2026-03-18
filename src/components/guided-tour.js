import gsap from 'gsap';
import { setState, subscribe } from '../utils/state.js';

const tourSteps = [
  { serviceId: 'maturity-assessments', text: 'We start by understanding your current capabilities — benchmarking maturity and identifying gaps to build an uplift roadmap.' },
  { serviceId: 'target-operating-model', text: 'Next, we design the right organisational structure and roles to deliver your projects successfully.' },
  { serviceId: 'governance-frameworks', text: 'We establish clear governance — decision structures, escalation pathways, and accountability that enable confident decisions.' },
  { serviceId: 'portfolio-management', text: 'With the foundations in place, we optimise your portfolio — prioritising investments and monitoring performance.' },
  { serviceId: 'reporting', text: 'Real-time dashboards and automated reporting give your leaders the insights they need, when they need them.' },
  { serviceId: 'health-checks', text: 'Independent assurance keeps everything on track — catching issues early before they become problems.' },
];

let overlayEl = null;
let currentStep = 0;
let tourActive = false;

export function initGuidedTour(container, hexElements) {
  overlayEl = document.createElement('div');
  overlayEl.className = 'tour-overlay';
  overlayEl.innerHTML = `
    <div class="tour-overlay__step"></div>
    <div class="tour-overlay__text"></div>
    <div class="tour-overlay__controls">
      <button class="tour-btn" id="tour-prev">Prev</button>
      <button class="tour-btn tour-btn--primary" id="tour-next">Next</button>
      <button class="tour-btn" id="tour-exit">Exit</button>
    </div>
  `;
  container.appendChild(overlayEl);

  document.getElementById('tour-next').addEventListener('click', () => nextStep(hexElements));
  document.getElementById('tour-prev').addEventListener('click', () => prevStep(hexElements));
  document.getElementById('tour-exit').addEventListener('click', exitTour);

  subscribe('tour-trigger', (state) => {
    if (state.toggles.guidedTour && !tourActive) startTour(hexElements);
  });
}

function startTour(hexElements) {
  tourActive = true;
  currentStep = 0;
  setState({ activeFilters: [], focusedPillar: null, selectedService: null, detailPanelOpen: false });
  showStep(hexElements);
  overlayEl.classList.add('tour-overlay--active');
}

function showStep(hexElements) {
  const step = tourSteps[currentStep];
  overlayEl.querySelector('.tour-overlay__step').textContent = `Step ${currentStep + 1} of ${tourSteps.length}`;
  overlayEl.querySelector('.tour-overlay__text').textContent = step.text;

  // Highlight the hex
  hexElements.forEach((el, id) => {
    el.classList.toggle('hex--dimmed', id !== step.serviceId);
    if (id === step.serviceId) {
      gsap.fromTo(el, { scale: 1 }, { scale: 1.15, duration: 0.4, ease: 'back.out(2)', yoyo: true, repeat: 1 });
    }
  });
}

function nextStep(hexElements) {
  if (currentStep < tourSteps.length - 1) { currentStep++; showStep(hexElements); }
  else exitTour();
}

function prevStep(hexElements) {
  if (currentStep > 0) { currentStep--; showStep(hexElements); }
}

function exitTour() {
  tourActive = false;
  overlayEl.classList.remove('tour-overlay--active');
  // Reset all hexes
  document.querySelectorAll('.hex').forEach(el => el.classList.remove('hex--dimmed'));
  setState({ activeFilters: [] });
}
