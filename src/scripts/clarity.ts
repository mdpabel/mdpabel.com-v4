import Clarity from '@microsoft/clarity';

const projectId = import.meta.env.PUBLIC_CLARITY_PROJECT_ID;

let clarityInitialized = false;

function initClarity() {
  if (clarityInitialized) return;
  if (typeof window === 'undefined') return;
  if (!projectId) return;

  Clarity.init(projectId);

  Clarity.setTag('site', 'mdpabel.com');
  Clarity.setTag('site_type', 'service_business');
  Clarity.setTag('primary_service', 'wordpress_malware_removal');

  clarityInitialized = true;
}

function bindClarityEvents() {
  document
    .querySelectorAll<HTMLElement>('[data-clarity-event]')
    .forEach((el) => {
      if (el.dataset.clarityBound === 'true') return;

      el.dataset.clarityBound = 'true';

      el.addEventListener('click', () => {
        const eventName = el.dataset.clarityEvent;

        if (eventName) {
          Clarity.event(eventName);
        }
      });
    });
}

function bootClarity() {
  initClarity();
  bindClarityEvents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootClarity, { once: true });
} else {
  bootClarity();
}

document.addEventListener('astro:page-load', bootClarity);
