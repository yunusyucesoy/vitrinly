/**
 * Hafif toast bildirimi — tüm sayfalardan çağrılabilir.
 * brand-guide stiline uygun: surface bg, primary text, ambient shadow.
 */

let timeoutId: number | null = null;

export function showToast(message: string, duration = 2400): void {
  // Mevcut toast varsa kaldır
  document.querySelectorAll('[data-toast]').forEach((n) => n.remove());
  if (timeoutId) window.clearTimeout(timeoutId);

  const el = document.createElement('div');
  el.dataset.toast = 'true';
  el.className =
    'fixed left-1/2 -translate-x-1/2 bottom-28 md:bottom-10 z-50 bg-primary text-on-primary px-5 py-3 rounded-full text-[13px] font-bold tracking-wide shadow-2xl';
  el.style.opacity = '0';
  el.style.transform = 'translate(-50%, 12px)';
  el.style.transition = 'opacity .25s, transform .25s';
  el.textContent = message;

  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translate(-50%, 0)';
  });

  timeoutId = window.setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translate(-50%, 12px)';
    window.setTimeout(() => el.remove(), 250);
  }, duration);
}

// Global olarak da erişilebilir olsun (inline script'lerden çağrılır)
declare global {
  interface Window {
    __toast: typeof showToast;
  }
}
window.__toast = showToast;
