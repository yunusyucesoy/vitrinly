# Memory: Blender Agent

İlk session: 2026-05-28. **Sample size: 6 model** (5 Poly Pizza + 1 Polycam scan).

> Bu memory iki bölümden oluşur:
> - **What Works/Doesn't Work** = proven techniques (uygulandı, sorunu çözdü)
> - **Patterns Noticed** = data observations (2+ farklı modelde tekrar etmesi gerek)

## What Works (proven techniques)

### Bisect → remove_doubles → normals_make_consistent (tek seansta)
Edit mode'da bisect sonrası her zaman `remove_doubles(threshold=0.0001)` + `normals_make_consistent(inside=False)`. Tek edit oturumunda yapılmalı.

**Evidence:** Küllük scan'inde bisect 861 duplicate vertex bıraktı, cleanup uygulayınca texture asimetrisi düzeldi.

### Bisect öncesi taban Z=0'a recenter
OBJ import + apply rotation sonrası mesh `Z=[-h, 0]` aralığına düşer. Bisect Z=+0.006'da yapılırsa mesh'in tamamını siler.

**Evidence:** Küllük dosyasında "min() iterable argument is empty" hatası — recenter eklenince çözüldü.

### LiDAR scan için Unlit material (Emission shader)
Scan texture'ı baked lighting içerir. Principled BSDF + viewer lighting → çift gölge. Çözüm: BSDF'yi sil, Emission shader bağla. Blender glTF exporter otomatik `KHR_materials_unlit` extension'ı ekler.

**Evidence:** Küllük scan'inde BSDF'de asimetrik karanlık taraf vardı, Emission'a geçince eşit aydınlık oldu.

### Cursor pivot ile uniform scale (çoklu mesh için)
GLB içinde birden fazla mesh varsa (örn. ayaklar + gövde + yastıklar), her mesh'i ayrı scale etmek relativiteyi bozar. `transform_pivot_point='CURSOR'` + cursor origin'de → toplu scale, ilişki korunur.

**Evidence:** couch.glb 12 mesh içeriyordu (gövde + 3 sırt + 3 oturma + 2 kol + 4 ayak), uniform scale ile hepsi bir arada düzgün küçüldü.

### PCA ile XY-skew tespit
Top view'da yamuk modeller için: vertex'lerin XY covariance matrisinin eigenvector'ünden ana eksen açısı bulunur. Z'de negatifi kadar dondur → X'e paralel olur.

**Evidence:** couch.glb -12.71° eğikti, PCA hesaplaması net verdi, +12.71° rotate ile düzeldi.

## What Doesn't Work (proven anti-patterns)

### Bisect üst üste birikme
Birden fazla bisect/edit operasyonu üst üste uygulanırsa hatalar birikiyor: ~%10 duplicate vertex/bisect, normaller bozuluyor. 3. bisect sonrası mesh tamir edilemez.

**Evidence:** Küllük dosyası 3 bisect denemesi sonrası texture artifaktları içerdi. Orijinalden başlamak gerekti.

**Çözüm:** Bozulursa orijinalden başla, fix yapmaya çalışma.

### Solid Shading'de texture kontrolü
Blender default "Solid" mode sadece material'in temel rengini gösterir, texture'ı değil. Screenshot alıp "renkler bozuk" diye yanıltıcı tanı.

**Evidence:** Küllük screenshot'unda Solid mode'da garip blocky render gördük, Material Preview'a geçince texture düzgün çıktı.

**Çözüm:** Her screenshot öncesi `space.shading.type = 'MATERIAL'`.

### `view_all` / `view_selected` doğrudan çağrı
Operator region context ister. Doğrudan çağırırsan `bpy.ops.view3d.view_all.poll() failed` hatası.

**Evidence:** İlk denemede temp_override olmadan çağırdığım için hata aldım.

**Çözüm:** `temp_override(area=area, region=region)` wrapper ile.

## Patterns Noticed (sample size = 1, doğrulama bekliyor)

> 2+ farklı modelde gözlemlenirse "What Works/Doesn't Work"a taşı.

- **Poly Pizza modelleri scale=100 ile geliyor.** Mesh data cm cinsinden, scale 100 ile metreye çevriliyor ama genelde 2× fazla büyük çıkar. (Görüldüğü: couch-medium.glb)
- **Bazı Poly Pizza modelleri inanılmaz büyük raw bounds içeriyor.** couch.glb 200km wide bound box çıkardı — muhtemelen mm cinsinden modellenmiş, yanlış import edilmiş.
- **3'lü kanepe modelleri genelde 12 ayrı mesh içeriyor** (gövde + 3 sırt + 3 oturma + 2 kol + 4 ayak). (Görüldüğü: couch.glb)
- **LiDAR scanlar Z=0 - 0.005m aralığında zemin içeriyor** (~5mm kalınlık). (Görüldüğü: küllük scan)
- **Poly Pizza GLB'lerinde rotation default = 0** ama bazıları XY düzleminde 10-15° eğik (yanlış orient). (Görüldüğü: couch.glb)

## Boyut Hedef Tablosu

| Mobilya Tipi | Hedef Max Boyut (m) | Notlar |
|---|---|---|
| Sandalye (dining) | 0.45 × 0.45 × 0.90 | Yüksek arkalık dahil |
| Sandalye (office) | 0.55 × 0.58 × 0.95 | Tekerlekli baz |
| 3'lü kanepe | 2.20 × 1.00 × 0.85 | |
| 2'li kanepe | 1.80 × 0.95 × 0.85 | |
| Tekli koltuk | 0.85 × 0.90 × 0.95 | |
| Puf / küçük obje | 0.55 × 0.55 × 0.45 | |
| Yatak (single) | 1.00 × 2.00 × 0.70 | |
| Yatak (double) | 1.60 × 2.00 × 0.70 | |
| Yatak başlığı | 1.80 × 0.15 × 1.30 | Sadece başlık |
| Yemek masası | 2.20 × 1.00 × 0.76 | 8 kişilik |
| Sehpa | 0.60 × 0.60 × 0.45 | |
| Konsol | 1.60 × 0.40 × 0.85 | |
| Komodin | 0.50 × 0.40 × 0.55 | |
| Gardırop | 2.20 × 0.60 × 2.30 | |
| Kitaplık | 2.40 × 0.38 × 2.30 | |
| Aksesuar (lamba, küllük, vazo) | 0.10 - 0.40 | Çeşitlilik var |
| Ayna (tam boy) | 0.75 × 0.04 × 1.80 | |

## Orientation Konvansiyonu

- **Long edge X'e paralel**
- **Yükseklik Z'de**
- **Arkalık +Y'ye** (kameradan uzakta)
- **Taban Z=0**
- **Centroid X=0, Y=0**

## Common Errors

| Hata | Sebep | Çözüm |
|---|---|---|
| `min() iterable argument is empty` | Bisect tüm mesh'i sildi | Bisect öncesi taban Z=0'a recenter |
| `context is incorrect` | Operator yanlış mode'da | `try: mode_set('OBJECT')` ile başla |
| `view_all.poll() failed` | Region yok | `temp_override(area, region=WINDOW)` |
| Renkler asimetrik karanlık | Scan baked lighting + BSDF | Material → Emission shader |
| Renkler zigzag/blok | Duplicate vertex + bozuk normal | `remove_doubles` + `normals_make_consistent` |
| GLB'de texture yok | Pack edilmemiş | Export öncesi `bpy.ops.file.pack_all()` |
| Solid'de renkler garip | Yanlış shading mode | `space.shading.type = 'MATERIAL'` |

## Last Updated
2026-05-28 — İlk session, 6 model işlendi.
