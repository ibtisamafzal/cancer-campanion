import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { regimen } = await req.json();
    if (!regimen) {
      return new Response(JSON.stringify({ error: "Regimen is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const AIMLAPI_API_KEY = Deno.env.get("AIMLAPI_API_KEY");
    if (!AIMLAPI_API_KEY) throw new Error("AIMLAPI_API_KEY not configured");
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
    // ElevenLabs removed — TTS is now on-demand via tts-generate

    // ── Step 1: AIML API — analyse regimen ──
    console.log("Step 1: Analyzing regimen with AIML API...");
    const geminiRes = await fetch(
      "https://api.aimlapi.com/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIMLAPI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a medical AI assistant. Given a chemotherapy regimen, extract:
1. Drug names (generic)
2. Cycle length in days
3. Common side effects per drug
4. Key medical considerations
Return valid JSON: { "drugs": [{"name":"...","commonSideEffects":["..."]}], "cycleDays": number, "considerations": ["..."] }`,
            },
            { role: "user", content: regimen },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "extract_regimen",
                description: "Extract structured regimen data",
                parameters: {
                  type: "object",
                  properties: {
                    drugs: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          commonSideEffects: {
                            type: "array",
                            items: { type: "string" },
                          },
                        },
                        required: ["name", "commonSideEffects"],
                      },
                    },
                    cycleDays: { type: "number" },
                    considerations: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                  required: ["drugs", "cycleDays", "considerations"],
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "extract_regimen" },
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const t = await geminiRes.text();
      console.error("Gemini error:", geminiRes.status, t);
      throw new Error(`Gemini failed: ${geminiRes.status}`);
    }

    const geminiData = await geminiRes.json();
    const toolCall = geminiData.choices?.[0]?.message?.tool_calls?.[0];
    const regimenData = toolCall
      ? JSON.parse(toolCall.function.arguments)
      : { drugs: [], cycleDays: 14, considerations: [] };

    console.log("Regimen parsed:", JSON.stringify(regimenData));

    // ── Step 2: AIML API — generate day-by-day guide ──
    console.log("Step 2: Generating day-by-day guide with AIML API...");
    let timeline: any[] = [];
    if (AIMLAPI_API_KEY) {
      try {
        const aimlRes = await fetch("https://api.aimlapi.com/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AIMLAPI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-3-7-sonnet-20250219",
            messages: [
              {
                role: "system",
                content: `You are a compassionate oncology support AI. Given a chemo regimen analysis, create a patient-friendly day-by-day timeline.
Return valid JSON array: [{ "day": "1", "phase": "Infusion Day", "tips": ["..."], "sideEffects": ["..."], "alert": null | "string" }]
Cover the full cycle. Group days where appropriate (e.g. "4-7"). Use warm, encouraging language. Include when to call the doctor. Return ONLY the JSON, no other text.`,
              },
              {
                role: "user",
                content: `Regimen: ${regimen}\nAnalysis: ${JSON.stringify(regimenData)}`,
              },
            ],
          }),
        });
        if (aimlRes.ok) {
          const aimlData = await aimlRes.json();
          const content = aimlData.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            timeline = parsed.timeline || parsed.days || parsed || [];
            if (!Array.isArray(timeline)) timeline = [];
          }
        } else {
          console.error("AIML error:", aimlRes.status, await aimlRes.text());
        }
      } catch (e) {
        console.error("AIML failed:", e);
      }
    }

    // Fallback: use AIML API for timeline
    if (timeline.length === 0) {
      console.log("Falling back to AIML API for timeline...");
      const fallbackRes = await fetch(
        "https://api.aimlapi.com/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AIMLAPI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: `You are a compassionate oncology support AI. Create a patient-friendly day-by-day timeline for a chemo cycle.
Return ONLY a JSON array: [{ "day": "1", "phase": "Infusion Day", "tips": ["..."], "sideEffects": ["..."], "alert": null | "string" }]
Cover the full cycle. Group days where appropriate. Use warm, encouraging language. Include when to call the doctor.`,
              },
              {
                role: "user",
                content: `Regimen: ${regimen}\nAnalysis: ${JSON.stringify(regimenData)}`,
              },
            ],
          }),
        }
      );
      if (fallbackRes.ok) {
        const fbData = await fallbackRes.json();
        const fbContent = fbData.choices?.[0]?.message?.content || "";
        try {
          const cleaned = fbContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          const parsed = JSON.parse(cleaned);
          timeline = Array.isArray(parsed) ? parsed : parsed.timeline || parsed.days || [];
        } catch {
          console.error("Failed to parse Gemini timeline");
        }
      }
    }

    // ── Step 3: Firecrawl — scrape FDA drug labels ──
    console.log("Step 3: Scraping FDA drug info...");
    let fdaInfo: any[] = [];
    if (FIRECRAWL_API_KEY && regimenData.drugs?.length > 0) {
      try {
        const drugNames = regimenData.drugs.map((d: any) => d.name).join(" ");
        const fcRes = await fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `${drugNames} chemotherapy side effects management site:cancer.gov OR site:drugs.com`,
            limit: 3,
          }),
        });
        if (fcRes.ok) {
          const fcData = await fcRes.json();
          fdaInfo = (fcData.data || []).map((r: any) => ({
            title: r.title,
            url: r.url,
            description: r.description,
          }));
        }
      } catch (e) {
        console.error("Firecrawl failed:", e);
      }
    }

    // ── Step 4: Perplexity — side effect management tips ──
    console.log("Step 4: Getting management tips from Perplexity...");
    let managementTips = "";
    if (PERPLEXITY_API_KEY) {
      try {
        const pplxRes = await fetch(
          "https://api.perplexity.ai/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "sonar",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a medical research assistant. Provide evidence-based, patient-friendly side effect management strategies. Be concise and practical.",
                },
                {
                  role: "user",
                  content: `What are the best evidence-based strategies for managing side effects of ${regimen}? Include nutrition tips, when to seek emergency care, and practical daily advice.`,
                },
              ],
            }),
          }
        );
        if (pplxRes.ok) {
          const pplxData = await pplxRes.json();
          managementTips =
            pplxData.choices?.[0]?.message?.content || "";
        }
      } catch (e) {
        console.error("Perplexity failed:", e);
      }
    }

    // Audio is now generated on-demand via tts-generate edge function

    // ── Build interactions from considerations ──
    const interactions = (regimenData.considerations || []).map(
      (c: string, i: number) => ({
        severity: i === 0 ? "warning" : "info",
        message: c,
      })
    );

    // Add drug side-effect notes
    for (const drug of regimenData.drugs || []) {
      interactions.push({
        severity: "info",
        message: `${drug.name}: Common side effects include ${drug.commonSideEffects.slice(0, 3).join(", ")}.`,
      });
    }

    const result = {
      timeline,
      interactions,
      fdaResources: fdaInfo,
      managementTips,
      regimenData,
    };

    console.log("Treatment navigator complete!");
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("treatment-navigator error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
