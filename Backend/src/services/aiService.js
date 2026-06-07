import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import config from "../config/config.js";

// 🔥 1. Schema validation (no StructuredOutputParser)
const schema = z.object({
  summary: z.string(),
  rootCause: z.string(),
  suggestion: z.string()
});

// 🔥 2. Groq model (stable + working)
const model = new ChatGroq({
  model: "llama-3.1-8b-instant",
  temperature: 0.2,
  apiKey: config.GROQ_API_KEY
});

// 🔥 3. Clean logs
const shapeLogs = (logs = []) =>
  logs.map(l => ({
    status: l.status,
    statusCode: l.statusCode,
    responseTime: l.responseTime,
    error: l.errorMessage || null,
    time: l.createdAt
  }));

// 🔥 4. Prompt (FIXED: escaped braces)
const prompt = ChatPromptTemplate.fromTemplate(`
You are a backend monitoring expert.

URL: {url}
Method: {method}

Recent logs:
{recentLogs}

Previous logs:
{previousLogs}

Instructions:
- Detect patterns (timeouts, latency spikes, failures)
- Explain root cause in 1 sentence
- Suggest one actionable fix

CRITICAL:
Return ONLY valid JSON in this format:

{{
  "summary": "...",
  "rootCause": "...",
  "suggestion": "..."
}}

Do NOT include:
- markdown
- explanations
- schema
- extra text
`);

// 🔥 5. Safe JSON extractor (handles messy LLaMA output)
const extractJSON = (text) => {
  const matches = text.match(/\{[\s\S]*?\}/g);
  if (!matches) throw new Error("No JSON found");

  // try parsing from last block (most likely correct)
  for (let i = matches.length - 1; i >= 0; i--) {
    try {
      return JSON.parse(matches[i]);
    } catch {
      continue;
    }
  }

  throw new Error("No valid JSON parsed");
};

// 🔥 6. Main function
export const generateSummary = async ({
  url,
  method,
  recentLogs,
  previousLogs
}) => {
  try {
    const formattedPrompt = await prompt.format({
      url,
      method,
      recentLogs: JSON.stringify(shapeLogs(recentLogs), null, 2),
      previousLogs: JSON.stringify(shapeLogs(previousLogs), null, 2)
    });

    // ✅ IMPORTANT: pass string, NOT array
    const response = await model.invoke(formattedPrompt);

    // 🔥 Extract + validate
    const json = extractJSON(response.content);
    const result = schema.parse(json);

    return result;

  } catch (err) {
    console.error("Groq AI Error:", err.message);

    return {
      summary: "Issue detected",
      rootCause: "AI unavailable",
      suggestion: "Check logs manually"
    };
  }
};