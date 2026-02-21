### Project name
Cancer Companion: Patient-Centered Oncology Support with HAI-DEF Models

### Your team
GenAI Innovators
- Product & UX: Patient journey design, interface and accessibility
- AI Engineering: Prompt pipelines, model orchestration, response structuring
- Full-stack Engineering: React frontend, Supabase edge functions, deployment

### Problem statement
Cancer care information is hard to understand at the exact moment patients need clarity most. Clinical reports are technical, treatment regimens are overwhelming, and clinical trial eligibility is difficult to navigate without specialist support. This creates preventable anxiety, delayed decision-making, and reduced confidence in care planning.

Cancer Companion addresses this with a patient-first AI workflow that converts complex oncology information into actionable, emotionally supportive guidance. The primary users are patients and caregivers, with secondary value for care teams who need better-informed discussions during visits.

Expected impact:
- Improved patient comprehension of reports and treatment steps
- Better visit preparation via structured doctor questions and next actions
- Faster initial trial exploration for eligible patients
- More accessible guidance through optional audio briefings

### Overall solution:
Cancer Companion is a 3-module application:

1) ScanReader (report understanding)
- Converts radiology/pathology findings into plain language
- Extracts key terms, definitions, and suggested clinician questions

2) TrialFinder (clinical trial matching)
- Structures patient oncology summaries
- Searches and ranks potentially relevant trials
- Produces eligibility rationale, oncologist questions, and next-step plan

3) TreatmentNavigator (cycle guidance)
- Converts chemotherapy regimen into day-by-day guidance
- Surfaces side-effect expectations and practical management tips
- Highlights safety alerts for escalation

Mandatory HAI-DEF usage:
- At least one HAI-DEF model (MedGemma or another HAI-DEF model) is used for core medical reasoning tasks in production flow.
- In our final stack, the HAI-DEF model powers structured clinical summarization and patient-facing explanation generation.

Why HAI-DEF is essential:
- Domain-specific medical reasoning and terminology handling
- Better alignment to healthcare use cases than generic assistants
- Open-weight flexibility for deployment and adaptation

### Technical details
Architecture:
- Frontend: React + TypeScript + Tailwind + shadcn/ui
- Backend: Supabase Edge Functions
- Modules:
  - treatment-navigator
  - trial-finder
  - tts-generate

Pipeline (high-level):
1. Input capture (regimen/report/patient summary)
2. Structured extraction and normalization
3. HAI-DEF model inference for medical interpretation
4. Retrieval-assisted enrichment from trusted external sources
5. Response formatting into patient-safe output sections
6. Optional text-to-speech briefing for accessibility

Product feasibility:
- Real-time web app with modular architecture
- Function-level isolation for easier debugging and deployment
- Practical UX for immediate patient use (clear sections, progressive disclosure)
- Supports extension toward edge/offline inference in future versions

Safety and limitations:
- Explicit disclaimer: informational support, not medical diagnosis
- Encourages clinician confirmation for all treatment decisions
- Provides escalation prompts when concerning symptoms appear
- Current validation is qualitative demo-level and not a clinical trial

Reproducibility:
- Public source code repository: [ADD GITHUB LINK]
- Deployment and environment setup documented in repository README
- Supabase function configuration and required secrets documented

Video demo (required, <=3 minutes):
[ADD VIDEO LINK]

Live demo (bonus):
[ADD LIVE DEMO LINK]

Open-weight model artifact (bonus):
[ADD HUGGING FACE MODEL/SPACE LINK]

What we learned:
- Patient trust improves when guidance combines clarity + empathy + actionability
- Structured outputs improve usability compared with long free-form responses
- Accessibility features (audio briefings) are especially valuable in high-stress contexts

Next steps:
- Broaden regimen/report coverage and multilingual support
- Add benchmarked clinical QA evaluations with expert review
- Expand edge-ready deployment profile for low-connectivity settings
- Conduct pilot usability testing with patients/caregivers
