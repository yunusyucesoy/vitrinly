/**
 * ProductViewer state yönetimi + AR aktivasyonu (Faz 7).
 *
 * Markup contract:
 *   <div data-product-viewer
 *        data-model-url="..."
 *        data-poster-url="...">
 *     <div data-state="poster">...</div>
 *     <div data-state="skeleton" hidden>...</div>
 *     <div data-state="live" hidden>
 *       <div data-mv-slot></div>
 *     </div>
 *     <button data-load-3d>360°</button>
 *     <button data-ar-placeholder>Evimde gör</button>
 *   </div>
 */
import './toast';

type MVElement = HTMLElement & {
  loaded?: boolean;
  canActivateAR?: boolean;
  activateAR?: () => Promise<void>;
  resetTurntableRotation?: () => void;
};

let modelViewerScriptLoaded = false;

function loadModelViewerScript(): Promise<void> {
  if (modelViewerScriptLoaded) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-model-viewer-script]');
    if (existing) {
      modelViewerScriptLoaded = true;
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.type = 'module';
    s.src = 'https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js';
    s.dataset.modelViewerScript = 'true';
    s.onload = () => {
      modelViewerScriptLoaded = true;
      resolve();
    };
    s.onerror = () => reject(new Error('model-viewer yüklenemedi'));
    document.head.appendChild(s);
  });
}

function show(root: HTMLElement, state: 'poster' | 'skeleton' | 'live') {
  root.querySelectorAll<HTMLElement>('[data-state]').forEach((el) => {
    el.hidden = el.dataset.state !== state;
  });
}

/**
 * Modeli mount eder ve `load` event'ini bekler.
 * Aynı root için ikinci kez çağrılırsa mevcut modeli döndürür.
 */
function mountModel(root: HTMLElement): Promise<MVElement | null> {
  const existing = root.querySelector<MVElement>('#product-viewer');
  if (existing) {
    if (existing.dataset.loaded === 'true') return Promise.resolve(existing);
    // Yüklenme devam ediyor — bekle
    return new Promise((resolve) => {
      existing.addEventListener('load', () => resolve(existing), { once: true });
      existing.addEventListener('error', () => resolve(null), { once: true });
    });
  }

  const modelUrl = root.dataset.modelUrl;
  const posterUrl = root.dataset.posterUrl;

  if (!modelUrl) {
    window.__toast?.('3D model yakında eklenecek');
    return Promise.resolve(null);
  }

  show(root, 'skeleton');

  return loadModelViewerScript()
    .catch(() => {
      window.__toast?.('3D yüklenemedi — bağlantınızı kontrol edin');
      show(root, 'poster');
      return Promise.reject();
    })
    .then(() => {
      const slot = root.querySelector<HTMLElement>('[data-mv-slot]');
      if (!slot) return null;

      const mv = document.createElement('model-viewer') as MVElement;
      mv.id = 'product-viewer';
      mv.setAttribute('src', modelUrl);
      if (posterUrl) mv.setAttribute('poster', posterUrl);

      // Kamera kontrolleri
      mv.setAttribute('camera-controls', '');
      mv.setAttribute('disable-pan', '');
      mv.setAttribute('max-camera-orbit', 'auto 90deg auto');
      mv.setAttribute('auto-rotate', '');
      mv.setAttribute('auto-rotate-delay', '4000');

      // Görsel kalite
      mv.setAttribute('shadow-intensity', '1');
      mv.setAttribute('exposure', '1');
      mv.setAttribute('loading', 'eager');

      // AR — Faz 7
      mv.setAttribute('ar', '');
      mv.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
      // Modeller gercek metre cinsinden — kullanici yeniden boyutlandiramaz
      mv.setAttribute('ar-scale', 'fixed');
      mv.setAttribute('ar-placement', 'floor');

      mv.setAttribute('aria-label', `3D model: ${root.dataset.productName ?? ''}`);
      mv.style.width = '100%';
      mv.style.height = '100%';

      let settled = false;
      const settle = (toState: 'live' | 'poster', result: MVElement | null) => {
        if (settled) return null;
        settled = true;
        show(root, toState);
        return result;
      };

      return new Promise<MVElement | null>((resolve) => {
        mv.addEventListener('load', () => {
          mv.dataset.loaded = 'true';
          settle('live', mv);
          resolve(mv);
        }, { once: true });

        mv.addEventListener('error', () => {
          window.__toast?.('Model yüklenemedi');
          settle('poster', null);
          resolve(null);
        }, { once: true });

        // 30 sn fallback
        setTimeout(() => {
          if (!settled) {
            settle('live', mv);
            resolve(mv);
          }
        }, 30000);

        slot.replaceChildren(mv);
      });
    })
    .catch(() => null);
}

/**
 * AR'ı tetikler. Gerekirse önce modeli yükler.
 */
async function activateAR(root: HTMLElement) {
  const mv = await mountModel(root);
  if (!mv) return;

  // Model yüklendi mi son kez kontrol
  if (mv.dataset.loaded !== 'true') {
    window.__toast?.('Model henüz hazır değil, biraz sonra deneyin');
    return;
  }

  if (!mv.canActivateAR) {
    window.__toast?.('AR sadece mobil cihazlarda · telefondan açın');
    return;
  }

  try {
    await mv.activateAR?.();
  } catch (e) {
    window.__toast?.('AR başlatılamadı');
    console.warn('[AR]', e);
  }
}

function init(root: HTMLElement) {
  // 360° butonu — sadece modeli yükler
  root.querySelector<HTMLButtonElement>('[data-load-3d]')?.addEventListener('click', (e) => {
    e.preventDefault();
    mountModel(root);
  });

  // AR butonu — Faz 7'de gerçek AR'a bağlandı
  root.querySelectorAll<HTMLElement>('[data-ar-placeholder]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      activateAR(root);
    });
  });

  // Control: turntable reset
  root.querySelector<HTMLElement>('[data-control-reset]')?.addEventListener('click', () => {
    const mv = root.querySelector<MVElement>('#product-viewer');
    mv?.resetTurntableRotation?.();
  });

  // Control: fullscreen
  root.querySelector<HTMLElement>('[data-control-fullscreen]')?.addEventListener('click', () => {
    const mv = root.querySelector('#product-viewer');
    if (mv && 'requestFullscreen' in mv) {
      (mv as HTMLElement).requestFullscreen().catch(() => {
        window.__toast?.('Tam ekran desteklenmiyor');
      });
    }
  });
}

document.querySelectorAll<HTMLElement>('[data-product-viewer]').forEach(init);
