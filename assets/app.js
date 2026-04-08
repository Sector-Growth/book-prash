/*
 * Sector Growth · Book Prash
 *
 * Wires the two custom-styled cards to Google Calendar's official scheduling
 * button script. Each card delegates its click to a hidden, Google-rendered
 * <button> inside a hidden container; that button opens Google's native
 * in-page modal popup with the Workspace Appointment booking flow.
 *
 * If the Google script fails to load (e.g. ad blocker, offline), each card
 * falls back to opening its booking URL in a new tab.
 *
 * To change either booking link, edit the constants below and redeploy.
 */

const BOOKING_30MIN_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0m0M0S4JliJAhghnQLoLfmvDF7cC9kn9z6c0exWUnWYW0nGc-KUuNGvhrpUdjGQreI-pqwx53I?gv=true';
const BOOKING_60MIN_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0vh4_WAF3rzjlTfbHfqbQWYOBucgDK210ykdULWqg_-sFLlVf1rF4TgZXN5yHg8HJG23iHH5N-?gv=true';

const BOOKING_CONFIG = {
  '30': {
    url: BOOKING_30MIN_URL,
    color: '#6BCFEE',
    label: 'Book 30 Minutes',
    targetId: 'g-30',
  },
  '60': {
    url: BOOKING_60MIN_URL,
    color: '#1E4DA8',
    label: 'Book 1 hour with Prash',
    targetId: 'g-60',
  },
};

/**
 * Mount Google's scheduling buttons into the hidden containers.
 * Idempotent: safe to call after the script has loaded.
 */
function mountGoogleSchedulingButtons() {
  if (!window.calendar || !window.calendar.schedulingButton) {
    return false;
  }
  for (const key of Object.keys(BOOKING_CONFIG)) {
    const cfg = BOOKING_CONFIG[key];
    const target = document.getElementById(cfg.targetId);
    if (!target) continue;
    if (target.dataset.mounted === '1') continue;
    try {
      window.calendar.schedulingButton.load({
        url: cfg.url,
        color: cfg.color,
        label: cfg.label,
        target: target,
      });
      target.dataset.mounted = '1';
    } catch (e) {
      // Swallow — fallback handles failures.
      console.warn('[book-prash] Failed to mount Google scheduling button for', key, e);
    }
  }
  return true;
}

/**
 * Try mounting now and again on a short interval until the Google script
 * has loaded. Gives up after ~6 seconds.
 */
function ensureGoogleButtonsMounted() {
  if (mountGoogleSchedulingButtons()) return;
  let attempts = 0;
  const max = 30; // 30 * 200ms = 6s
  const interval = setInterval(() => {
    attempts += 1;
    if (mountGoogleSchedulingButtons() || attempts >= max) {
      clearInterval(interval);
    }
  }, 200);
}

/**
 * Wire each custom card to delegate its click to the Google button if
 * available, or fall back to opening the URL in a new tab.
 */
function wireCardDelegation() {
  document.querySelectorAll('[data-booking]').forEach((card) => {
    card.addEventListener('click', () => {
      const which = card.dataset.booking;
      const cfg = BOOKING_CONFIG[which];
      if (!cfg) return;
      const target = document.getElementById(cfg.targetId);
      const googleBtn = target && target.querySelector('button');
      if (googleBtn) {
        googleBtn.click();
      } else {
        window.open(cfg.url, '_blank', 'noopener,noreferrer');
      }
    });
  });
}

window.addEventListener('load', () => {
  ensureGoogleButtonsMounted();
  wireCardDelegation();
});
