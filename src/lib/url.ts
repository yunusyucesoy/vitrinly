/**
 * GitHub Pages /vitrinly/ subpath için href/src prefix helper.
 * base = '/vitrinly/' (trailing slash dahil — import.meta.env.BASE_URL'den gelir)
 *
 * Kullanım:
 *   withBase('/kategoriler')         → '/vitrinly/kategoriler/'
 *   withBase('/urun/defne')          → '/vitrinly/urun/defne/'
 *   withBase('/models/chair.glb')    → '/vitrinly/models/chair.glb'
 *   withBase('https://...')          → 'https://...' (değişmez)
 *   withBase('mailto:...')           → 'mailto:...' (değişmez)
 *   withBase('#showroom')            → '#showroom' (değişmez)
 *   withBase('/iletisim#showroom')   → '/vitrinly/iletisim#showroom'
 */
export function withBase(path: string): string {
  if (!path) return path;

  // External / pseudo-protocols — dokunma
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:') ||
    path.startsWith('#') ||
    path.startsWith('//')
  ) {
    return path;
  }

  const base = import.meta.env.BASE_URL; // örn: '/vitrinly/'
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Trailing slash: pure route ise ekle, asset (.glb, .svg vs) veya hash içeriyorsa ekleme
  const hasExtension = /\.[a-z0-9]+$/i.test(cleanPath.split('#')[0].split('?')[0]);
  const hasHashOrQuery = cleanPath.includes('#') || cleanPath.includes('?');

  let result = `${base}${cleanPath}`;
  if (!hasExtension && !hasHashOrQuery && !result.endsWith('/')) {
    result += '/';
  }
  return result;
}
