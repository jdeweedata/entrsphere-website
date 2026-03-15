#!/bin/bash
# Generate blog hero image using Gemini 3.1 Flash Image Preview API
# Usage: GEMINI_API_KEY=your_key ./scripts/generate-blog-hero.sh [options] [output_filename]
#   --prompt "your prompt"    Custom prompt (default: Never-done Machine)
#   --ratio  "16:9"           Aspect ratio: 16:9, 1:1, 3:1 (default: 16:9)

set -euo pipefail

# ── Parse args ──────────────────────────────────────────────────────────────
CUSTOM_PROMPT=""
ASPECT_RATIO="16:9"
OUTPUT_FILE=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --prompt) CUSTOM_PROMPT="$2"; shift 2 ;;
    --ratio)  ASPECT_RATIO="$2"; shift 2 ;;
    *)        OUTPUT_FILE="$1"; shift ;;
  esac
done

OUTPUT_FILE="${OUTPUT_FILE:-blog_hero_$(date +%Y%m%d_%H%M%S).png}"

# ── Config ──────────────────────────────────────────────────────────────────
MODEL="gemini-3.1-flash-image-preview"
API_URL="https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent"

if [[ -z "${GEMINI_API_KEY:-}" ]]; then
  echo "❌ Error: GEMINI_API_KEY environment variable is not set."
  echo "   Set it with: export GEMINI_API_KEY=your_api_key"
  echo "   Get a key at: https://aistudio.google.com/apikey"
  exit 1
fi

# ── Prompt ──────────────────────────────────────────────────────────────────
if [[ -n "$CUSTOM_PROMPT" ]]; then
  PROMPT="$CUSTOM_PROMPT"
else
  PROMPT='A wide panoramic illustration in the style of a 19th-century Victorian steel engraving with dense cross-hatching, stippling, and halftone dot shading. Two figures in Renaissance-era clothing, seen from behind, stand at the entrance of a grand neoclassical courtyard with towering Corinthian columns, stone arches, a geometric tiled floor, and tall cypress trees in the distance. A church bell tower is visible on the horizon. On the right side of the courtyard sits early industrial machinery — a printing press and a mechanical device. The entire illustration is rendered in black and white linework with a flat solid golden amber sky filling the background. The style evokes Gustave Doré or Giovanni Battista Piranesi engravings. No text.'
fi

echo "🎨 Generating image with Gemini ${MODEL}..."
echo "   Ratio: ${ASPECT_RATIO}"
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
        \"aspectRatio\": \"${ASPECT_RATIO}\",
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
echo "📐 Aspect ratio: ${ASPECT_RATIO}"
echo "📏 Resolution: 2K"
