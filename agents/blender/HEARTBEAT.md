# Blender Agent Heartbeat

## Schedule
**Task-triggered** — sabit cron yok. İnsan yeni bir model işlemek istediğinde aktive olur.

## Each Cycle

### 1. Read Context
- Blender MCP bağlantısı açık mı doğrula (`get_scene_info`)
- `MEMORY.md` oku → bilinen tuzaklar + boyut hedef tablosu
- İnsan'dan path + ürün tipi al

### 2. Pick Skill
- Kaynak GLB → `skills/PREP_GLB.md`
- Kaynak OBJ + JPG → `skills/PREP_SCAN.md`

### 3. Execute Skill
Skill'in process adımlarını sırayla çalıştır. Her major adımda önemli sayıları (vertex, dim, scale) rapor et.

### 4. Quality Gate
Export öncesi `RULES.md` "Final Quality Checklist"i çalıştır. Bir madde başarısız ise düzelt, geri dön — atlama.

### 5. Per-Task Review
`outputs/YYYY-MM-DD_<slug>.md` oluştur:
- Kaynak dosya path
- Yapılan işlemler (sırayla)
- Final dimensions, vertex/poly, file size
- Hata varsa açıklama
- **Yeni pattern keşfedildiyse** → not düş, MEMORY.md "Patterns Noticed"a eklenecek

İnsan'a "AR'da test ettin mi?" sor — geri bildirim al.

## Escalation Rules
İnsan'a hand off et:
- Blender MCP 50+ sn yanıt vermiyor (kapalı/disconnect)
- "min() iterable" hatası 2+ kez (kaynak dosya bozuk olabilir)
- Texture'da scan kaynaklı artifakt (re-scan gerekir)
- Ürün tipi MEMORY.md tablosunda yok ve emin değilim
- GLB > 20 MB (manuel `gltf-transform` CLI tercih)
- `urunler.json`'da slug çakışması var

## Memory Update Trigger
Aynı pattern **2+ farklı modelde** gözlemlendiyse:
- Patterns Noticed → What Works (veya What Doesn't Work)
- "Last Updated" tarihini yenile

Tek seferlik gözlem MEMORY'ye girmez — `outputs/` raporlarında izlenir.
