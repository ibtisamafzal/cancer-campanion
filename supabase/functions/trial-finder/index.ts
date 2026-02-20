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
    const { summary } = await req.json();

    if (!summary) {
      return new Response(JSON.stringify({ error: "Summary is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const AIMLAPI_API_KEY = Deno.env.get("AIMLAPI_API_KEY");
    if (!AIMLAPI_API_KEY) throw new Error("AIMLAPI_API_KEY not configured");

    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
    // ElevenLabs removed — TTS is now on-demand via tts-generate

    // ── Step 1: Extract structured patient profile ──
    console.log("Step 1: Extracting patient profile...");
    const profileRes = await fetch(
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
              content: `You are a clinical trials matching AI. Extract a structured patient profile from the oncology summary. Be precise about cancer type, stage, biomarkers, and prior treatments.`,
            },
            { role: "user", content: summary },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "extract_profile",
                description: "Extract structured patient profile for trial matching",
                parameters: {
                  type: "object",
                  properties: {
                    cancerType: { type: "string" },
                    cancerSubtype: { type: "string" },
                    stage: { type: "string" },
                    biomarkers: { type: "array", items: { type: "string" } },
                    priorTreatments: { type: "array", items: { type: "string" } },
                    age: { type: "number" },
                    sex: { type: "string" },
                    currentStatus: { type: "string" },
                    searchTerms: { type: "array", items: { type: "string" } },
                  },
                  required: ["cancerType", "stage", "searchTerms"],
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "extract_profile" } },
        }),
      }
    );

    if (!profileRes.ok) {
      const t = await profileRes.text();
      console.error("Profile extraction error:", profileRes.status, t);
      throw new Error(`Profile extraction failed: ${profileRes.status}`);
    }

    const profileData = await profileRes.json();
    const toolCall = profileData.choices?.[0]?.message?.tool_calls?.[0];
    const profile = toolCall
      ? JSON.parse(toolCall.function.arguments)
      : { cancerType: "cancer", stage: "unknown", searchTerms: [summary.slice(0, 80)] };

    console.log("Profile extracted:", JSON.stringify(profile));

    // ── Step 2: Search for trials via Firecrawl ──
    console.log("Step 2: Searching for clinical trials...");
    let trialResults: any[] = [];
    if (FIRECRAWL_API_KEY) {
      try {
        const searchQuery = `${profile.cancerType} ${profile.stage} ${(profile.biomarkers || []).join(" ")} clinical trial recruiting site:clinicaltrials.gov`;
        const fcRes = await fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: searchQuery, limit: 8 }),
        });
        if (fcRes.ok) {
          const fcData = await fcRes.json();
          trialResults = (fcData.data || []).map((r: any) => ({
            title: r.title || "",
            url: r.url || "",
            description: r.description || "",
            markdown: r.markdown || "",
          }));
        } else {
          console.error("Firecrawl error:", fcRes.status, await fcRes.text());
        }
      } catch (e) {
        console.error("Firecrawl failed:", e);
      }
    }

    // ── Step 3: Perplexity — deeper trial search ──
    console.log("Step 3: Getting trial context from Perplexity...");
    let perplexityTrials = "";
    if (PERPLEXITY_API_KEY) {
      try {
        const pplxRes = await fetch("https://api.perplexity.ai/chat/completions", {
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
                content: "You are a clinical trials research assistant. Find currently recruiting clinical trials and provide details including NCT IDs, locations, and eligibility criteria. Be specific and factual.",
              },
              {
                role: "user",
                content: `Find currently recruiting clinical trials for: ${profile.cancerType}, ${profile.stage}${profile.biomarkers?.length ? `, biomarkers: ${profile.biomarkers.join(", ")}` : ""}. Patient is ${profile.age || "adult"} years old. Prior treatments: ${(profile.priorTreatments || []).join(", ") || "none listed"}.`,
              },
            ],
          }),
        });
        if (pplxRes.ok) {
          const pplxData = await pplxRes.json();
          perplexityTrials = pplxData.choices?.[0]?.message?.content || "";
        } else {
          console.error("Perplexity error:", pplxRes.status, await pplxRes.text());
        }
      } catch (e) {
        console.error("Perplexity failed:", e);
      }
    }

    // ── Step 4: Synthesize trials + generate doctor questions ──
    console.log("Step 4: Synthesizing trial matches...");
    const synthesisInput = `
Patient Profile: ${JSON.stringify(profile)}

Firecrawl Results (from ClinicalTrials.gov):
${trialResults.map((r) => `- ${r.title}\n  URL: ${r.url}\n  ${r.description}`).join("\n\n")}

Perplexity Research:
${perplexityTrials}
    `.trim();

    const synthesisRes = await fetch(
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
              content: `You are a clinical trials matching expert. Given a patient profile and search results, produce:
1. A list of best matching trials with eligibility assessment
2. For EACH trial, write 2-3 specific questions the patient should ask their oncologist about that trial
3. Write an overall emotional support message (2-3 sentences, warm and encouraging)
4. Write a "what to do next" action plan (3-5 concrete steps)

Be compassionate and clear. If you can extract an NCT ID from the data, include it.`,
            },
            { role: "user", content: synthesisInput },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "return_trials",
                description: "Return matched clinical trials with enhanced data",
                parameters: {
                  type: "object",
                  properties: {
                    trials: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          title: { type: "string" },
                          location: { type: "string" },
                          phone: { type: "string" },
                          status: { type: "string" },
                          matchScore: { type: "number" },
                          eligibility: { type: "string" },
                          requirements: { type: "array", items: { type: "string" } },
                          url: { type: "string" },
                          doctorQuestions: { type: "array", items: { type: "string" }, description: "2-3 questions to ask the oncologist about this trial" },
                        },
                        required: ["id", "title", "matchScore", "eligibility", "requirements", "doctorQuestions"],
                      },
                    },
                    summary: { type: "string" },
                    emotionalMessage: { type: "string", description: "Warm, empathetic message for the patient" },
                    nextSteps: { type: "array", items: { type: "string" }, description: "Concrete action steps" },
                  },
                  required: ["trials", "summary", "emotionalMessage", "nextSteps"],
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "return_trials" } },
        }),
      }
    );

    if (!synthesisRes.ok) {
      const t = await synthesisRes.text();
      console.error("Synthesis error:", synthesisRes.status, t);
      throw new Error(`Trial synthesis failed: ${synthesisRes.status}`);
    }

    const synthesisData = await synthesisRes.json();
    const synthesisCall = synthesisData.choices?.[0]?.message?.tool_calls?.[0];
    const matchedData = synthesisCall
      ? JSON.parse(synthesisCall.function.arguments)
      : { trials: [], summary: "Unable to find matching trials.", emotionalMessage: "", nextSteps: [] };

    console.log(`Found ${matchedData.trials.length} matched trials`);

    // Audio is now generated on-demand via tts-generate edge function

    const result = {
      trials: matchedData.trials,
      summary: matchedData.summary,
      emotionalMessage: matchedData.emotionalMessage,
      nextSteps: matchedData.nextSteps,
      profile,
    };

    console.log("Trial finder complete!");
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("trial-finder error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";

    if (msg.includes("429") || msg.includes("rate limit")) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
