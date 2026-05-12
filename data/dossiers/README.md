# Covenant Dossiers

48 enrichment dossiers across the six KOORA covenants, eight runs each.

| Covenant | Files |
|---|---|
| Self | `Self_run1.md` ... `Self_run8.md` |
| Body | `Body_run1.md` ... `Body_run8.md` |
| Craft | `Craft_run1.md` ... `Craft_run8.md` |
| People | `People_run1.md` ... `People_run8.md` |
| Future | `Future_run1.md` ... `Future_run8.md` |
| World | `World_run1.md` ... `World_run8.md` |

These are version-controlled here as the source of truth. Each file holds Dr Mogire's curated material per covenant — sourced quotes with KOORA rewrites, brief stories, video/podcast/article references, book summaries, and Bible passages — all in his voice.

## Purpose

This corpus feeds Mogire AI's RAG layer. When the AI synthesises a participant's record (KOORA results screen, `/api/mogire-ai`), it can retrieve covenant-relevant passages to ground its response in Dr Mogire's actual writing rather than the model's general framework knowledge.

The RAG pipeline is optional — the AI degrades gracefully when no Vectorize index is bound. Ingesting these dossiers takes the synthesis from "speaks in his voice" to "speaks from his actual corpus."

## Ingestion pipeline

The setup agent runs `scripts/ingest-dossiers.mjs` once after creating the Vectorize index. The script:

1. Reads every `.md` file under `data/dossiers/covenants/`
2. Chunks each by H2 (`## ...`) section
3. Tags each chunk with metadata (`covenant`, `run`, `section_title`, `source_file`)
4. Embeds chunks via Voyage AI (`voyage-3`, 1024-dim, `input_type: "document"`)
5. Inserts vectors into Cloudflare Vectorize via the REST API

After ingestion, the Pages Function automatically uses the index when both `HOM_VECTORIZE` (binding) and `VOYAGE_API_KEY` (env var) are configured.

## Re-ingestion

When the dossiers are updated, re-run the script. It uses deterministic vector IDs (`<covenant>:<run>:<section_index>`) so updates overwrite the existing vector rather than creating duplicates.

## Soundbites canon

A small set of the strongest KOORA Rewrites from these dossiers is also seeded directly into `functions/api/mogire-ai.js` as `SOUNDBITES_CANON`. The canon ships with the deploy and gives the AI a stable set of quotable lines even without RAG. The full dossier corpus, when ingested into Vectorize, gives the AI a much wider canvas for retrieval-grounded synthesis.

## Voice canon

Tone, posture, and brand conventions for the AI are encoded in `functions/api/mogire-ai.js` Layer 2 (voice + canon). The dossiers should be read with the same conventions in mind:

- British English (criticising, normalised, honour, behaviour)
- Declarative, observation-not-exhortation
- The Finisher voice
- No em-dashes in the source canon — these are intentional style
- The doctrine: "The pattern is the diagnosis, never the verdict."
