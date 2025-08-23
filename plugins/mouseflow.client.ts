import { loadMouseflow } from '~/utils/loadMouseflow';

export default defineNuxtPlugin(() => {
  if (!import.meta.client) return;

  // Cookie-Consent (falls du später darauf umstellst)
  const consent = useCookie<{ analytics?: boolean }>('consent', {
    sameSite: 'lax',
    default: () => ({ analytics: false })
  });

  // Auch dein localStorage-Flag unterstützen
  const acceptedLocal = (() => {
    try { return !!localStorage.getItem('acceptedCookies'); } catch { return false; }
  })();

  // Beim App-Start laden, wenn schon zugestimmt wurde
  if (consent.value?.analytics || acceptedLocal) {
    loadMouseflow('5bf2a108-c106-46ee-b600-f6c8a082aa05');
  }

  // Spätere Zustimmung: auf globales Event reagieren
  window.addEventListener('consent:analytics-granted', () => {
    loadMouseflow('5bf2a108-c106-46ee-b600-f6c8a082aa05');
  });
});
