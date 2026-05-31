# Skill: Polycam/LiDAR Scan Hazırlama

## Purpose
Polycam vb. LiDAR taramalarından OBJ + JPG texture'ı siteye hazır GLB'ye dönüştür. Zemin temizliği, unlit material, ölçek doğrulaması dahil.

## Serves Goals
- Doğru AR çıktısı
- Hızlı işlem (<20 dk)
- Az re-work

## Inputs
- Klasör path (OBJ + MTL + JPG)
- Hedef ürün tipi + ad
- Blender MCP

## Process

1. **Pre-check + temizle** — Mode OBJECT, sahnedeki MESH+EMPTY sil

2. **Import OBJ** — `bpy.ops.wm.obj_import(filepath=...)`. Import sonrası mesh `rotation=(90°, 0, 0)` gelir (Y-up → Z-up)

3. **Apply rotation** — `transform_apply(location=True, rotation=True, scale=True)`. **DİKKAT:** Apply sonrası mesh Z=[-h, 0] aralığına düşer

4. **Recenter taban Z=0'a** — Bisect ÖNCESİ ZORUNLU. Atlanırsa "min() iterable" hatası. Centroid X/Y'yi 0, en alt vertex'i Z=0 yap.

5. **Z dağılım analizi** — 20 dilime böl, her dilimde vertex sayısı + XY genişliği rapor. Yoğun + geniş alan = zemin. Genelde Z=0 — Z=0.005m (~5mm). Kesim noktası = zemin üstü güvenli pay (örn. 0.006m).

6. **Edit Mode — TEK SEANSTA bisect + cleanup** (3'ü birden, sırayla):
   ```python
   bpy.ops.object.mode_set(mode='EDIT')
   bpy.ops.mesh.select_all(action='SELECT')
   bpy.ops.mesh.bisect(plane_co=(0,0,CUT_Z), plane_no=(0,0,1), clear_inner=True, use_fill=True)
   bpy.ops.mesh.select_all(action='SELECT')
   bpy.ops.mesh.remove_doubles(threshold=0.0001)
   bpy.ops.mesh.select_all(action='SELECT')
   bpy.ops.mesh.normals_make_consistent(inside=False)
   bpy.ops.object.mode_set(mode='OBJECT')
   ```
   **3 adımı da atlama** — biri eksikse texture artifaktı çıkar.

7. **Recenter (kesim sonrası)** — Yeni taban Z=0'a tekrar hizala

8. **Material → Unlit** — Principled BSDF'yi sil, Emission shader ekle, image color → Emission color → Output:
   ```python
   keep = {'TEX_IMAGE','OUTPUT_MATERIAL','TEX_COORD','MAPPING','UVMAP'}
   for n in list(mat.node_tree.nodes):
       if n.type not in keep: mat.node_tree.nodes.remove(n)
   emit = mat.node_tree.nodes.new('ShaderNodeEmission')
   links.new(img_node.outputs['Color'], emit.inputs['Color'])
   links.new(emit.outputs['Emission'], out_node.inputs['Surface'])
   ```
   glTF exporter Emission görünce `KHR_materials_unlit` otomatik ekler.

9. **Texture pack + screenshot doğrulama** — `bpy.ops.file.pack_all()`. Material Preview mode'a geç, front + back screenshot al. Asimetrik gölge/zigzag yok mu kontrol et.

10. **Quality checklist** (RULES.md) — geçmezse durdur

11. **Export** — `export_format='GLB', use_selection=True, export_apply=True, export_yup=True, export_image_format='AUTO', export_materials='EXPORT'`

12. **Output rapor + insan onayı** — `outputs/YYYY-MM-DD_<slug>_scan.md`. İnsan'a "AR'da test ettin mi?" sor.

## Quality Bar
- Front + back view'da texture eşit (asimetrik karanlık taraf YOK)
- Zigzag artifakt yok
- Taban Z=0, centroid (0,0)
- File size < 5 MB
- KHR_materials_unlit extension export'ta var

## When to Restart from Original
- Bisect 2+ kez yapıldıysa
- Texture'da daha önce olmayan artifakt çıktıysa
- "min() iterable" 2+ kez geldiyse
- `remove_doubles` %20+ vertex sildiyse (mesh kötü durumda)

**Yeniden orijinal OBJ'den başla, prosedüre tam uyarak tekrar yap.** Bozuk mesh'i tamir etmeye çalışma.

## Output Format Örneği

```markdown
# 2026-05-31_kullu_scan.md

## Kaynak
- OBJ: ~/Desktop/d44.../3DModel.obj
- Texture: 3DModel.jpg (4096×4096)

## İşlemler (sırayla)
1. Import: 8676 vertex, raw dim=(0.119, 0.103, 0.126) m
2. Apply rotation → Z=[-0.103, 0]
3. Recenter taban Z=0
4. Bisect Z=0.006 + remove_doubles (861 silindi) + normals_consistent
5. Recenter (post-bisect)
6. Material → Emission (unlit)
7. pack_all + export

## Final
- Boyut: 7.5 × 7.8 × 9.7 cm
- Vertex: 6521, Poly: 12787
- File: kullu.glb, 1.55 MB
- KHR_materials_unlit: ✓
- Quality checklist: hepsi geçti

## Notlar / Yeni Pattern
- Texture'da zigzag yoktu, scan kalitesi iyiydi
- (Pattern Noticed → MEMORY'ye eklendi mi?)
```
