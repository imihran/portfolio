# 📘 AI in Analytics — Detailed Syllabus (Instructor Edition)

> The full teaching deliverable: per-session timed agendas, pre-work, materials, lab specifications, and assessment. Companion to the [high-level course overview](./AI%20in%20Analytics%20%E2%80%93%20Course%20Syllabus.md).
>
> **Instructor:** Mihran (Mish) Akopyan · **Version:** Draft 1 · **For:** Armenian Code Academy (ACA)

---

## Course Description

A workflow-first, hands-on course that integrates AI into every stage of the analyst's real pipeline — acquire → clean → explore → model → communicate → govern. Built for practicing data professionals, it emphasizes durable judgment ("where to delegate, verify, or stay hands-on"), reusable artifacts, and the verification discipline that real decisions demand.

## Prerequisites

- Working knowledge of **SQL** (joins, aggregations, subqueries/CTEs)
- Comfort **reading and writing basic Python** (functions, pandas at an introductory level)
- Day-to-day experience with a **BI / reporting tool** (e.g. Power BI, Tableau, Looker)
- No prior ML or AI experience required

## Learning Outcomes

On completing the course, participants can:

1. Decide when to use AI — and when not to — at each workflow stage
2. Write reliable, reproducible prompts and maintain a personal prompt library
3. Accelerate SQL/Python and data cleaning while verifying every generated artifact
4. Produce faster, deeper EDA and fact-checked, stakeholder-ready narratives
5. Stand up conversational (RAG/text-to-SQL) and basic predictive analytics with AI assistance
6. Apply governance, privacy, and ethics guardrails to AI-assisted work
7. Operate a personal, defensible, end-to-end AI-augmented analytics workflow

---

## Schedule Overview

4 weeks · 8 sessions · 2 sessions/week · 1.5–2 hrs each · cohort 20–25 · live, after 19:00 (AMT).

| Week | Session | Title | Phase |
|---|---|---|---|
| 1 | 1 | The AI-Augmented Analyst: Landscape & Mental Models | Foundations |
| 1 | 2 | Prompt Engineering for Analysts | Foundations |
| 2 | 3 | AI Pair-Programming for SQL & Python | Core acceleration |
| 2 | 4 | Automating Data Preparation & Cleaning | Core acceleration |
| 3 | 5 | AI-Assisted EDA, Insight Generation & Reporting | Core acceleration |
| 3 | 6 | Conversational Analytics: Chatting With Your Data | Expanding scope |
| 4 | 7 | Predictive & Advanced Analytics with AI Assistance | Expanding scope |
| 4 | 8 | Capstone, Governance & Ethics | Integration |

*Calendar dates are set with ACA once the cohort start is confirmed.*

---

## Tools & Setup (one-time, before Session 1)

Participants arrive with these ready so no class time is lost to setup:

- A general-purpose assistant with **code interpreter** (ChatGPT or Claude)
- **GitHub Copilot** (or equivalent) in their IDE/editor
- **Python 3.11+** with `pandas`, `numpy`, `matplotlib`, `scikit-learn`
- Access to their BI tool of choice; for B2B cohorts, the partner's standard stack
- The shared course dataset pack (distributed before Session 1)

A one-page setup checklist is sent on enrollment; an optional 30-min pre-course office hour resolves any environment issues.

---

## Session Plan Template

Each 90–120 min session follows the same rhythm so participants always know the shape of the class:

| Segment | Time | Purpose |
|---|---|---|
| **Recap & framing** | 0:00–0:10 | Connect to prior session; state today's outcome |
| **Concept** | 0:10–0:35 | The technique and its failure modes |
| **Live demo** | 0:35–1:05 | Instructor works a real example end-to-end |
| **Hands-on lab** | 1:05–1:45 | Participants apply it to a realistic task |
| **Debrief & wrap** | 1:45–2:00 | Share results, pitfalls, pre-work for next session |

---

## Detailed Session Plans

### Session 1 — The AI-Augmented Analyst: Landscape & Mental Models
**Pre-work:** none (course kickoff).
**Concept:** How LLMs, code assistants, and BI copilots actually work (enough to use them well); characteristic failure modes (hallucination, stale context, confident errors); a decision framework for *delegate to AI vs. do it yourself*.
**Live demo:** Walk one analytics task through the framework, narrating each "delegate / verify / do-it-myself" call.
**Lab:** Each participant maps their own current workflow and flags the 3 highest-leverage spots for AI.
**Deliverable:** A personal "AI-leverage map" of their workflow.
**Materials:** Slide deck, decision-framework one-pager, workflow-mapping template.

---

### Session 2 — Prompt Engineering for Analysts
**Pre-work:** Bring one real, recurring analytics request you handle.
**Concept:** Context-setting, role/format constraints, few-shot examples, structured (JSON/table) outputs; why reproducibility matters for analytics; anatomy of a reusable prompt.
**Live demo:** Turn a vague request into a precise, constrained prompt that returns a clean structured result; show how small changes alter reliability.
**Lab:** Convert your pre-work request into a reusable, parameterized prompt; add it to a personal prompt library.
**Deliverable:** First 2–3 entries in a personal prompt library.
**Materials:** Prompt-pattern cheatsheet, starter prompt-library template.

---

### Session 3 — AI Pair-Programming for SQL & Python
**Pre-work:** Bring (or use the provided) slow query or messy script.
**Concept:** Query generation from plain English, debugging, refactoring, dialect translation, documenting legacy code; the **verify-before-it-touches-production** discipline.
**Live demo:** Generate and optimize a multi-step query with an AI pair-programmer, then validate against ground truth.
**Lab:** Solve a multi-step SQL + pandas wrangling problem with AI assistance and verify the output.
**Deliverable:** A verified solution + a short note on what the AI got wrong and how it was caught.
**Materials:** Sample database/dataset, a verification checklist for generated code.

---

### Session 4 — Automating Data Preparation & Cleaning
**Pre-work:** Skim the provided messy dataset; note 3 quality issues you spot.
**Concept:** Profiling, detecting/fixing quality issues, standardizing categories, parsing unstructured text/columns; building **re-runnable** cleaning scripts vs. one-off fixes; where AI cleaning silently introduces errors.
**Live demo:** Profile a messy dataset with AI, generate a cleaning script, and re-run it on fresh data.
**Lab:** Take the messy dataset from raw to analysis-ready with an AI-assisted, re-runnable script.
**Deliverable:** A documented, re-runnable cleaning script + before/after data-quality summary.
**Materials:** Messy dataset, data-profiling prompt patterns.

---

### Session 5 — AI-Assisted EDA, Insight Generation & Reporting
**Pre-work:** Bring a dataset from your own domain (or use the shared one).
**Concept:** Code-interpreter EDA and visualization; drafting insight summaries, executive readouts, chart commentary; pushing past surface-level output to non-obvious insight; fact-checking every claim against the data.
**Live demo:** Run an AI-assisted EDA, then have AI draft a stakeholder summary — and catch an unsupported claim.
**Lab:** Produce a one-page stakeholder insight brief from an AI-assisted EDA.
**Deliverable:** A one-page, fact-checked insight brief.
**Materials:** EDA prompt patterns, an insight-brief template.

---

### Session 6 — Conversational Analytics: Chatting With Your Data
**Pre-work:** Read the short primer on RAG fundamentals.
**Concept:** BI copilots, text-to-SQL, code interpreters, and an intro to **RAG** for querying internal docs/metric definitions; where conversational analytics shines and where it quietly returns wrong answers.
**Live demo:** Stand up a simple "chat with your dataset/docs" flow and stress-test it with edge-case questions.
**Lab:** Build a basic chat-with-your-data workflow and document where it fails.
**Deliverable:** A working chat flow + an accuracy/limitations note.
**Materials:** RAG primer, a lightweight starter notebook/config.

---

### Session 7 — Predictive & Advanced Analytics with AI Assistance
**Pre-work:** Pick a prediction question relevant to your work.
**Concept:** AI-assisted forecasting, classification, segmentation, anomaly detection; framing the problem, generating modeling code, and **interpreting/sanity-checking responsibly**; recognizing the boundary where a specialist is needed.
**Live demo:** Frame a forecasting problem, generate the modeling code with AI, and critique the results.
**Lab:** Build and critically evaluate a simple forecast or classification model with AI assistance.
**Deliverable:** A model + a written critique of its validity and limits.
**Materials:** Sample dataset, a results-sanity-check checklist.

---

### Session 8 — Capstone, Governance & Ethics
**Pre-work:** Prepare a draft of your end-to-end workflow on a dataset of your choice.
**Concept:** Data privacy/confidentiality, bias, reproducibility, when AI output must *not* be trusted, communicating AI-assisted analysis with integrity.
**Live demo / format:** Short capstone presentations + structured peer and instructor feedback.
**Capstone:** Present an end-to-end AI-augmented analysis and the workflow you'll take back to work.
**Deliverable:** Capstone presentation + the documented personal workflow.
**Materials:** Governance & ethics checklist, capstone rubric (below).

---

## Assessment

The course is competency-based; emphasis is on the per-session deliverables and the capstone rather than exams.

| Component | Weight | What "good" looks like |
|---|---|---|
| Session deliverables (S1–S7) | 50% | Completed, with evidence of verification, not just AI output pasted in |
| Capstone presentation | 35% | Coherent end-to-end workflow; defensible choices; honest limits |
| Participation & peer feedback | 15% | Engaged in labs and debriefs; constructive critique |

### Capstone Rubric

| Criterion | Description |
|---|---|
| **Workflow completeness** | Covers acquire → clean → explore → model → communicate → govern |
| **Appropriate AI use** | Delegates where it helps; stays hands-on where it shouldn't delegate |
| **Verification** | Shows how AI outputs were checked; flags what was wrong |
| **Communication** | Clear stakeholder narrative; claims supported by data |
| **Governance** | Addresses privacy, reproducibility, and ethical considerations |

---

## Policies

- **Recordings & materials:** sessions recorded (where ACA permits) and shared with the cohort; all templates and prompt libraries are participants' to keep.
- **Data privacy:** participants must not bring confidential employer data into shared/third-party tools; synthetic or shared datasets are provided for all labs.
- **Tool changes:** the named tools may be substituted for equivalents; concepts transfer regardless.
- **Support:** asynchronous Q&A channel between sessions; optional office hours as scheduling allows.
