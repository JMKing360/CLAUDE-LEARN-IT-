# Accessibility Statement

House of Mastery is committed to digital accessibility. We design and build the diagnostic instruments to meet **WCAG 2.2 Level AA** to the extent reasonably practicable.

## Conformance status

The First Hour and KOORA: The Finishing Protocol target WCAG 2.2 AA. The current build implements the controls below; a full external VPAT audit is scheduled before the first paid cohort launches.

## Implemented controls

| Criterion | Status |
|---|---|
| 1.1.1 Non-text content | Every meaningful image carries `alt` or `aria-label` |
| 1.3.1 Info and relationships | Semantic HTML, proper heading hierarchy, role attributes where needed |
| 1.4.3 Contrast (Minimum) | Brand palette tested against AA thresholds at all type sizes |
| 1.4.4 Resize text | Fluid `clamp()` typography honours 200% zoom |
| 1.4.10 Reflow | Layouts reflow at 320 px without horizontal scroll |
| 1.4.11 Non-text contrast | Buttons, focus rings, and stateful UI meet 3:1 |
| 1.4.12 Text spacing | Adequate line-height, letter-spacing, paragraph spacing |
| 2.1.1 Keyboard | Full assessment completable by keyboard alone |
| 2.4.1 Bypass blocks | Skip-to-main-content link as first focusable element |
| 2.4.7 Focus visible | Custom gold focus rings on all interactive elements |
| 2.5.5 Target size | Tap targets at 44 px minimum on mobile |
| 3.1.1 Language of page | `lang="en"` set on `html` |
| 3.3.1 Error identification | Email validation surfaces clear inline errors |
| 4.1.2 Name, role, value | Every interactive element exposes a programmatic name and role |

## Reduced motion

The instruments respect `prefers-reduced-motion: reduce`. Auto-advance, slide transitions, count-up animations, and reveal animations are stripped or shortened when this preference is set.

## Reduced data

Where possible we honour `prefers-reduced-data` by deferring non-essential animations and lazy-loading the PDF library only on demand.

## Known limitations

- Screen-reader testing on JAWS, NVDA, and VoiceOver is in progress; we will publish results before public launch.
- Brand fonts (Source Serif 4, Plus Jakarta Sans) require web-font loading; we use `font-display: swap` to prevent invisible-text periods.

## Reporting

If you encounter an accessibility issue, write to `mail@mogire.com` with **Accessibility issue** in the subject line. We will respond within seven days.
