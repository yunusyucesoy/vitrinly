/**
 * brand-guide "Native Share with Fallback"
 * data-share-button attribute olan tüm butonlar paylaşımı tetikler.
 * data-share-title ile başlık geçilir; URL her zaman location.href.
 */
import './toast';

function attach(button: HTMLElement) {
  button.addEventListener('click', async (e) => {
    e.preventDefault();
    const title = button.dataset.shareTitle ?? document.title;
    const url = location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled — sessizce devam
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      window.__toast?.('Bağlantı kopyalandı');
    } catch {
      window.__toast?.('Paylaşım başarısız');
    }
  });
}

document.querySelectorAll<HTMLElement>('[data-share-button]').forEach(attach);
