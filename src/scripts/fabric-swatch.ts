/**
 * brand-guide "Fabric / Color Swatches"
 * Click → URL state (?renk=slug), WhatsApp deep-link regenerate,
 * model-viewer material baseColorFactor update (varsa).
 *
 * Markup contract:
 *   <div data-swatch-group
 *        data-wa-base="https://wa.me/...?text=..."
 *        data-wa-name="Defne Koltuk Takımı">
 *     <button data-swatch data-slug="kum-keten" data-name="Kum Keten"
 *             data-rgb="0.847,0.788,0.714"
 *             aria-pressed="true|false">...</button>
 *   </div>
 *
 *   <a data-wa-link href="..."> ← güncellenecek tüm WhatsApp linkler
 *   <model-viewer id="product-viewer"> ← varsa renk uygulanır
 */
import './toast';

type ModelViewerElement = HTMLElement & {
  model?: {
    materials: Array<{
      pbrMetallicRoughness: {
        setBaseColorFactor: (rgba: [number, number, number, number]) => void;
      };
    }>;
  };
};

function updateWALinks(productName: string, fabricName: string) {
  const links = document.querySelectorAll<HTMLAnchorElement>('[data-wa-link]');
  links.forEach((a) => {
    const url = new URL(a.href);
    const text = `${productName} hakkında bilgi almak istiyorum (${fabricName})`;
    url.searchParams.set('text', text);
    a.href = url.toString();
  });
}

function applyToModelViewer(rgb: [number, number, number]) {
  const viewer = document.querySelector<ModelViewerElement>('#product-viewer');
  if (!viewer?.model?.materials?.length) return;
  try {
    viewer.model.materials[0].pbrMetallicRoughness.setBaseColorFactor([
      rgb[0],
      rgb[1],
      rgb[2],
      1,
    ]);
  } catch (e) {
    console.warn('[swatch] model-viewer renk uygulanamadı', e);
  }
}

function selectSwatch(group: HTMLElement, button: HTMLElement) {
  const slug = button.dataset.slug;
  const name = button.dataset.name;
  if (!slug || !name) return;

  // Diğer aktif swatch'ları temizle
  group.querySelectorAll<HTMLElement>('[data-swatch]').forEach((b) => {
    b.setAttribute('aria-pressed', b === button ? 'true' : 'false');
  });

  // URL state
  const params = new URLSearchParams(location.search);
  params.set('renk', slug);
  history.replaceState(null, '', `${location.pathname}?${params.toString()}`);

  // WhatsApp linkleri güncelle
  const productName = group.dataset.waName ?? '';
  if (productName) updateWALinks(productName, name);

  // Model viewer renk
  const rgbStr = button.dataset.rgb;
  if (rgbStr) {
    const rgb = rgbStr.split(',').map(Number) as [number, number, number];
    if (rgb.length === 3 && rgb.every((n) => !isNaN(n))) {
      applyToModelViewer(rgb);
    }
  }
}

function initGroup(group: HTMLElement) {
  const buttons = group.querySelectorAll<HTMLElement>('[data-swatch]');

  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      selectSwatch(group, btn);
    });
  });

  // URL'den ilk durumu yükle
  const initialSlug = new URLSearchParams(location.search).get('renk');
  if (initialSlug) {
    const target = group.querySelector<HTMLElement>(`[data-swatch][data-slug="${initialSlug}"]`);
    if (target) selectSwatch(group, target);
  }
}

document.querySelectorAll<HTMLElement>('[data-swatch-group]').forEach(initGroup);
