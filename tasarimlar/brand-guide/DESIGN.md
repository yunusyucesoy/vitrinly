---
name: Atelier Anatolia
colors:
  surface: '#fbf9f7'
  surface-dim: '#dbdad8'
  surface-bright: '#fbf9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f1'
  surface-container: '#efedec'
  surface-container-high: '#eae8e6'
  surface-container-highest: '#e4e2e0'
  on-surface: '#1b1c1b'
  on-surface-variant: '#4e4545'
  inverse-surface: '#30302f'
  inverse-on-surface: '#f2f0ee'
  outline: '#7f7475'
  outline-variant: '#d1c3c4'
  surface-tint: '#695b5c'
  primary: '#332829'
  on-primary: '#ffffff'
  primary-container: '#4a3e3f'
  on-primary-container: '#baa9aa'
  inverse-primary: '#d4c2c3'
  secondary: '#6b5c4c'
  on-secondary: '#ffffff'
  secondary-container: '#f4dfcb'
  on-secondary-container: '#716252'
  tertiary: '#442306'
  on-tertiary: '#ffffff'
  tertiary-container: '#5e3819'
  on-tertiary-container: '#d8a27b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f1dedf'
  primary-fixed-dim: '#d4c2c3'
  on-primary-fixed: '#23191a'
  on-primary-fixed-variant: '#504445'
  secondary-fixed: '#f4dfcb'
  secondary-fixed-dim: '#d7c3b0'
  on-secondary-fixed: '#241a0e'
  on-secondary-fixed-variant: '#524436'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#f4bb92'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#653d1e'
  background: '#fbf9f7'
  on-background: '#1b1c1b'
  surface-variant: '#e4e2e0'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 64px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 40px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: EB Garamond
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  touch-target-min: 48px
---

## Brand & Style

The design system is rooted in **Warm Minimalism**, specifically tailored for a high-end Turkish furniture showroom. It balances the austere discipline of minimalist layout with the organic warmth of Anatolian craftsmanship. The UI must feel like a curated gallery—quiet, sophisticated, and deeply inviting.

The target audience is affluent, design-conscious individuals who value heritage and modern comfort. The emotional response should be one of "Sakinlik" (Tranquility) and "Güven" (Trust). We achieve this through:
- **Generous Whitespace:** Allowing product photography to breathe.
- **Tactile Materiality:** Using color and shadow to mimic wood, linen, and stone.
- **Editorial Precision:** High-contrast typography that feels like a premium interior design magazine.

## Colors

The palette is a tribute to natural materials. 
- **Primary (Deep Walnut):** Used for typography and structural elements to provide grounding and authority.
- **Secondary (Sand Linen):** Used for subtle backgrounds, dividers, and secondary actions, evoking the texture of natural fabrics.
- **Accent (Burnished Oak):** Reserved for interactive elements and highlights that require a touch of warmth and sophistication.
- **Background (Soft Paper):** A warm off-white that prevents the "starkness" of pure white, providing a comfortable reading experience.
- **Status/Utility:** The WhatsApp green is kept in its native shade for immediate recognition, but should be used sparingly with a floating action button or specific contact cards.

## Typography

This design system uses a classic Serif/Sans duo. **EB Garamond** provides the literary, premium Turkish "Köşk" (Mansion) feel for headlines. **DM Sans** ensures modern efficiency and high legibility for product descriptions and technical specifications.

**Implementation Notes:**
- All typography must support Turkish character sets (ğ, ü, ş, i, ö, ç).
- Headings use a tighter letter-spacing for a more polished, "designed" appearance.
- Labels utilize uppercase with slight tracking (letter-spacing) to differentiate them clearly from body copy.

## Layout & Spacing

The layout follows a **Fixed Grid** model on desktop (1280px max-width) to maintain the editorial look, while transitioning to a **Fluid Grid** on mobile.

- **Desktop:** 12-column grid with 24px gutters. Wide margins (64px) ensure the content feels centered and curated.
- **Mobile:** 4-column grid with 16px gutters and 20px margins.
- **Spacing Rhythm:** Use 8px increments. Large sections (e.g., Furniture Collections) should be separated by at least 80px - 120px to emphasize the "Minimalist" aesthetic.
- **Touch Targets:** All interactive elements must maintain a minimum of 48px height/width for accessibility and ease of use.

## Elevation & Depth

To maintain the "Warm" aspect of the minimalism, we avoid harsh, high-contrast shadows. Instead, we use **Ambient Shadows** and **Tonal Layers**.

- **Shadows:** Use a single, soft shadow style for cards and elevated states. Shadow color is a desaturated version of the Deep Walnut (#4A3E3F at 8-12% opacity) with a large blur radius (24px-32px).
- **Tonal Depth:** Use the "Sand Linen" color as a background for secondary content blocks to create a "recessed" look without needing shadows.
- **Interaction:** On hover, cards should subtly lift (shadow deepens slightly) rather than change color, mimicking a physical object being highlighted.

## Shapes

The shape language is **Rounded**, reflecting the soft curves often found in high-end furniture (upholstery, turned wood legs).

- **Standard Elements:** 16px (1rem) for buttons, input fields, and small cards.
- **Large Containers:** 24px (1.5rem) for main product hero cards and modal overlays.
- **Images:** Always clipped to the standard corner radius to maintain a soft, inviting aesthetic.

## Components

### Buttons
- **Primary CTA:** Deep Walnut background with Soft Paper text. **Pill shape (`rounded-full`)** for hero/sticky/main actions — improves thumb-zone scanability on mobile. Padding: 14-16px top/bottom, 24-32px left/right.
- **Secondary CTA:** 16px rounded (`rounded-xl`) with Sand Linen background and Deep Walnut text. Used for inline actions inside cards.
- **Icon button:** Circular, 44-48px square, surface-container background. Used for share/call/refresh inside viewer overlays.
- **WhatsApp FAB:** Circular WhatsApp Green button, bottom-right with safe-area-aware padding (`env(safe-area-inset-bottom)`). Includes a continuous `pulse-ring` ambient animation to draw attention without flashing.
- **AR Placeholder ("Yakında"):** Surface-bright background, outline-variant border, primary text. Carries a `tertiary-c` chip with "YAKINDA" label — signals Phase 2 readiness without breaking the brand.

### Input Fields
- Underlined or softly outlined (1px Deep Walnut at 20% opacity). The focus state transitions to a solid 1px Deep Walnut border.

### Cards (Product Gallery)
- **Style:** Background Soft Paper, 16px rounded corners, ambient shadow.
- **Image:** Full-bleed at the top, followed by EB Garamond title and DM Sans price.
- **CTA:** A subtle "İncele" (Examine) text link or a ghost button.

### Chips & Tags
- Used for furniture categories (e.g., "Yeni Sezon", "Masif Ahşap"). Use Sand Linen background with a very small font size and high letter-spacing.

### List Items
- Generous vertical padding (24px). Separated by a thin 1px line in Sand Linen. Use for specifications or navigation menus.

---

## 3D Catalog Components

These are domain-specific patterns introduced for the 3D-furniture-catalog use case. They sit on top of the base design system above.

### 3D Badge
A small pill placed on every product card whose product has a GLB model. Surface-bright background with backdrop-blur, 9.5-10px uppercase label with wide letter-spacing, paired with the `view_in_ar` Material Symbol. Always top-left of the product image. Signals discoverability of 3D content before the user taps in.

### Product Viewer — Three States

The product detail page mounts `<model-viewer>` lazily. Three explicit visual states share the same container (aspect 4/5 on mobile, square on desktop):

1. **Poster (default).** Lifestyle image with subtle bottom gradient. Center: pulse-ring + large circular "360" CTA. Top-left: dimension chip (`240 × 105 × 75 cm`). Top-right: AR placeholder button with "YAKINDA" chip. Image uses `fetchpriority="high"`.
2. **Skeleton (loading).** Warm-toned shimmer (gradient between `surface-c-low` and `surface-c`, not generic grey) at 75% of viewer size, with `"Model yükleniyor…"` label in tracked-uppercase below.
3. **Live (loaded).** model-viewer rendered, with floating control cluster bottom-right (refresh, dimensions, fullscreen) and a "Canlı 3D" pill bottom-left with a pulsing dot.

### AR Placeholder
Until Phase 2 ships, every viewer carries a non-functional AR button that opens a toast: `"AR yakında · WhatsApp ile haberdar olun"`. Styled with a dashed outline-variant border and "YAKINDA" chip in `tertiary-c`. When AR ships, only the `ar` / `ar-modes` / `ar-scale` attributes on model-viewer need to be enabled — no structural change.

### Fabric / Color Swatches
50×50 circular swatches with `inset` shadow (mimics fabric depth, not flat). The active swatch carries a double-ring (2px surface gap + 2px primary ring). Inactive labels are 60% opacity. Selecting a swatch:
- Updates the URL (`?renk=toprak`) — state is shareable
- Updates the WhatsApp deep-link text to include the chosen color
- If the GLB is loaded, calls `material.pbrMetallicRoughness.setBaseColorFactor()` on the live model

### Dimension Communication
Two patterns work together:
- **Chip overlay on poster:** Always-visible dimension chip (`240 × 105 × 75 cm`) so users know scale before loading 3D.
- **Sketch SVG card:** Inline below the viewer — minimal hand-drawn-style line drawing of the furniture silhouette with dashed dimension lines (cm). Feels editorial, not technical.
- **In-viewer hotspots:** When the user toggles the "straighten" control, slotted `.hotspot` markers appear on the loaded GLB at predefined `data-position` coordinates.

---

## Atmosphere & Texture

### Paper Grain Background
The body carries a subtle two-layer dotted noise via stacked `radial-gradient` backgrounds (`6px` + `13px` sizes, ~2.5% opacity walnut). Adds tactile warmth without an image request. Applied site-wide on `body`.

### Ambient Shadow Token
`box-shadow: 0 24px 48px -16px rgba(74, 62, 63, 0.18)` for cards. For hero / featured cards use `0 30px 60px -20px rgba(74, 62, 63, 0.18)`. Color is desaturated Deep Walnut, never neutral grey.

### Shimmer
Warm shimmer between `#efedec → #f5f3f1 → #efedec` on a 200% background-size, 1.8s loop. Used for any skeleton state. Never use generic grey shimmer.

### Pulse Ring
Used on the 360° viewer CTA and the WhatsApp FAB. Two-ring expanding-and-fading border animation (`scale(1) → scale(1.8)`, opacity `.6 → 0`, 2.4s loop, second ring offset by 1.2s).

### Marquee Divider
Italic EB Garamond brand slogan ribbon scrolling horizontally between sections on the home page. Tone: `on-surface-v` with `text-on-surface-v/40` floral separator (`✦`). 35s loop on mobile, 45s on desktop. Used sparingly — once per page max.

---

## Typography Patterns

### Mixed-Style Display Headings
Combine upright and italic EB Garamond within the same headline to create rhythm: `Defne *Koltuk Takımı*`, `Sakinlik *ve* Güven`, `Odadan *odaya*`. The italic word is usually the secondary/qualifier; the upright word carries the noun weight.

### Drop Cap
Editorial first-letter treatment on long-form descriptions (product page, hakkımızda story). EB Garamond italic, 3.6rem (mobile) / 5.5rem (desktop), floated, with ~0.55rem right padding and 0.15rem bottom padding. Color: `primary`. Use sparingly — one drop cap per page.

### Editorial Eyebrow Label
`text-[10px] uppercase tracking-[0.25em] font-bold text-on-surface-v`. Optional leading hairline (`<span class="inline-block w-6 h-px bg-primary"></span>`). Sits above every major section heading.

### Italic Pricing
Use EB Garamond italic at headline-md size for price-by-request copy (`"Fiyat için iletişim"`). Reinforces editorial, non-e-commerce tone.

---

## Mobile Patterns

### Sticky Bottom Action Bar
The product detail page docks Call + Share + WhatsApp in a fixed bottom bar with `backdrop-blur-xl`, top border `outline-v/30`, and `padding-bottom: env(safe-area-inset-bottom)`. WhatsApp button takes the dominant width (flex-1), the two icon buttons are 48px circles. Always within the thumb arc.

### Safe-Area Awareness
All bottom-fixed elements (FAB, sticky CTA bar) must use `env(safe-area-inset-bottom)` so they sit above the iOS home indicator.

### Horizontal Scrollers
For "similar products", "fabric swatches", filter chips: use `overflow-x-auto` with custom `no-scrollbar` utility, `snap-x snap-mandatory` for product cards. Card width: `~65-70vw` capped at `~290px` to always show the next card peeking in. Removes the need for pagination.

### Collapsible Sections
Specs and other long content blocks use `<details>` with custom-styled `<summary>` (no marker, just an `expand_more` chevron that rotates on open). Default state: first specs block open, rest closed. Keeps the mobile page short without hiding information.

---

## WhatsApp Integration

WhatsApp is the primary contact channel — it should never be more than a thumb-reach away.

### Deep-Link Pattern
Every WhatsApp CTA includes pre-filled text with full product context:
```
https://wa.me/PHONE?text=Defne%20Koltuk%20Takımı%20hakkında%20bilgi%20almak%20istiyorum%20(Kum%20Keten)
```
When the user changes color/fabric, the link's `text` parameter is regenerated client-side so the salesperson sees exactly which variant the customer was looking at.

### WhatsApp Brand Color
Use the WhatsApp brand green `#25D366` natively — do not retint to match the warm palette. The recognition value outweighs aesthetic harmony for this single touchpoint.

### Pulse on Primary WhatsApp CTA
The sticky bottom WhatsApp button uses a `box-shadow` ping animation (3-stage opacity fade on `0 0 0 18px rgba(37,211,102,0)`, 2.2s loop). Static FABs on other pages use the same pulse.

---

## Shareability & QR-Arrival

The catalog is built for link-sharing (WhatsApp) and QR-from-store traffic. The UI acknowledges both contexts.

### QR-Arrival Ribbon
When `?ref=qr` is present in the URL, a slim `tertiary-c` ribbon appears at the top of the page: `"Mağazadan geldiniz · {Müşteri adı}"`. Communicates continuity from the physical showroom to the digital catalog.

### Shareable Variant State
Every interactive state that affects what the customer is looking at writes to the URL via `history.replaceState`. Currently: fabric/color choice (`?renk=`). When shared, the recipient lands on the exact configuration. The WhatsApp deep-link text auto-updates to reflect the active state.

### Native Share with Fallback
The share button uses `navigator.share()` when available, with a `navigator.clipboard.writeText()` fallback that shows the toast `"Bağlantı kopyalandı"`.

---

## Motion Principles

Use motion to reveal content, not to entertain.

- **Reveal-on-load:** Staggered fade-up (`translateY(14-20px) → 0`, opacity `0 → 1`, 0.7-0.9s cubic-bezier(.2,.7,.2,1)). Stagger delays: `.05s / .15s / .25s / .35s`. Applied to top-of-page sections in cascade.
- **Card hover:** Image scales to `1.05-1.06` over 0.9s. The card itself does not lift — only the image breathes. Maintains the "physical object in a gallery" feeling.
- **Active states:** `active:scale-95` on every primary tap target. Mobile-first feedback.
- **Pulse ring & shimmer:** Continuous ambient motion only on attention-priority elements (3D CTA, WhatsApp FAB, skeleton). Never on decorative elements.
- **Marquee:** 35-45s loop. Slow enough to read individual words, never urgent.

---

## Performance Budget

These are not optional — they encode the brand promise of "Sakinlik".

- **First paint < 1.5s on 4G.** Use `fetchpriority="high"` on hero images, `preconnect` to font origins, `preload` for the critical stylesheet.
- **Defer model-viewer.** Load `<model-viewer>` script as `type="module" defer` so it doesn't block first paint. GLB itself loads only after explicit user tap on the "360" CTA — this saves ~1.8 MB on the initial page.
- **Lazy everything below the fold.** All non-hero images use `loading="lazy"`.
- **CSS-only effects.** Paper grain, shimmer, pulse-ring, marquee — all CSS. No images, no extra JS.
- **No webfonts beyond two families.** EB Garamond + DM Sans. Material Symbols is loaded via Google's variable font.