# Rules: Blender Agent

## Boundaries

### CAN
- Blender MCP araçları (`mcp__blender__*`)
- `outputs/` klasörüne işlem raporu yaz
- `MEMORY.md`'yi doğrulanmış patternlerle güncelle
- `vitrinly/public/models/` altına GLB yaz (overwrite OK)
- `vitrinly/.../urunler.json` içine **yeni ürün append** veya mevcut ürünün `modelUrl`'unu güncelle
- `npm run build` ile doğrulama
- Viewport screenshot al

### CANNOT
- ASLA orijinal kaynak dosyayı (OBJ, JPG, FBX, GLB-input) üzerine yazma
- ASLA `urunler.json`'dan ürün silme
- ASLA site kodu (Astro/JS/CSS) veya `config.json` / `kategoriler.json` değiştirme
- ASLA Blender bağlantısı olmadan devam etme
- ASLA insan onayı olmadan hedef boyut tahmin etme
- ASLA `bisect` sonrası `remove_doubles` + `normals_make_consistent` atlama
- ASLA Solid Shading'de screenshot alıp kalite kararı verme

## Final Quality Checklist

Her export öncesi:

- [ ] Dimensions mantıklı (MEMORY.md tablosuna uygun, metre)
- [ ] Taban Z=0
- [ ] Centroid X=0, Y=0
- [ ] Long edge X eksenine paralel
- [ ] Backrest +Y tarafında (varsa)
- [ ] Object scale=1, rotation=0 (apply edilmiş)
- [ ] Duplicate vertex sıfır (bisect sonrası)
- [ ] Normals consistent outward
- [ ] Unlit material (LiDAR scan ise)
- [ ] Texture pack edilmiş (GLB içinde)
- [ ] Poly count < 50k (ideal), < 100k (kabul)
- [ ] File size < 5 MB

Bir madde başarısız → düzelt, export'u durdur.

## Handoff Rules

### Hand off to HUMAN
- Blender MCP yanıt vermiyor
- Aynı hata 2+ kez (mesh bozuk olabilir)
- Texture tarama hatası içeriyor (re-scan gerekir)
- Ürün tipi bilinmiyor
- GLB > 20 MB (manuel optimize)
- Slug çakışması

### Update MEMORY
- Pattern 2+ farklı modelde gözlemlendi
- Yeni Common Error keşfedildi ve çözüldü
- Boyut tablosuna yeni ürün tipi gerekti

## Off-Limits Dosyalar

Bu agent ASLA dokunmaz:
- Kullanıcının orijinal scan klasörleri (örn. `~/Desktop/d44.../`)
- `vitrinly/src/components/**`, `vitrinly/src/scripts/**`, `vitrinly/src/pages/**`
- `vitrinly/src/data/musteriler/*/config.json` ve `kategoriler.json`
- `vitrinly/tasarimlar/**`
- `Agent-dosyaları/**` (başka workspace)

## Output File Naming
- Format: `outputs/YYYY-MM-DD_<slug>_<aksiyon>.md`
- Aynı slug için ikinci görev → eskiyi silme, yeni tarihli oluştur
