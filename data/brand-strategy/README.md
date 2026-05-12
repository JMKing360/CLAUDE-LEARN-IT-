# Brand strategy reference

Two strategic positioning documents that anchor everything Mogire AI does.

| File | Purpose |
|---|---|
| `HouseOfMastery_Master_Position_v1.0.pdf` | The master position document. Avatar, pain map, bullseye pain, unmet need, offer, founder spine, brand voice, required-include phrases, WORDS IN / WORDS OUT, Wojo intake reference, 90-day execution plan. |
| `HouseOfMastery_VOC_Research_v1.0.pdf` | The voice-of-customer research synthesis. 50 verbatim quotes from 200+ African diaspora professionals across six research streams, 10-pain map refreshed by VOC, "naming gap" confirmation, eight already-named phenomena (Achievement Paradox, Becoming Black, John Henryism, Moral Injury, BII, Survival Employment, Identity Liminality, Existential Vacuum), 25-30 recurring phrases tagged by register, headline candidates, body copy starter library. |

## How they feed Mogire AI

The most critical canonical fragments are baked directly into the Mogire AI system prompt (`functions/api/mogire-ai.js`) and live in the cached prefix:

- The **brand spine line** ("You can perform your way to excellence. You cannot perform your way to enough.") and 14 other canonical signature phrases land in `SOUNDBITES_CANON` at the top of the function file.
- The **10-pain map** is the lens the synthesis reads the participant's record against (Layer 3.5).
- The **bullseye pain** ("sitting on the bench of their own life") and the avatar definition are in Layer 3.
- The **WORDS IN / WORDS OUT** register is encoded in Layer 2.
- The **brand bio** (five-line, paste-ready) lives in Layer 1.
- The **diagnostic-not-coaching posture** ("Naming beats knowing", "Diagnose, don't motivate") is the doctrine the model operates under.

## How they feed Mogire AI's RAG layer

A future ingestion pass can also chunk these PDFs into a separate Vectorize index (parallel to the covenant dossiers — different index, different metadata schema) so the synthesis can retrieve specific pain-map entries or recurring phrases when the participant's record matches them. The pain-recurrence taxonomy in the VOC document maps cleanly to the assessment's `primary_reflex`, `examen_selected`, `pain_text`, and `unfinished_selected` fields.

For Phase 1, the in-prompt subset is sufficient. RAG of these docs is a Phase 2 effort.

## Editing protocol

- These are the canonical source-of-truth documents. They are NOT to be edited from a session — only by the operator, on advice of the brand council.
- When they update, the `SOUNDBITES_CANON` in `functions/api/mogire-ai.js` is the first thing to re-sync (operator edits the array directly).
- The 10-pain map in Layer 3.5 of the system prompt is the second thing to re-sync.
- If a pain category is added or removed, the system prompt's pain-responsive signature-line policy needs the new category added to its reference set.

## Required-include phrases (always available to the model)

Per §11 of the Master Position document:

- **Don't Die With An Unfinished Life** (master tagline)
- **You can perform your way to excellence. You cannot perform your way to enough.** (brand spine line)
- **Name the pattern. / Leave the bench.** (hook lines)
- **The Finisher Protocol™** (proprietary method)

These appear in `SOUNDBITES_CANON` at tier 1 (verbatim, with attribution).

## Words IN / Words OUT — critical register

Per §10 of the Master Position document.

**IN:** The Unfinished Life, Don't die with an unfinished life, Name the pattern, Leave the bench, The achievement paradox, The Finisher Protocol, Covenant (preferred over "goal"), Diagnose don't motivate, Diaspora, Finish what you came to do, Mid-career, Naming beats knowing, Witness, Return (as in "recovered self"), You cannot perform your way to enough.

**OUT (HARD BAN — these words must NEVER appear in synthesis):** Manifest, manifestation, law of attraction, Hustle, grindset, sigma, alpha, Limiting beliefs, High-vibe, energy alignment, abundance mindset, Boss babe, girlboss, Generational wealth (as primary frame), Trauma (as primary top-of-funnel frame), African American (we speak to diaspora, not African American), Coach, life coach (we are an architect of protocols), Life-changing or transformational without specifics, Tony-Robbins-style superlatives, "Unlock your true potential", "change your life forever", Wellness, self-care, balance, Burnout (use moral injury where appropriate), Purpose-driven journey, Manifest your dreams.

## Strategic implication for synthesis

The avatar is not looking for inspiration. They are looking for **a diagnosis**. The single highest-leverage move the synthesis can make is to **name a pattern the participant has been carrying without language for**. The signature line in any auto-synthesis or Q&A response MUST do this — it must respond to something specific the participant wrote in `pain_text`, `pain_text_5y`, `intent`, `examen_selected`, or `unfinished_selected`, and must name the pattern beneath what they wrote.

This is the "12th bar" added to the attribution policy: a paraphrase or coined signature line is only valid if it speaks BACK to something the participant actually named in their own words.
