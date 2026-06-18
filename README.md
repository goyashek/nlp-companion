<div align="center">

# 🧠 NLP Companion
### An Interactive Cheat Sheet & Study Dashboard

**Based on the [CampusX NLP Course](https://www.youtube.com/playlist?list=PLKnIA16_RmvZo7fp5kkIth6nRTeQQsjfX) — Lectures 1 to 7**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-6366f1?style=for-the-badge&logo=github)](https://goyashek.github.io/nlp-companion/)
[![Made with](https://img.shields.io/badge/Made%20with-Vanilla%20JS-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)](https://goyashek.github.io/nlp-companion/)
[![License](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](LICENSE)

</div>

---

## 📖 Overview

A fully offline-capable, interactive study companion for the **CampusX End-to-End NLP Course**. It combines a quick-reference cheat sheet with topic-wise lecture notes, real lecture screenshots, working Python code snippets, and a guided NLP Decision Wizard — all in a single HTML file that requires zero backend.

> **Think of it as a premium textbook that lives in your browser.**

---

## ✨ Features

### 🗂️ Dashboard & Cheat Sheet
- **16 NLP concepts** across 7 lectures presented as scannable cards
- **Dual filter system** — filter by category *and* by lecture number simultaneously
- **Live search** across concept names, intuitions, subtopics, advantages, and code
- Click any card to open a detailed **slide-out drawer** with full explanation, screenshots, pros/cons, best practices, and copy-able Python code

### 📚 Topic-wise Lecture Notes
- One structured panel per lecture with a **collapsible concept accordion**
- **Screenshot strips** — all manually curated lecture screenshots displayed inline per lecture
- Full intuitions, pros/cons grid, best practices, and code blocks — all in one place
- **Quick-jump lecture navigation** bar + sidebar lecture dots (L1–L7)

### 🧭 NLP Decision Wizard
- Guided question tree: *"What NLP task are you working on?"*
- Covers: Preprocessing → Representation → Classification → Sequence Labeling
- Each recommendation comes with a **Pipeline Integrity Diagnostic** — interactive trap questions that expose common NLP mistakes (data leakage in TF-IDF, lemmatization without POS tags, negation destruction in stopword removal, etc.)

### 🎨 UI/UX
- Indigo/violet dark theme with smooth animations
- Full **Light / Dark mode** toggle (persisted via `localStorage`)
- Image zoom modal for all screenshots
- Fully responsive layout

---

## 🗂️ Topics Covered

| Lecture | Topic | Concepts |
|---|---|---|
| 1 | Introduction to NLP | NLP overview, applications, challenges |
| 2 | End-to-End NLP Pipeline | Data acquisition → deployment flow |
| 3 | Text Preprocessing | Cleaning, Tokenization, Stopwords, Stemming, Lemmatization |
| 4 | Text Representation | Bag of Words, TF-IDF, N-Grams |
| 5 | Word2Vec | Dense embeddings, CBOW, Skip-gram |
| 6 | Text Classification | Pipeline, Average Word2Vec for classification |
| 7 | Sequence Modeling | POS Tagging, Hidden Markov Models, Viterbi Algorithm |

---

## 🚀 Live Demo

**👉 [https://goyashek.github.io/nlp-companion/](https://goyashek.github.io/nlp-companion/)**

Or clone and open locally:

```bash
git clone https://github.com/goyashek/nlp-companion.git
cd nlp-companion
open index.html   # macOS
# or just double-click index.html on Windows/Linux
```

No build step, no `npm install`, no server needed.

---

## 🏗️ Project Structure

```
nlp-companion/
├── index.html        # App shell — 3-tab layout
├── style.css         # Design system (indigo theme, dark/light, all components)
├── nlp_data.js       # All content: concepts DB, screenshot mapping, wizard, diagnostics
├── app.js            # App logic: rendering, search, filtering, wizard, drawer
└── ss/               # 129 manually curated lecture screenshots
    ├── 001 - ....png
    ├── 002 - ....png
    └── ...
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 (semantic) |
| Styling | Vanilla CSS (custom design system, CSS variables) |
| Logic | Vanilla JavaScript (no frameworks) |
| Icons | [Lucide Icons](https://lucide.dev/) via CDN |
| Fonts | [Google Fonts](https://fonts.google.com/) — Outfit + Plus Jakarta Sans + Fira Code |
| Hosting | GitHub Pages |

---

## 📚 Course Reference

This dashboard is built on top of the **CampusX NLP Course** by [Nitish Singh](https://www.youtube.com/@CampusX-official):

🎬 **Playlist:** [Natural Language Processing (NLP)](https://www.youtube.com/playlist?list=PLKnIA16_RmvZo7fp5kkIth6nRTeQQsjfX)

---

## 🤝 Contributing

Found a mistake in the content? Want to add more concepts or fix a code snippet?

1. Fork the repo
2. Edit `nlp_data.js` — add/fix entries in `NLP_DB`
3. Open a Pull Request

---

## 👤 Author

**Abhishek Goyal**
- GitHub: [@goyashek](https://github.com/goyashek)

---

<div align="center">
Made with ❤️ for anyone learning NLP
</div>
