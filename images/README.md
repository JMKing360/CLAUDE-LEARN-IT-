# Image assets

Drop the following files into this directory. The HTML references them by exact name; the layout degrades gracefully (`onerror="this.style.display='none'"`) if a file is missing.

| File | Used by | Purpose | Recommended crop |
|------|---------|---------|-----------------|
| `koora-logo.png` | Cover letters, PDFs, hero contexts | Formal raster KOORA mark (the inline SVG nav-mark stays put) | Native — dark navy on transparent or cream |
| `dr-job-cover.jpg` | `cover-letter` block on welcome screens (both instruments) | Executive credibility — circular crop (108×108 desktop, 72×72 mobile) | `object-position: center 22%` — favour face/upper torso |
| `dr-job-desk.jpg` | KOORA `Meet Dr. Job` section | Warm/approachable — rectangular 4:5 crop | `object-position: center 20%` |
| `dr-job-clinical.jpg` | First Hour `Meet Dr. Job` + (forthcoming v3.2.1) medical-grade PDF avatar page | Clinical credibility — rectangular 4:5 crop | `object-position: center 18%` — favour face/lab-coat embroidery |

Cropping is handled at render time via CSS `object-fit: cover` + `object-position`, so original images can be uploaded at full resolution. Recommended minimum: 1200px on the long edge, JPEG at 82% quality.

The directory exists in source control so the path resolves; binaries themselves are uploaded out-of-band to keep repo size bounded.
