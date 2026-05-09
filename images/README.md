# Image assets

Drop the following files into this directory. The HTML references them by exact name; the layout degrades gracefully (`onerror="this.style.display='none'"`) if a file is missing.

## Brand marks

| File | Used by | Purpose | Notes |
|------|---------|---------|-------|
| `House-of-Mastery-with-Dr-Job-Mogire-favicon.png` | favicon, apple-touch-icon, nav-house, all small avatar contexts | The circular "lm" House of Mastery mark | Square. PNG at 512×512 minimum, transparent ground preferred. Used as both browser favicon and Apple touch icon. |
| `House-of-Mastery-with-Dr-Job-Mogire-logo.png` | cover letters, PDF cover, hero contexts on landing | Full lock-up — circular mark + "house of mastery" wordmark | Native aspect ratio (≈3:1). Native resolution 3295×1069 ideal. |
| `koora-logo.png` | KOORA cover letter heading, foot-credit stamp, hero contexts | Formal serif KOORA wordmark | Dark navy on transparent. Used alongside the inline SVG type-set version (which remains as gold accent chrome on each screen). |

## Author portraits

| File | Used by | Purpose | Recommended crop |
|------|---------|---------|-----------------|
| `dr-job-cover.jpg` | `cover-letter` block on welcome screens (both instruments) | Executive credibility — circular crop (108×108 desktop, 72×72 mobile) | `object-position: center 22%` — favour face/upper torso |
| `dr-job-desk.jpg` | KOORA `Meet Dr. Job` section | Warm/approachable — rectangular 4:5 crop | `object-position: center 20%` |
| `dr-job-clinical.jpg` | First Hour `Meet Dr. Job` + author byline avatar at top of result pages + medical-grade PDF avatar | Clinical credibility — rectangular 4:5 crop | `object-position: center 18%` — favour face/lab-coat embroidery |

Cropping is handled at render time via CSS `object-fit: cover` + `object-position`, so original images can be uploaded at full resolution. Recommended minimum: 1200px on the long edge for portraits, JPEG at 82% quality. Logos: native vector if SVG, otherwise PNG at 2× display size with transparent background.

The directory exists in source control so the path resolves; binaries themselves are uploaded out-of-band to keep repo size bounded.

