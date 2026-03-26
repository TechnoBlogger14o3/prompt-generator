/**
 * Optional refinement via a small LLM using an OpenAI-compatible Chat Completions API.
 * Typical setups: Ollama (http://localhost:11434/v1), Groq, OpenAI, Azure OpenAI, etc.
 *
 * Configure with Vite env (see .env.example). If VITE_LLM_BASE_URL is unset, enhancement is skipped.
 *
 * Security: API keys in Vite are exposed to the browser. Use localhost/Ollama for dev,
 * or a backend proxy in production if you need a secret key.
 */

export function isLlmConfigured() {
  const url = import.meta.env.VITE_LLM_BASE_URL;
  return Boolean(url && String(url).trim());
}

function stripJsonFence(text) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

/**
 * @param {object} params
 * @param {string} params.problem
 * @param {string} params.promptTypeLabel
 * @param {string} params.tone
 * @param {string} params.draftSystem
 * @param {string} params.draftUser
 * @returns {Promise<{ system: string, prompt: string }>}
 */
export async function enhancePromptWithSmallLlm({
  problem,
  promptTypeLabel,
  tone,
  draftSystem,
  draftUser
}) {
  const baseUrl = String(import.meta.env.VITE_LLM_BASE_URL || '')
    .trim()
    .replace(/\/$/, '');
  const model = import.meta.env.VITE_LLM_MODEL || 'llama3.2';
  const apiKey = import.meta.env.VITE_LLM_API_KEY || '';

  if (!baseUrl) {
    throw new Error('VITE_LLM_BASE_URL is not set');
  }

  const metaSystem = `You are an expert prompt engineer. Improve the draft system and user prompts for a ChatGPT-style assistant.

Rules:
- Preserve the user's goal and the same general task category.
- Make instructions specific, actionable, and free of vague filler.
- "system" = assistant role and constraints; "prompt" = the main user message to send.
- Output must be valid JSON only, with exactly two string keys: "system" and "prompt".
- No markdown code fences, no commentary outside JSON.`;

  const payload = JSON.stringify(
    {
      user_goal: problem,
      prompt_category: promptTypeLabel,
      tone,
      draft_system: draftSystem,
      draft_user: draftUser
    },
    null,
    0
  );

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: metaSystem },
        { role: 'user', content: payload }
      ]
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`LLM HTTP ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content?.trim();
  if (!raw) {
    throw new Error('Empty LLM response');
  }

  let parsed;
  try {
    parsed = JSON.parse(stripJsonFence(raw));
  } catch {
    throw new Error('LLM did not return valid JSON');
  }

  if (typeof parsed.system !== 'string' || typeof parsed.prompt !== 'string') {
    throw new Error('LLM JSON must include string fields "system" and "prompt"');
  }

  return {
    system: parsed.system.trim(),
    prompt: parsed.prompt.trim()
  };
}
