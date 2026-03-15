# Every.to Image Style — Gemini API Prompts

Victorian steel engraving / halftone etching aesthetic.
Black & white cross-hatching + bold single flat-color backgrounds.

---

## Prompt 1 — Classical Courtyard (Amber)

```
A wide panoramic illustration in the style of a 19th-century Victorian steel engraving with dense cross-hatching, stippling, and halftone dot shading. Two figures in Renaissance-era clothing, seen from behind, stand at the entrance of a grand neoclassical courtyard with towering Corinthian columns, stone arches, a geometric tiled floor, and tall cypress trees in the distance. A church bell tower is visible on the horizon. On the right side of the courtyard sits early industrial machinery — a printing press and a mechanical device. The entire illustration is rendered in black and white linework with a flat solid golden amber (#D4A017) sky filling the background. The style evokes Gustave Doré or Giovanni Battista Piranesi engravings. No text. Aspect ratio 16:9.
```

## Prompt 2 — Human-AI Allegory (Teal)

```
A wide panoramic illustration in the style of a 19th-century Victorian steel engraving with dense cross-hatching, stippling, and halftone dot shading. A classical Greek or Roman figure with curly hair and draped toga stands over a seated humanoid robot, gently opening the top of the robot's metallic skull like a lid, and inserting a small glowing microchip into its brain cavity. The robot has articulated mechanical joints at the shoulders, elbows, and fingers, and wears a rich purple-magenta draped cloth across its lap. Behind them are fragments of classical architecture — a column capital, an ornate ceremonial urn. The entire illustration is rendered in black and white linework with halftone dot textures on the metal surfaces. The background is a flat solid deep teal (#1A5C5C). The style evokes Victorian scientific illustrations merged with Renaissance allegory. No text. Aspect ratio 16:9.
```

## Prompt 3 — Editorial Portrait (Magenta)

```
A square editorial portrait illustration in the style of a 19th-century Victorian steel engraving with dense parallel hatching, cross-hatching, and fine stippling. A woman with long flowing hair is shown from the shoulders up, facing slightly to the left with a confident, contemplative expression. She wears small hoop earrings and a tailored blazer. Her features are rendered entirely in black and white linework with no solid fills — only hatching lines create the tonal values of skin, hair, and clothing. The background is a flat solid hot pink / magenta (#E84CB3) with very faint ghosted architectural silhouettes of government buildings, trees, and botanical elements barely visible through the color. The style evokes a Wall Street Journal hedcut portrait elevated to fine art engraving quality. No text. Aspect ratio 1:1.
```

## Prompt 4 — Symbolic Handshake (White)

```
A wide panoramic illustration in the style of a 19th-century Victorian steel engraving with dense cross-hatching, stippling, and halftone dot shading. A close-up of two hands locked in a firm handshake — the left hand is a human hand with natural skin texture rendered through fine crosshatched lines, wearing a rolled-up shirt sleeve. The right hand is a robotic mechanical hand with visible articulated metal joints, pistons, and plate armor segments at the wrist and fingers, wearing a smooth formal shirt cuff. The handshake is centered in the frame, shown in extreme horizontal crop. The entire illustration is rendered in pure black and white linework on a clean white background with no color accents. The style evokes 19th-century technical patent illustrations meets classical editorial engraving. No text. Aspect ratio 3:1 ultra-wide.
```

---

## Master Template

```
A [ASPECT] illustration in the style of a 19th-century Victorian steel engraving with dense cross-hatching, stippling, and halftone dot shading. [SCENE DESCRIPTION]. The entire illustration is rendered in black and white linework with halftone dot textures. The background is a flat solid [COLOR NAME] ([HEX CODE]). The style evokes [Gustave Doré / Victorian scientific illustration / Renaissance allegory]. No text. Aspect ratio [16:9 / 1:1 / 3:1].
```

## Background Colors

| Color          | Hex       | Use                                   |
|----------------|-----------|---------------------------------------|
| Golden Amber   | `#D4A017` | Innovation, origin stories            |
| Deep Teal      | `#1A5C5C` | AI/robotics, futurism                 |
| Hot Pink       | `#E84CB3` | People profiles, personal stories     |
| Pure White     | `#FFFFFF` | Symbolic, minimal compositions        |

## Usage

```bash
export GEMINI_API_KEY=your_key
./scripts/generate-blog-hero.sh --prompt "PROMPT" --ratio "16:9" output.png
```
