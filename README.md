# Prime Sip Kitchen 🍽️✨

A luxury, high-end Afro-fusion restaurant and lounge website. Experience modern West African cuisine paired with rich interactive media.

## ✨ Features

- **Rich Visual Aesthetics**: A dark, premium aesthetic using charcoal backgrounds, warm amber, and golden highlights. Includes a glassmorphic sticky header and smooth scroll reveals.
- **Cinematic Video Hero**: Autoplay, loop-muted background video banner showcasing high-end professional kitchens and grilling.
- **Floating Embers Particle Effect**: Real-time particle embers drifting up from the fireplace overlay in the hero.
- **Procedural Ambient Music (Web Audio API)**:
  - An elegant, floating bottom-left audio pill widget allows visitors to opt-in to a relaxing jazz/lounge background track.
  - Generating audio procedurally in code using oscillators and filters ensures **zero network overhead**, instant buffering, and high stability.
- **Dynamic Sound Effects (SFX)**: Satisfying sparkling chime feedback whenever a dish is added to the cart or the quantity is changed.
- **Single Source of Truth Catalog**:
  - Automatically loads and formats menu items in groups (Combos, Swallows, Pepper Soups, Sips).
  - Clean filter chips for smooth categorization.
- **Client-Side Cart Engine**: Responsive local-storage-backed cart detailing item subtotals, custom order options (Dine-in vs. Delivery with a ₦2,500 delivery fee calculations), and a simulated payment gateway checkout.

## 🛠️ Technology Stack

1. **HTML5 Semantic Elements**
2. **Vanilla CSS** (Custom scrollbars, fluid variables, animations, and flex/grid media alignments)
3. **Vanilla JavaScript** (ES6 modules, DOM events, localStorage, Web Audio API synthesis)
4. **Cinematic Media Elements** (Embedded MP4 feeds & procedurally generated sound arrays)

## 🚀 Getting Started

Simply open `index.html` in any modern web browser to view the application locally, or run a lightweight static file server:

### With Node.js (npx)
```bash
npx serve .
```

### With Python
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

---
*Crafted for Prime Sip Kitchen. Built with prestige.*
