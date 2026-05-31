# Skill: Marketplace GLB Hazırlama

## Purpose
Poly Pizza / Sketchfab / Khronos gibi kaynaklardan indirilmiş GLB'leri Vitrinly standardına getir.

## Serves Goals
- Doğru AR çıktısı
- Hızlı işlem (<10 dk)

## Inputs
- Kaynak GLB path (insan verir)
- Hedef ürün tipi + ad (insan verir → MEMORY.md tablosundan boyut)
- Blender MCP

## Process

1. **Pre-check** — Mode'u OBJECT'e zorla, sahnedeki tüm MESH+EMPTY'leri sil

2. **Import** — `bpy.ops.import_scene.gltf(filepath=PATH)`, sonra raw bilgileri rapor et (vertex, polygon, material, bounding box)

3. **Scale to target** — MEMORY.md'den ürün tipine göre `target_max` (m) al, mevcut max bound ile scale factor = `target_max / current_max`. **Cursor pivot ile uniform scale** (relativite korunur — çoklu mesh için kritik):
   ```python
   bpy.context.scene.cursor.location = (cx, cy, mnz)
   bpy.context.scene.tool_settings.transform_pivot_point = 'CURSOR'
   bpy.ops.transform.resize(value=(sf, sf, sf))
   ```

4. **Apply transforms** — `transform_apply(location=True, rotation=True, scale=True)`

5. **PCA skew check** — Top view'da yamukluk var mı? Formül MEMORY.md "What Works → PCA". 1°+ sapma varsa Z'de düzelt.

6. **Orientation check** — 
   - Long edge X'e paralel mi? Değilse Z'de 90° flip
   - Backrest (üst %25 Z bölgesi) hangi Y tarafında? +Y olmalı, -Y ise 180° Z flip

7. **Pivot bottom-center + recenter Z=0** — centroid X=0, Y=0, taban Z=0. Origin'i cursor'a set + tüm imported'leri offset ile taşı + apply translation.

8. **Front view screenshot** — **MATERIAL Preview**'da insana göster (Solid değil!)

9. **Quality checklist** (RULES.md) — geçmezse durdur

10. **Export** — `bpy.ops.export_scene.gltf(filepath=f"vitrinly/public/models/{slug}.glb", export_format='GLB', use_selection=True, export_apply=True, export_yup=True, export_image_format='AUTO')`

11. **Output rapor** — `outputs/YYYY-MM-DD_<slug>_glb.md`

## Quality Bar
- Tek pass'te quality checklist geçer
- File size < 5 MB
- Poly < 50k (ideal)
- Material BSDF olarak kalır (unlit gerekmez — marketplace texture'da baked lighting yok)
- Çoklu mesh varsa relativite korunmuş

## Common Pitfalls
- Apply rotation atlanırsa export'ta yön sorunu
- Cursor pivot kullanılmazsa çoklu mesh modellerde scale relativite bozulur
- Quality checklist atlanırsa AR'da boyut/yön yanlış çıkar
