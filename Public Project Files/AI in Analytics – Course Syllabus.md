# 🎓 AI in Analytics — Course Syllabus & Pedagogical Vision

> A 4-week, 8-session instructor-led course designed to make **already-skilled analysts** dramatically faster and more ambitious by treating AI as a co-analyst inside their existing workflow.
>
> *Authored as a draft syllabus for an instructor role at the [Armenian Code Academy (ACA)](https://aca.am).*

---

## 🎯 Overview

The role of the data professional is being rewritten by AI. The analysts who win the next decade won't be the ones who *resist* these tools or the ones who *blindly trust* them — they'll be the ones who know exactly **where to delegate to AI, where to verify it, and where to stay hands-on.**

This course is built for that outcome. It is **not** an "intro to machine learning" course and it is **not** a tour of trendy apps. It is a workflow-first program that slots AI into every stage of the real analytics pipeline — acquire → clean → explore → model → communicate → govern — so participants leave with a personal, defensible, AI-augmented way of working they can use the next morning at their job.

---

## 👥 Target Audience

Practicing data professionals who already know their craft and want to compound it with AI:

- Data Analysts & Business Intelligence (BI) Analysts
- Data Scientists
- Analytics Managers and analytics-adjacent product/ops roles

**Assumed prerequisites:** working knowledge of SQL, comfort reading/writing basic Python, and day-to-day experience with a BI or reporting tool. No prior ML or AI experience required.

---

## 🗓️ Format & Logistics

| Parameter | Detail |
|---|---|
| **Duration** | 1 month |
| **Sessions** | 8 total · 2 per week |
| **Session length** | 1.5–2 hours |
| **Weekly workload** | 4–5 hours of live sessions + light between-session practice |
| **Cohort size** | 20–25 participants |
| **Delivery** | Live, instructor-led, hands-on |
| **Markets** | Adaptable for B2C (individual upskilling) and B2B (tailored corporate cohorts) |

---

## 🧠 Pedagogical Vision

Three principles run through every single session:

### 1. Workflow-first, not tool-first
We organize learning around the analyst's real pipeline and slot AI techniques into each stage. **Tools will change; the judgment about where they belong won't.** This keeps the course durable as the AI landscape shifts month to month.

### 2. Every session ships something
Each class ends with a hands-on exercise applied to a realistic analytics task. Participants don't just *hear* about a technique — they walk away with reusable prompts, scripts, and patterns added to a growing personal toolkit.

### 3. Trust, but verify
Because these are professionals making real decisions on real data, **hallucination, reproducibility, data privacy, and result validation are treated as core skills, not footnotes.** Participants learn to defend any AI-assisted output to a skeptical stakeholder — which is exactly what their jobs will demand.

> **The capstone deliverable:** by the final session, each participant has assembled an end-to-end, AI-augmented analytics workflow on a dataset of their choice — and can explain and defend every step of it.

---

## 📚 The 8 Sessions

### Session 1 — The AI-Augmented Analyst: Landscape & Mental Models
*Foundations*

Where AI genuinely fits in the modern data workflow — and where it doesn't. A practical (not academic) mental model of how LLMs, code assistants, and BI copilots actually work, their characteristic failure modes, and a clear decision framework for **"delegate to AI vs. do it yourself."** Sets the cost/benefit lens used for the rest of the course.

- **Learning objectives:** Articulate the strengths/limits of current AI tools for analytics; identify high-leverage delegation points; establish a personal AI-use decision rule.
- **Hands-on:** Map your own current workflow and flag the 3 highest-leverage spots for AI.

---

### Session 2 — Prompt Engineering for Analysts: Reliable, Reproducible Outputs
*Foundations*

Prompting techniques tuned specifically for data work: context-setting, role and format constraints, few-shot examples, and structured (JSON/table) outputs. Why analytics prompts must be **reproducible**, and how to build a reusable prompt library for recurring tasks instead of reinventing the wheel each time.

- **Learning objectives:** Write precise, constrained prompts that return structured, repeatable results; build a personal prompt library; recognize when prompt quality is the bottleneck.
- **Hands-on:** Turn a vague stakeholder ask into a precise, reusable prompt that returns a clean, structured result.

---

### Session 3 — AI Pair-Programming for SQL & Python
*Core acceleration*

Using AI assistants to write, debug, refactor, and explain SQL and Python faster: query generation from plain English, optimizing slow queries, translating between SQL dialects, and documenting legacy code. Heavy emphasis on **verifying generated code before it touches production data.**

- **Learning objectives:** Accelerate query and script writing with AI pair-programming; debug and refactor confidently; build a verification habit for generated code.
- **Hands-on:** Solve a multi-step SQL + pandas wrangling problem with an AI pair-programmer, then validate the result against ground truth.

---

### Session 4 — Automating Data Preparation & Cleaning
*Core acceleration*

Delegating the most repetitive part of the job. Profiling messy datasets, detecting and fixing quality issues, standardizing categories, parsing unstructured text and columns, and generating **reusable cleaning scripts** — building lightweight, repeatable prep pipelines instead of one-off manual fixes.

- **Learning objectives:** Use AI to profile and clean messy data; convert ad-hoc cleaning into repeatable scripts; spot where AI cleaning can silently introduce errors.
- **Hands-on:** Take a deliberately messy dataset from raw to analysis-ready with an AI-assisted, re-runnable cleaning script.

---

### Session 5 — AI-Assisted EDA, Insight Generation & Reporting
*Core acceleration*

From data to narrative. Using code-interpreter tools to explore, visualize, and surface patterns, then having AI draft the insight summary, the executive readout, and the chart commentary. How to push **past surface-level AI output to genuine, non-obvious insight** — and how to fact-check every claim against the data.

- **Learning objectives:** Run faster, deeper EDA with AI; generate stakeholder-ready narratives; critically validate AI-generated claims.
- **Hands-on:** Run an AI-assisted EDA on a real dataset and produce a one-page stakeholder insight brief.

---

### Session 6 — Conversational Analytics: Chatting With Your Data
*Expanding scope*

Letting stakeholders (and analysts) ask questions in natural language. BI copilots, text-to-SQL, code interpreters, and an introduction to **RAG (retrieval-augmented generation)** for querying internal documents and metric definitions. Where conversational analytics shines — and where it quietly returns wrong answers.

- **Learning objectives:** Set up a "chat with your data" workflow; understand RAG fundamentals; stress-test conversational systems for accuracy and trust.
- **Hands-on:** Build a simple "chat with your dataset/docs" workflow and stress-test it for accuracy.

---

### Session 7 — Predictive & Advanced Analytics with AI Assistance
*Expanding scope*

Reaching into capabilities that used to require a dedicated data scientist. AI-assisted forecasting, classification, segmentation, and anomaly detection — framing the problem, generating the modeling code, and **interpreting and sanity-checking results responsibly.** Knowing the limits, and when to bring in a specialist.

- **Learning objectives:** Frame and execute a basic predictive task with AI help; interpret results critically; recognize the boundary where specialist expertise is required.
- **Hands-on:** Build and critically evaluate a simple forecast or classification model with AI assistance.

---

### Session 8 — Capstone: Your AI-Augmented Workflow, Governance & Ethics
*Integration*

Participants assemble the course's techniques into an **end-to-end, AI-augmented workflow** on a dataset of their choice and present it. We close on the professional guardrails that separate a power user from a liability: data privacy and confidentiality, bias, reproducibility, when AI output must *not* be trusted, and how to communicate AI-assisted analysis with integrity.

- **Learning objectives:** Integrate the full course into a coherent personal workflow; apply governance and ethics guardrails; communicate AI-assisted work credibly.
- **Capstone:** Present an end-to-end AI-augmented analysis and the workflow you'll take back to work.

---

## 🧭 Course Arc at a Glance

| Sessions | Phase | Focus |
|---|---|---|
| **1–2** | Foundations | Mental models + prompting — the bedrock skills |
| **3–5** | Core acceleration | Code, data prep, EDA & reporting — the daily wins |
| **6–7** | Expanding scope | Conversational + predictive analytics — the new reach |
| **8** | Integration | Capstone + governance — make it real and responsible |

---

## 🛠️ Tooling Philosophy

The course is **tool-agnostic in principle but hands-on in practice.** Concepts are taught so they transfer as the landscape evolves, while exercises use current, widely-available tools so the learning is concrete:

- **General-purpose assistants with code interpreter** — ChatGPT, Claude
- **AI pair-programming** — GitHub Copilot
- **Conversational / BI analytics** — a BI copilot + a lightweight RAG setup

Exact tooling is confirmed with the cohort sponsor before the course begins (a B2B partner may standardize on specific tools).

---

## 📈 Outcomes

By the end of the course, each participant will be able to:

- Decide confidently **when to use AI and when not to** at each stage of the analytics workflow
- Write reliable, reproducible prompts and maintain a reusable prompt library
- Accelerate SQL/Python work and data cleaning while **verifying every generated artifact**
- Produce faster, deeper EDA and stakeholder-ready narratives
- Stand up conversational and basic predictive analytics with AI assistance
- Operate within clear **governance, privacy, and ethics** guardrails
- Walk away with a **personal, defensible, AI-augmented analytics workflow**

---

## ✅ Instructor Evaluation Fit (ACA Two-Step Process)

1. **Syllabus submission** — this document: 8 session titles + the overall pedagogical vision. ✔
2. **Trial lesson** — proposed guest-lecture theme: a condensed version of **Session 3 (AI Pair-Programming for SQL & Python)** or **Session 5 (AI-Assisted EDA & Reporting)**, as both are immediately hands-on, demo-friendly, and resonate with a working analytics audience. Specific theme, duration, and date to be mutually agreed with ACA.
