# ⚡ KENTECH Career Lab

An AI-powered career guidance platform built for students at Korea Institute of Energy Technology (KENTECH).  
Get tailored interview questions and personalized career recommendations for the energy sector — powered by Claude AI.

🔗 **Live Demo:** [https://kentech-career-lab.vercel.app](https://kentech-career-lab.vercel.app)

---

## ✨ Features

- 🎤 **AI Interview Question Generator** — Select your job field and company; Claude AI instantly generates tailored technical & personality interview questions
- 🧭 **AI Career Recommendation** — Input your interests and strengths; AI recommends top-3 personalized career paths (employment / grad school / overseas)
- ⚡ **Energy Field Specialization** — Covers renewable energy, nuclear, hydrogen, smart grid, battery/ESS, and energy policy
- 📋 **Copy to Clipboard** — One-click copy of all generated questions for offline practice
- 🌙 **Dark Mode** — Toggle with preference saved to localStorage
- 📱 **Responsive Design** — Fully usable on mobile and desktop

---

## 📁 Project Structure

```
kentech-career-lab/
├── index.html        # Home page — hero, features, career tags strip
├── interview.html    # AI Interview Question Generator
├── career.html       # AI Career Recommendation
├── about.html        # About page — project info, tech stack, AI report
├── style.css         # Full design system (navy + orange, dark mode, responsive)
├── app.js            # Claude API integration, DOM rendering, dark mode
└── README.md
```

---

## 🚀 How to Run Locally

No build step or dependencies required — plain static website.

**Option 1 — Open directly:**
```
Open index.html in your browser.
```

**Option 2 — Local dev server (recommended):**
```bash
# VS Code Live Server extension
# Right-click index.html → "Open with Live Server"

# Or using Python
python -m http.server 8000
# Visit http://localhost:8000
```

> **Note:** The Claude API is called directly from the browser. An API key is required for AI features to work. See `app.js` for the fetch configuration.

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Page structure and semantic markup |
| CSS3 | Design system, dark mode, responsive layout |
| Vanilla JavaScript | Claude API calls, DOM rendering, localStorage |
| Claude API (Anthropic) | AI interview question generation and career recommendation |
| localStorage API | Dark mode preference persistence |
| Google Fonts | Space Grotesk + Inter typography |
| Vercel | Static site deployment |

---

## 📄 Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/index.html` | Service intro, features, energy career tags |
| Interview | `/interview.html` | AI interview question generator |
| Career | `/career.html` | AI career path recommender |
| About | `/about.html` | Project info, tech stack, AI development report |

---

## 🤖 AI-Assisted Development

This project was built with AI assistance as part of Assignment 4 for *Introduction to AI Programming, KENTECH Spring 2026*.

**Tools used:** Claude (Anthropic), GitHub Copilot  
**Full AI development report** is included in the submission PDF.

---

## 📬 Course Info

- **Course:** Introduction to AI Programming
- **Institution:** Korea Institute of Energy Technology (KENTECH)
- **Semester:** Spring 2026
- **Assignment:** Assignment 4 — PRD & AI-Assisted Web Service
- **Student ID:** 20250898 · 전대욱
