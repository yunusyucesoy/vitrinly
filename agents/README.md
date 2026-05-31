# Vitrinly Agents

Markdown tabanlı, task-triggered agentlar. Her agent kendi klasöründe.

## Mevcut Agentlar

| Agent | Klasör | Görev |
|-------|--------|-------|
| Blender | `blender/` | 3D mobilya modelleri (GLB/OBJ) hazırla, AR-ready siteye ekle |

## Yeni Agent Eklemek

Standart yapı:
```
agents/<name>/
├── AGENT.md       # mission, KPI, skill listesi
├── HEARTBEAT.md   # schedule (cron veya task-triggered)
├── MEMORY.md      # öğrenilmiş patternler
├── RULES.md       # sınırlar, off-limits dosyalar
├── skills/        # her skill ayrı .md
├── outputs/       # tarihli rapor dosyaları
└── data/imports/  # insan'ın bıraktığı veri
```

Pattern: `Agent-dosyaları/agents/standard-agent/` template'ini izle.

## Kullanım

Claude Code'a:
```
"agents/blender ile şu OBJ'yi process et: <path> — küllük olarak ekle"
```

Agent kendi `AGENT.md` + `MEMORY.md` + `RULES.md` + uygun skill dosyasını okur, sırayla uygular.
