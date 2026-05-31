# 3D Mobilya Katalog Sistemi — Proje Mimarisi ve Kararlar

## Proje Özeti

Mobilya firmaları için müşteri başına ayrı statik web sitesi sunan, 3D ürün görüntüleme ve sonraki fazda AR desteği içeren katalog platformu.

### Hedef Kullanım

- Her müşteri kendi subdomain'inde (`musteri.katalogum.com`)
- Giriş/kayıt yok — linke tıklayan herkes görüntüleyebilir
- Mobil öncelikli (%70+ mobil kullanım beklenir)
- 3G/4G'de 3 saniye altı ilk yükleme
- Faz 2'de AR desteği (iOS Quick Look + Android Scene Viewer)

---

## Teknoloji Yığını (Kararlaştırılmış)

| Katman | Teknoloji | Karar Sebebi |
|---|---|---|
| **SSG / Frontend** | Astro | Statik içerik için optimize, sıfır JS varsayılan, en hızlı yükleme |
| **Styling** | TailwindCSS | Hız, tutarlılık, küçük bundle |
| **3D Viewer** | `<model-viewer>` (Google) | AR built-in, ~50KB, Faz 2'ye sıfır kod değişikliği ile geçiş |
| **3D Format** | GLB (glTF 2.0 binary) | Web/AR standardı, tek dosya, mobile-friendly |
| **Sıkıştırma** | Draco + KTX2 | %70-90 boyut azaltma |
| **Hosting** | Cloudflare Pages (free tier) | Sınırsız bandwidth, global CDN, İstanbul edge, git push deploy |
| **3D Model Storage** | Cloudflare R2 (free tier) | Egress ücretsiz, S3 API uyumlu, 10GB free |
| **Domain Stratejisi** | Subdomain başına müşteri | `musteri.katalogum.com` — tek SSL, merkezi yönetim |
| **Versiyon Kontrolü** | Git + GitHub | Müşteri katalogları folder olarak |
| **Deploy** | Otomatik (git push → Cloudflare Pages) | Sıfır manuel adım |
| **3D Üretim** | Blender + Polycam + Meshy AI | Manuel + LiDAR tarama + AI üçlüsü |

**Tahmini maliyet:**
- İlk 6 ay (0-5 müşteri): 420-820 TL/ay (yazılım abonelikleri)
- 20+ müşteri: ~1.500 TL/ay

---

## Mimari Diyagramı

```
┌─────────────────────────────────────────────────────────────┐
│                    SON KULLANICI (TELEFON)                  │
│                                                             │
│   musteri.katalogum.com/urun/defne-koltuk                   │
│                          ↓                                  │
│   [HTML + <model-viewer>]  ──── (Faz 2) AR butonu           │
│                          ↓                                  │
│   GLB dosyası yüklenir  ←── iOS: Quick Look (USDZ)          │
│                              Android: Scene Viewer (GLB)    │
└─────────────────────────────────────────────────────────────┘
                          ↑ HTTPS, CDN cache
                          │
┌─────────────────────────────────────────────────────────────┐
│         CLOUDFLARE PAGES (HTML/CSS/JS)                      │
│         Astro build çıktısı, global CDN                     │
└─────────────────────────────────────────────────────────────┘
                          ↑
┌─────────────────────────────────────────────────────────────┐
│         CLOUDFLARE R2 (3D MODEL DOSYALARI)                  │
│   /modes-mobilya/defne-koltuk.glb                           │
│   /modes-mobilya/defne-koltuk-poster.webp                   │
└─────────────────────────────────────────────────────────────┘
                          ↑ git push
┌─────────────────────────────────────────────────────────────┐
│         GELİŞTİRİCİ MAKİNASI                                │
│   Astro projesi + müşteri config'leri (JSON)                │
└─────────────────────────────────────────────────────────────┘
```

---

## Müşteri Katalog Sayfa Yapısı

Her müşteri sitesi aynı şablondan üretilir. Sayfa hiyerarşisi:

```
musteri.katalogum.com/
│
├── /                           → Anasayfa (vitrin ürünleri + kategoriler)
├── /kategoriler                → Tüm kategoriler grid
├── /kategori/[slug]            → Kategori detay (o kategorideki ürünler)
├── /urun/[slug]                → Ürün detay (3D viewer)
├── /hakkimizda                 → Firma hakkında + showroom
└── /iletisim                   → İletişim + harita + WhatsApp
```

### Tasarım Prensibi: Her Ürünün Kendi URL'i Olmalı

Bu pazarlık edilemez bir karar:
- WhatsApp'ta link paylaşımı için
- Her ürün için ayrı QR kod basılacak (mağaza içi etiketler)
- Google'da her ürün ayrı indekslenir → organik trafik
- Satış ekibi belirli ürünü direkt gönderebilir

### Sayfa İçerikleri

**Anasayfa (`/`)**
- Hero: firma logosu + slogan + büyük görsel (opsiyonel: öne çıkan bir 3D ürün)
- **Vitrin ürünleri** (6-8 tane, manuel seçilmiş — müşterinin en iyi/pahalı ürünleri)
- Kategoriler grid (görsel ile)
- "Showroom'a gelin" CTA + harita preview
- WhatsApp floating buton (her sayfada sabit)

**Kategoriler (`/kategoriler`)**
- Tüm kategorilerin grid görünümü
- Her kategori kartında: görsel + ad + ürün sayısı

**Kategori detay (`/kategori/[slug]`)**
- Başlık + kısa kategori açıklaması (SEO için)
- Ürün grid (kart: poster image + ad + ölçü + "İncele")
- Filtreleme **Faz 1'de yok** — 50+ ürün olunca eklenir

**Ürün detay (`/urun/[slug]`)** — En önemli sayfa
- Üstte: 3D viewer (mobilde tam genişlik, ~70vh yükseklik)
- Altta: Ürün adı, ölçüler, açıklama, özellikler listesi, renk seçenekleri
- "WhatsApp'tan sor" + "Telefonla ara" butonları (büyük, mobil için)
- "Benzer ürünler" (3-4 öneri)
- Paylaş butonu (link kopyala + WhatsApp)

**Hakkımızda (`/hakkimizda`)**
- Firma hikayesi, kuruluş yılı
- Showroom fotoğrafları
- "Neden biz" (3-4 madde)

**İletişim (`/iletisim`)**
- Adres + Google Maps embed
- Telefon, WhatsApp, e-posta
- Çalışma saatleri
- Form yok — WhatsApp yeterli

### Faz 1'de Bilinçli Olarak YAPILMAYACAKLAR

- Sepet / favoriler (bu bir katalog, e-ticaret değil)
- Login / üyelik
- Yorumlar / puanlama
- Blog
- Çoklu dil
- Filtreleme (renk, fiyat aralığı)
- İletişim formu

---

## Proje Klasör Yapısı

```
katalog-projesi/
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
├── tsconfig.json
│
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro       # genel HTML iskeleti, model-viewer script
│   │   └── ProductLayout.astro    # ürün sayfası şablonu
│   │
│   ├── components/
│   │   ├── ProductCard.astro      # katalog grid kartı
│   │   ├── ProductViewer.astro    # 3D viewer wrapper
│   │   ├── CategoryNav.astro
│   │   └── ContactCTA.astro       # WhatsApp/telefon butonu
│   │
│   ├── pages/
│   │   └── [customer]/            # dinamik route — her müşteri ayrı
│   │       ├── index.astro
│   │       ├── kategori/[cat].astro
│   │       └── urun/[slug].astro
│   │
│   ├── data/
│   │   └── musteriler/
│   │       ├── modes-mobilya/
│   │       │   ├── config.json    # logo, renk, iletişim
│   │       │   ├── urunler.json   # ürün listesi + GLB linki
│   │       │   └── kategoriler.json
│   │       └── platin-mobilya/
│   │
│   └── styles/global.css
│
├── public/
│   ├── favicon.ico
│   └── shared/                    # ortak görseller, ikonlar
│
└── scripts/
    ├── optimize-glb.sh            # gltf-transform otomasyonu
    ├── generate-qr.js             # her ürün için QR PNG
    └── upload-to-r2.sh            # R2'ye otomatik yükleme
```

### urunler.json Örnek Yapı

```json
{
  "urunler": [
    {
      "slug": "defne-koltuk-takimi",
      "ad": "Defne Koltuk Takımı",
      "kategori": "oturma-grubu",
      "fiyat": null,
      "olculer": { "en": 230, "boy": 95, "yukseklik": 85 },
      "model_url": "https://cdn.katalogum.com/modes/defne.glb",
      "poster_url": "https://cdn.katalogum.com/modes/defne.webp",
      "aciklama": "Modern çizgili, kadife döşemeli L köşe koltuk takımı.",
      "ozellikler": ["Yataklı", "Sandıklı", "5 yıl garanti"],
      "renkler": ["Antrasit", "Bej", "Yeşil"]
    }
  ]
}
```

---

## 3D Viewer Kullanımı

### Faz 1 (Şimdi)

```html
<model-viewer
  src="koltuk.glb"
  camera-controls
  auto-rotate
  shadow-intensity="1"
  poster="koltuk-preview.webp"
  loading="lazy">
</model-viewer>
```

### Faz 2 (AR aktivasyonu — sadece 2 attribute ekleniyor)

```html
<model-viewer
  src="koltuk.glb"
  ar
  ar-modes="webxr scene-viewer quick-look"
  ar-scale="fixed"
  camera-controls
  auto-rotate
  shadow-intensity="1"
  poster="koltuk-preview.webp">
</model-viewer>
```

**Bu kadar.** Faz 1 mimarisi AR'a sıfır kod değişikliği ile geçiş garantiliyor.

---

## AR'a Hazırlık (Faz 1'de Yapılmalı)

Modelleme aşamasında bunlara dikkat edilirse Faz 2'de ek iş çıkmaz:

1. **Birim metre olmalı** — GLB'deki 1.0 birim = 1 metre. Blender varsayılan birimi metre, değiştirme.
2. **Pivot tabanda olmalı** — Modelin yerel orijini (0,0,0) tabanın ortasında. Blender: `Object → Set Origin → Origin to 3D Cursor`.
3. **+Y yukarı** — glTF standardı. Blender'da +Z kullanılır ama export sırasında otomatik çevrilir; doğru ayarı seç.
4. **Poster image hazırla** — 3D yüklenirken gösterilen WebP görsel. UX için kritik.

iOS Quick Look için USDZ formatı gerekli, ama `<model-viewer>` GLB'yi otomatik USDZ'ye çeviriyor — manuel USDZ üretmek zorunda değiliz.

---

## 3D Model Üretim Pipeline'ı

Tek doğru yöntem yok — ürüne göre üçü karıştırılacak:

| Yöntem | Süre | Kalite | Uygun Ürün |
|---|---|---|---|
| **Blender (manuel)** | 4-12 sa/ürün | En yüksek | Karmaşık, vitrin, oyma mobilya |
| **Polycam/Scaniverse (LiDAR)** | 45-60 dk/ürün | Orta-yüksek (gerçekçi) | Mat yüzeyli (kanepe, yatak, mat ahşap) |
| **Meshy AI / Tripo** | 5-10 dk/ürün | Orta | Sehpa, sandalye, dekoratif obje |

### 50 Ürünlük Katalog İçin Önerilen Karışım

| Ürün Tipi | Yöntem | Adet | Süre |
|---|---|---|---|
| Vitrin koltuklar | Blender manuel | 10 | 60 saat |
| Yatak, gardırop, modüler | Polycam LiDAR | 20 | 18 saat |
| Sehpa, sandalye, dekorasyon | Meshy AI + temizleme | 20 | 12 saat |
| **Toplam** | | **50** | **~90 saat** |

---

## Performans Standartları (Olmazsa Olmaz)

| Metrik | Hedef | Yöntem |
|---|---|---|
| GLB dosya boyutu | < 2 MB / ürün | Draco + KTX2 |
| İlk yükleme (4G) | < 3 saniye | Poster image first, lazy 3D |
| Lighthouse mobil skoru | > 90 | Astro varsayılan |
| Polygon sayısı | 50k-100k | Blender Decimate modifier |
| Texture çözünürlüğü | Max 2048×2048 | KTX2 ile sıkıştır |
| Time to Interactive | < 4 saniye | JS minimize |

### Optimizasyon Komutu

```bash
npm install -g @gltf-transform/cli
gltf-transform optimize input.glb output.glb \
  --texture-compress webp \
  --compress draco
```

Bu tek komut 12MB modeli 1.5MB'a düşürebilir.

---

## Uygulama Yol Haritası

### Hafta 1: Temel Kurulum
- [ ] Node.js v20+, Git, VS Code (Astro extension)
- [ ] `npm create astro@latest` ile proje
- [ ] TailwindCSS entegre
- [ ] `<model-viewer>` script BaseLayout'a
- [ ] Tek ürünlük test sayfası: GLB yükle, döndür/yakınlaştır çalışsın
- [ ] Cloudflare hesabı + R2 + Pages aktive
- [ ] Domain al (~150-300 TL/yıl)

### Hafta 2: Demo Katalog
- [ ] Blender'da 3-4 mobilya modelle (veya ücretsiz model indir)
- [ ] gltf-transform ile sıkıştır
- [ ] R2'ye yükle, public URL al
- [ ] 8-10 ürünlük demo müşteri kataloğu
- [ ] Anasayfa + kategori + ürün detay sayfaları
- [ ] `demo.katalogum.com` subdomain bağla

### Hafta 3: Cila
- [ ] Mobil responsive (Chrome DevTools)
- [ ] Lighthouse skoru ≥ 85 mobil
- [ ] WhatsApp "Bilgi alın" butonu
- [ ] QR kod generator script
- [ ] Tablette saha testi

### Hafta 4: İlk Müşteri Onboarding
- [ ] İlk müşteri bul (Kısıkköy turu)
- [ ] Pilot anlaşması
- [ ] Showroomda 15-20 ürün Polycam ile tara
- [ ] Modelleri optimize et + R2
- [ ] urunler.json + config.json doldur
- [ ] Subdomain bağla, müşteriye teslim

### Ay 2-3: Faz 2 Hazırlığı (AR)
- [ ] Modellerin metre cinsinden ölçek doğrulaması
- [ ] Pivot noktaları taban-orta kontrolü
- [ ] iPhone Quick Look testi (gerçek cihaz)
- [ ] Android Scene Viewer testi
- [ ] AR onboarding UX ("telefonu kaldır, yere doğru tut")

### Ay 3+: Faz 2 Aktivasyonu
- [ ] AR butonu UI tasarımı
- [ ] Mağaza içi QR broşür/etiket
- [ ] AR analytics (kaç kişi AR ile baktı)
- [ ] Pazarlama mesajı: "evimde gör"

---

## Çalışma Prensipleri

1. **Şu anda olmayan problemi çözme.** Veritabanı, CMS, login — bugün yok, gerektiğinde eklenir.
2. **Statik > Dinamik (mümkünse).** CDN cache'lenebilen sayfa, dinamikten 10x hızlı.
3. **Build time > Runtime.** İşi build sırasında yap, kullanıcının tarayıcısında değil.
4. **AR'ı baştan düşün, Faz 2'de aktive et.** model-viewer + doğru ölçekleme dışında ek iş yok.
5. **Mobil önce, desktop sonra.** %70 trafik telefondan.
6. **Yeni müşteri bulmak > Platformu mükemmelleştirmek.** Satışa zaman ayır.

---

## Faz 3+ Olası Geliştirmeler (Şu an kapsam dışı)

- Renk/kumaş canlı değiştirme
- Modüler ürün kombinasyonu (konfigüratör — burada Three.js/R3F devreye girebilir)
- Birden fazla ürünü aynı sahnede görüntüleme
- AI destekli oda dekorasyon önerileri

---

*Bu doküman canlıdır — gerçek müşteri geri bildirimi alındıkça revize edilecek.*
