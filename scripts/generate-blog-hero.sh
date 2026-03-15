#!/bin/bash
# Generate blog hero image using Gemini 3.1 Flash Image Preview API
# Usage: GEMINI_API_KEY=your_key ./scripts/generate-blog-hero.sh [output_filename]

set -euo pipefail

# ── Config ──────────────────────────────────────────────────────────────────
MODEL="gemini-3.1-flash-image-preview"
API_URL="https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent"
OUTPUT_FILE="${1:-blog_hero_$(date +%Y%m%d_%H%M%S).png}"

if [[ -z "${GEMINI_API_KEY:-}" ]]; then
  echo "❌ Error: GEMINI_API_KEY environment variable is not set."
  echo "   Set it with: export GEMINI_API_KEY=your_api_key"
  echo "   Get a key at: https://aistudio.google.com/apikey"
  exit 1
fi

# ── Prompt ──────────────────────────────────────────────────────────────────
PROMPT='Editorial illustration for a tech blog article titled "The Never-done Machine". Wide-format banner image. The concept shows a surreal, Escher-like perpetual motion machine made of interconnected gears, conveyor belts, and digital screens, with small human figures working alongside AI robot assistants in a never-ending loop. The machine wraps around itself impossibly, suggesting work that never finishes. Style: modern editorial illustration, flat geometric shapes with subtle gradients, muted color palette of deep navy blue, warm amber/orange, soft lavender purple, and cream white. Clean lines, sophisticated composition. The aesthetic is premium, intellectual, and slightly whimsical — like a New Yorker or Monocle magazine illustration. No text overlays.'

echo "🎨 Generating blog hero image with Gemini ${MODEL}..."
echo "   Prompt: ${PROMPT:0:80}..."
echo ""

# ── API Call ────────────────────────────────────────────────────────────────
RESPONSE=$(curl -s -X POST "${API_URL}" \
  -H "x-goog-api-key: ${GEMINI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"contents\": [{
      \"parts\": [
        {\"text\": $(echo "$PROMPT" | jq -Rs .)}
      ]
    }],
    \"generationConfig\": {
      \"responseModalities\": [\"Image\"],
      \"imageConfig\": {
        \"aspectRatio\": \"16:9\",
        \"imageSize\": \"2K\"
      }
    }
  }")

# ── Check for errors ───────────────────────────────────────────────────────
if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
  echo "❌ API Error:"
  echo "$RESPONSE" | jq '.error'
  exit 1
fi

# ── Extract and save image ─────────────────────────────────────────────────
IMAGE_DATA=$(echo "$RESPONSE" | jq -r '.candidates[0].content.parts[] | select(.inlineData) | .inlineData.data' 2>/dev/null)

if [[ -z "$IMAGE_DATA" || "$IMAGE_DATA" == "null" ]]; then
  echo "❌ No image data found in response."
  echo "   Full response:"
  echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
  exit 1
fi

echo "$IMAGE_DATA" | base64 -d > "$OUTPUT_FILE"

FILE_SIZE=$(stat -c%s "$OUTPUT_FILE" 2>/dev/null || stat -f%z "$OUTPUT_FILE" 2>/dev/null)
echo "✅ Image saved to: $OUTPUT_FILE ($(( FILE_SIZE / 1024 )) KB)"
echo ""
echo "📐 Aspect ratio: 16:9 (wide banner)"
echo "📏 Resolution: 2K"
