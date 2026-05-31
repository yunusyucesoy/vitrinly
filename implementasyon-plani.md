# Vitrinly — Uygulama Planı

> Bu plan; [`proje-mimarisi.md`](proje-mimarisi.md) kararlarını, [`tasarimlar/brand-guide/DESIGN.md`](tasarimlar/brand-guide/DESIGN.md) tasarım sistemini ve `tasarimlar/` altındaki 7 HTML mock-up'ın yapısal parmak izini referans alır.

---

## 0. Plan Felsefesi

- **Önce site, sonra 3D.** Faz 1–5'te tüm sayfalar mock data (placeholder GLB + Unsplash/aida-public görseller) ile bitirilecek. 3D model üretimi Faz 6'da başlar.
- **AR'a sıfır kod değişikliği ile geçiş** prensibi korunur — `<model-viewer>`'a Faz 1'de `ar` attribute'ları konmaz, tüm AR placeholder UX (`brand-guide/DESIGN.md` "AR Placeholder" bölümü) hazırlanır.
- **Build time > Runtime.** Tüm ürün sayfaları SSG. Hiçbir runtime fetch yok.
- Her faz sonunda `Lighthouse mobil ≥ 90` ve `İlk paint < 1.5s 4G` (proje-mimarisi.md, "Performans Standartları") doğrulanır.

---

## Faz 1 — İskelet ve Tasarım Sistemi (3 gün)

**Hedef:** Astro projesi ayakta, tasarım tokenları ve global atmosfer (kağıt grain, fontlar, motion) brand-guide ile birebir eşleşiyor. Sayfa yok, sadece "tek bir bileşen şu HTML mock'a benziyor" denecek hazırlık.

### 1.1 Proje kurulumu
- `npm create astro@latest vitrinly` (Empty template, TypeScript strict)
- Bağımlılıklar: `@astrojs/tailwind`, `@astrojs/sitemap`, `tailwindcss`, `astro-icon`
- `astro.config.mjs` → site URL, sitemap entegrasyonu, `output: 'static'`
- TypeScript path alias'ları: `@components/*`, `@layouts/*`, `@data/*`, `@lib/*`

**Ref:** `proje-mimarisi.md` "Proje Klasör Yapısı" (satır 144-188)

### 1.2 Tasarım token'ları
- `tailwind.config.mjs` içinde tüm renk paletini (`brand-guide/DESIGN.md` frontmatter — surface, primary, secondary, tertiary, error, whatsapp, vb.) tek kaynak haline getir.
- `fontFamily.display = ['"EB Garamond"', 'serif']`, `fontFamily.body = ['"DM Sans"', 'sans-serif']`
- Custom utilities:
  - `.ambient` ve `.ambient-hero` (box-shadow değerleri brand-guide "Ambient Shadow Token" satır 218-219)
  - `.no-scrollbar`
  - `.reveal`, `.d1`–`.d4` (fadeUp animasyon + stagger; `anasayfa-desktop/code.html` satır 26-28)

### 1.3 Global CSS (`src/styles/global.css`)
- Paper grain background (brand-guide satır 215-216, iki katmanlı `radial-gradient`)
- `model-viewer` global stilleri (warm gradient bg)
- Material Symbols variation settings
- Marquee / pulse-ring / shimmer keyframe'leri (brand-guide "Atmosphere & Texture" satır 213-228)

### 1.4 `BaseLayout.astro`
- `<head>`: theme-color, preconnect fonts.googleapis + fonts.gstatic, DM Sans + EB Garamond + Material Symbols
- **Önemli:** `<model-viewer>` script tag'i `defer` ile yüklenir ama yalnızca ürün sayfalarındaki layout'larda — site genelinde değil (brand-guide "Performance Budget" satır 313-318)
- `<slot />` body
- `<Footer />`, `<WhatsAppFAB />` slotları
- QR ribbon mount noktası (`?ref=qr` JS — sadece body'e küçük inline script)

**Çıktı kontrolü:** Boş bir test sayfası açıldığında — yazı tipleri yüklenmiş, kağıt grain görünüyor, sayfa rengi `#fbf9f7`. Lighthouse > 95 (sayfa boş zaten).

---

## Faz 2 — Veri Modelleri ve Mock Dataset (1 gün)

**Hedef:** Tüm sayfaları besleyecek JSON şeması netleşir, "Atelier Anatolia" demo müşterisi için zengin mock data yazılır.

### 2.1 TypeScript şemaları (`src/lib/schema.ts`)
Mock'lardan çıkarılan alanlar:

```ts
export interface CustomerConfig {
  slug: string;              // "atelier-anatolia"
  brand: { name: string; tagline: string; logoMark?: string; foundedYear: number };
  contact: { phone: string; whatsapp: string; email: string };
  locations: ShowroomLocation[];   // showroom + atölye (iletisim sayfası)
  social: SocialLink[];
  story: { dropcapText: string; paragraphs: string[] };
  stats: { label: string; value: string }[];          // 32 yıl, 1200 mutlu ev...
  principles: { icon: string; title: string; body: string }[];
  timeline: { year: string; title: string; body: string }[];
  atelierPhotos: string[];
}

export interface Category {
  slug: string; name: string; description: string;
  heroImage: string; productCount?: number;
  artisanQuote?: { name: string; role: string; quote: string; portrait: string };
}

export interface Product {
  slug: string;
  name: string;                   // "Defne Koltuk Takımı"
  italicWord?: string;            // mixed-style heading için (brand-guide satır 234)
  category: string;               // category slug
  dimensions: { w: number; d: number; h: number };
  priceNote: string;              // "Fiyat için iletişim" (italic)
  deliveryTime?: string;
  modelUrl: string | null;        // GLB; Faz 1–5'te null veya placeholder
  posterUrl: string;
  galleryImages?: string[];
  description: { dropcap: string; rest: string };
  features: string[];             // chips
  fabrics: { slug: string; name: string; hex: string }[];
  specs: {
    technical: KV[]; care: KV[]; shipping: KV[];
  };
  artisan?: { name: string; role: string; quote: string };
  similarSlugs: string[];
  isFeatured?: boolean;           // vitrin sayfası için
  isNew?: boolean;
  sketchSvg?: string;             // ölçü kroki SVG path verisi (opsiyonel)
}
```

### 2.2 Mock data (`src/data/musteriler/atelier-anatolia/`)
- `config.json` — `CustomerConfig`
- `kategoriler.json` — 6 kategori: Oturma Grubu, Yatak Odası, Yemek Odası, Çalışma, Aksesuar, Özel Üretim
- `urunler.json` — **24 ürün** (kategori detay sayfasında 9/24 görünür)
  - 4'ü featured (anasayfa vitrin grid)
  - Her ürün için 3-4 kumaş varyantı (`urun-detay-mobile`'daki swatch yapısı)
  - Görseller: mock dataset'te aida-public URL'lerini kullanmak yerine yerel `public/mock/{slug}.webp` veya Unsplash kalıcı CDN linkleri (production'a kadar)

### 2.3 Veri erişim katmanı (`src/lib/data.ts`)
- `getCustomer(slug)`, `getProducts(customer)`, `getProduct(customer, slug)`, `getCategory(customer, slug)`, `getSimilar(product, count)`
- Astro build sırasında çalışacak — runtime'da değil.

**Çıktı kontrolü:** Mini bir debug sayfası (`/_debug/data`) tüm JSON'u render eder, eksik alan kalmaz.

---

## Faz 3 — Atomik Bileşenler (3 gün)

**Hedef:** Her sayfaya gidecek 15-20 yeniden kullanılır bileşen, Storybook benzeri bir gallery sayfasında doğrulanır.

### 3.1 Sıralı geliştirme listesi

| Bileşen | Hangi sayfalardan çıkarıldı | Notlar |
|---|---|---|
| `Header.astro` (desktop + mobile variant) | Tüm sayfalar | Sticky, backdrop-blur. Active link `nav-link::after` underline (anasayfa-desktop satır 34-36) |
| `Footer.astro` | Tüm sayfalar | Primary bg, 4 kolon |
| `EyebrowLabel.astro` | Her major heading | brand-guide "Editorial Eyebrow Label" satır 239-241 |
| `DisplayHeading.astro` | Her hero | Mixed-style italic word desteği (`name="Defne" italicWord="Koltuk Takımı"`) |
| `Button.astro` | Her sayfa | Variants: `primary-pill`, `secondary`, `icon-circle`, `ghost-underline`, `whatsapp` |
| `ProductCard.astro` | Anasayfa, kategori detay | 3D rozeti, hover-image-scale (`.card-img`), kategori sayfasındaki "featured" boyut variant |
| `CategoryCard.astro` | Anasayfa, kategoriler | Tam-bleed image + gradient overlay |
| `Marquee.astro` | Anasayfa | Slogan + `✦` separator, 35s mobile / 45s desktop (brand-guide satır 226-228) |
| `WhatsAppFAB.astro` | Tüm sayfalar | `env(safe-area-inset-bottom)`, pulse ring (brand-guide satır 222-224) |
| `WhatsAppCTAStrip.astro` | Kategori detay, ürün detay | Tam genişlik şerit |
| `StickyActionBar.astro` | Ürün detay mobile | brand-guide "Sticky Bottom Action Bar" satır 248-250 |
| `FabricSwatch.astro` + `FabricSwatchGroup.astro` | Ürün detay | Inset shadow, double-ring active, URL state'i `?renk=` (brand-guide satır 198-203) — **client-side JS şart** |
| `ProductViewer.astro` | Ürün detay | Üç state (poster, skeleton, live) — brand-guide satır 186-194; `<slot name="ar-button">` ile AR placeholder |
| `ARPlaceholder.astro` | Ürün detay | Dashed border + "YAKINDA" chip + toast (brand-guide satır 195-196) |
| `DimensionSketch.astro` | Ürün detay | Inline SVG (handdrawn-feel) |
| `CollapsibleSpec.astro` | Ürün detay | Native `<details>` + custom summary (brand-guide satır 257-259) |
| `ArtisanQuote.astro` | Kategori detay, hakkımızda, ürün detay | Portrait + quote |
| `QRArrivalRibbon.astro` | Tüm sayfalar (conditional) | `?ref=qr` (brand-guide satır 284-286) |
| `Timeline.astro` | Hakkımızda | 4 nokta |
| `MapPin.astro` | İletişim, anasayfa | Pulse animation (`animate-ping` zaten Tailwind'de var) |
| `HorizontalScroller.astro` | Mobil — similar products, atölye photos, filter chips | `snap-x snap-mandatory`, kart genişliği 65-70vw cap 290px (brand-guide satır 252-254) |

### 3.2 Client-side JS modülleri (`src/scripts/`)
Astro `client:load` directive ile değil — hafifliği korumak için **vanilla `<script>` blokları**:

- `qr-ribbon.ts` — `URLSearchParams` okur, ribbon mount eder
- `share.ts` — `navigator.share()` + clipboard fallback + toast (brand-guide satır 291-293)
- `toast.ts` — Tek modül, tüm sayfalar
- `fabric-swatch.ts` — Click handler, `history.replaceState`, WA deep-link regenerator, model-viewer material mutator (varsa)
- `product-viewer.ts` — Poster → skeleton → live state machine, `model-viewer` script'ini ilk tap'te lazy import eder

**Çıktı kontrolü:** `/_debug/components` sayfası tüm bileşenleri her variant ile listeler.

---

## Faz 4 — Sayfaları Birleştirme (4 gün)

**Hedef:** Dinamik route'lar + tüm 7 sayfayı mock data ile tam çalışır şekilde üret.

### 4.1 Astro route haritası

```
src/pages/
├── index.astro                              → Anasayfa
├── kategoriler/index.astro                  → Kategoriler grid
├── kategori/[slug].astro                    → Kategori detay (getStaticPaths)
├── urun/[slug].astro                        → Ürün detay (getStaticPaths)
├── hakkimizda.astro
└── iletisim.astro
```

> Not: `proje-mimarisi.md` (satır 165) `[customer]` segment'i öneriyor. Faz 1–5'te tek müşteri (`atelier-anatolia`) var ve subdomain stratejisi kullanılıyor (`atelier.katalogum.com`), yani path'te `[customer]` yok — onun yerine `astro.config.mjs`'te env değişkeni `CUSTOMER_SLUG` ile build'lere müşteri verilir. Çok-müşteri yapısı Faz 7'de ele alınacak.

### 4.2 Sayfa-by-sayfa mapping

| Sayfa | Mock referansı | Beslenecek data | Özel davranış |
|---|---|---|---|
| Anasayfa (responsive) | `anasayfa-desktop/code.html` + `anasayfa-mobile/code.html` | config, featured products (4), categories (3), showroom | Marquee, AR teaser bandı, showroom map preview |
| Kategoriler | `kategoriler/code.html` | tüm kategoriler + filter chips listesi (statik) | Asymmetric grid (1 large feat + 4 smaller), inline "özel üretim" kartı |
| Kategori detay | `kategori-detay/code.html` | category + ait ürünler (`getProducts().filter(p => p.category === slug)`) | Sticky filter bar, "Load more" 9/24 (Faz 1'de yalnız UI, gerçek paging yok — proje-mimarisi.md satır 112), inline artisan story kartı |
| Ürün detay (responsive) | `urun-detay-mobile/code.html` + `urun-detay-desktop/code.html` | product + similar products | **Tek bir route, iki layout breakpoint**. Sticky bottom bar mobil-only. `<ProductViewer>` üç state. Swatch URL state. WA deep-link her swatch'ta regenerate edilir |
| Hakkımızda | `hakkimizda/code.html` | config.story, stats, principles, timeline, atelierPhotos | Dropcap, reveal animasyonları |
| İletişim | `iletisim/code.html` | locations (2 adet: showroom + atölye), contact | Map pin pulse, 3 CTA kartı |

### 4.3 Anchor SEO + meta
- Her ürün sayfası: dynamic `<title>`, `description`, OpenGraph image (`poster_url`), JSON-LD `Product` schema
- `proje-mimarisi.md` satır 89-93: her ürünün kendi URL'i + Google indekslemesi şart.
- `astro-sitemap` build'de tüm `/urun/*` ve `/kategori/*` rotalarını üretir.

### 4.4 Performans guardrail'leri (build sonrası check)
- Ana CSS bundle < 30 KB (gzipped)
- Sayfa başına JS < 8 KB (sadece toast + share + qr-ribbon)
- Ürün sayfasında `<model-viewer>` script'i (~50KB) **sadece kullanıcı poster'a tıklayınca** dynamic import edilir.
- Hero image `fetchpriority="high"`, geri kalan görseller `loading="lazy"` (brand-guide satır 313-318).

**Çıktı kontrolü:** `npm run build && npm run preview` → Chrome DevTools Lighthouse mobil 4G simülasyonu ≥ 90.

---

## Faz 5 — Polish, Cila, Erişilebilirlik (2 gün)

**Hedef:** İlk müşteriye gösterilebilir, gerçek mobil cihazda test edilmiş, "boş" hissi olmayan bir site.

### 5.1 Erişilebilirlik
- Her interaktif element 48px min touch target (brand-guide satır 100)
- Focus ring'leri (focus-visible) primary renkte
- Tüm `<img>` alt-text
- Heading hiyerarşisi tutarlı (`h1` sayfa başı, `h2` section, `h3` kart)
- `<model-viewer>` için `aria-label="3D model: {productName}"`

### 5.2 Türkçe karakter ve copy
- EB Garamond + DM Sans Türkçe glyph kontrolü (ğ ı ş ç vb. — özellikle EB Garamond italic) — brand-guide satır 124-128
- Ürün adlarında shy hyphen yerleştirmesi (uzun ürün adları kart genişliğini taşırmasın)

### 5.3 Reveal & motion stress test
- Mobilde `prefers-reduced-motion` respect edilir → fadeUp + marquee + pulse-ring durur (`@media (prefers-reduced-motion: reduce)` guard)
- Marquee, mobile Safari'de gerçekten 35s'de bir döngü tamamlıyor mu?

### 5.4 Şüpheli senaryolar
- Tek kumaşlı ürün → swatch group gizlenir
- Modelı olmayan ürün (`modelUrl: null`) → 3D badge gizlenir, viewer fallback gallery'e döner
- 9'dan az ürünlü kategori → "Load more" gizlenir
- `?ref=qr` ile gelmiş ama session sonrası tekrar gelen kullanıcı → ribbon ilk yüklemede gösterilir, sonra sessionStorage'a flag düşer

**Çıktı kontrolü:** Gerçek iPhone + Android cihazda 3 sayfayı tıkla; safe-area, sticky bar, FAB pulse, swatch URL paylaşımı çalışmalı.

---

## Faz 6 — 3D Model Üretim Pipeline'ı (sürekli)

Site bittikten sonra, mock GLB'leri gerçek modellerle değiştirme süreci.

### 6.1 Pipeline kararları
Üç yöntem (`proje-mimarisi.md` satır 260-277):

| Yöntem | Yazılım | Hedef ürün tipi | Adet (24 ürün için) |
|---|---|---|---|
| Blender manuel | Blender 4.x | Vitrin koltuk + 2 öne çıkan masa | 5 |
| Polycam/Scaniverse LiDAR | iPhone + Polycam Pro | Yatak, gardırop, koltuk, dolap | 12 |
| Meshy AI / Tripo | Meshy.ai | Sehpa, sandalye, dekoratif obje | 7 |

### 6.2 AR-uyum checklist (her model için)
- [ ] Birim metre (Blender default — `proje-mimarisi.md` satır 251)
- [ ] Pivot taban-orta (satır 252)
- [ ] +Y up gltf export (satır 253)
- [ ] Texture max 2048×2048 (satır 289)
- [ ] Polygon 50k–100k arası (Decimate modifier) (satır 288)
- [ ] Poster WebP üretimi (1200×1500, ~150KB)

### 6.3 Optimizasyon
```bash
gltf-transform optimize input.glb output.glb \
  --texture-compress webp \
  --compress draco
```
Hedef: **< 2 MB / GLB** (`proje-mimarisi.md` satır 285). `scripts/optimize-glb.sh` toplu işlem için.

### 6.4 Hosting
- Cloudflare R2 bucket `vitrinly-models`
- Klasör: `/atelier-anatolia/{slug}.glb`, `/atelier-anatolia/{slug}-poster.webp`
- Public bucket + cache header `public, max-age=31536000, immutable`
- `scripts/upload-to-r2.sh` ile toplu yükleme
- `urunler.json` içindeki `modelUrl`/`posterUrl` R2 URL'lerine güncellenir

### 6.5 Kalite kapısı
Her model R2'ye yüklendikten sonra:
- Gerçek mobil cihazda yükleme süresi < 3 saniye (3G throttle)
- Döndürme/yakınlaştırma 60fps
- Poster vs. live model arasında sıçrama yok (boyut + camera frame eşleşmesi)

---

## Faz 7 — Faz 2: AR Aktivasyonu (Ay 2-3) — Hazır ama beklemede

`proje-mimarisi.md` satır 229-242:

```html
<!-- Faz 1 viewer (şimdi) -->
<model-viewer src="..." camera-controls auto-rotate poster="...">

<!-- Faz 2 — sadece 3 attribute ekle -->
<model-viewer src="..." ar ar-modes="webxr scene-viewer quick-look" ar-scale="fixed" ...>
```

Yapılacaklar:
1. `ProductViewer.astro` props'una `enableAR: boolean` (default false) ekle
2. `ARPlaceholder.astro` → `ARButton.astro`'ya geçiş, `<button slot="ar-button">` slot-replace
3. iOS Quick Look testi (gerçek cihaz) + Android Scene Viewer testi (`proje-mimarisi.md` satır 343-348)
4. AR analytics event'i (`gtag` veya plausible)
5. Mağaza içi QR etiket basımı (`scripts/generate-qr.js`)

---

## Faz 8 — Çok Müşterili Sürüm (Sonraki müşteri geldiğinde) — Mimari Halihazırda Hazır

İlk pilot müşteri (Kısıkköy turu, `proje-mimarisi.md` satır 331-336) sonrası ikinci müşteri geldiğinde:

1. `src/data/musteriler/{yeni-musteri}/` klasörü ekle
2. Cloudflare Pages'te ikinci proje (aynı repo, farklı build env: `CUSTOMER_SLUG=yeni-musteri`)
3. Subdomain bağla
4. **Hiçbir kod değişikliği yok.**

---

## Riskler ve Karar Defteri

| Risk | Önlem |
|---|---|
| EB Garamond italic Türkçe karakter eksiği | Font dosyasını subset etmek; fallback: `Crimson Pro italic` |
| `<model-viewer>` 3.5.0 future-AR breaking change | Versiyon pinli (`@google/model-viewer@3.5.0`), update plan'lı |
| R2 free tier 10GB aşımı | 24 ürün × 2MB = 48MB — çok rahat. Müşteri 5 → 10 → 20 ölçeklendikçe takip |
| Mock data ile gerçek müşteri datası şema farkı | Faz 4 sonunda şema dondurulur, real customer onboarding aynı şemaya yazar |
| Lighthouse skoru 90 altı | Hero image boyutu + font display swap + critical CSS inline (Astro otomatik) |

---

## Özet Zaman Çizelgesi

| Faz | Süre | Çıktı |
|---|---|---|
| 1 — İskelet + tasarım sistemi | 3 gün | Boş test sayfası brand-guide ile bire-bir |
| 2 — Veri modelleri + mock | 1 gün | 24 ürünlük zengin JSON |
| 3 — Atomik bileşenler | 3 gün | `/_debug/components` gallery |
| 4 — Sayfa birleştirme | 4 gün | 7 sayfa tam çalışır |
| 5 — Polish + a11y | 2 gün | Gerçek cihaz onayı |
| **Faz 1–5 toplam** | **~13 gün** | **Demo-hazır site** |
| 6 — 3D üretim | Sürekli (90 saat) | 24 gerçek GLB |
| 7 — AR aktivasyon | 1-2 gün | Faz 2 canlı |

---

*Bu doküman canlıdır — uygulama sırasında karar değişikliklerinde revize edilecek.*
