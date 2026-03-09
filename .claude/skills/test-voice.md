# /test-voice

Test the ElevenLabs voice output for a given insight text.

## prerequisites
- `ELEVENLABS_API_KEY` must be set in `.env.local`
- ElevenLabs MCP should be connected for voice browsing (optional but recommended)

## steps

1. Ask: provide insight text to test, or use a sample? If sample, use:
   > "the nine of cups reversed can point to a quiet restlessness — something achieved that doesn't feel like enough. today, notice where satisfaction keeps moving just out of reach."

2. Ask: which voice ID? If unknown, say "use ElevenLabs MCP to browse voices first — run `/mcp elevenlabs voices list` and pick one with a warm, unhurried register"

3. Call `/api/voice-insight` (POST) with:
   ```json
   { "text": "...", "voiceId": "..." }
   ```

4. If the route doesn't exist yet, note: "the voice API route hasn't been built yet — build it first at `app/api/voice-insight/route.ts`"

5. If audio returns, play it in the browser preview and describe how it sounds against the tone guidelines:
   - warm and unhurried ✓
   - not too fast or clipped ✗
   - intimate, not performative ✓

6. Suggest stability and similarity_boost adjustments if needed

## voice tone guidelines (from CLAUDE.md)
- slow, warm, slightly intimate — like a tarot reader, not an assistant
- only the `insight` field gets voiced by default
- the `keyPhrase` can optionally open the reading
- never voice the `action` text or transit details
