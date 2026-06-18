// NLP Companion — App Logic
// Extends ML Cheat-Sheet baseline with:
//   • Lecture-based filtering
//   • Topic-wise Notes tab with collapsible concept sections
//   • Screenshots from ../ss/ mapped by lecture index
//   • NLP-specific Decision Wizard + Diagnostic quiz

// ─── Config ───────────────────────────────────────────────────
const SS_BASE = '../ss/';
const YT_BASE = 'https://www.youtube.com/watch?v=';
const LOCAL_VIDEO_BASE = 'file:///Users/abhigoyal/Documents/Acadss/Data%20Science/CampusX/Natural%20Language%20Processing(NLP)/';

// Lecture metadata
const LECTURES = [
  { num: 1, title: 'Introduction to NLP',      videoId: 'zlUpTlaxAKI', videoFile: '001 - Introduction to NLP ｜ NLP Lecture 1 ｜ End to End NLP Course.mp4' },
  { num: 2, title: 'End-to-End NLP Pipeline',   videoId: '29qyNyNkLHs', videoFile: '002 - End to End NLP Pipeline ｜ NLP Pipeline ｜ Lecture 2 NLP Course.mp4' },
  { num: 3, title: 'Text Preprocessing',         videoId: '6C0sLtw5ctc', videoFile: '003 - Text Preprocessing ｜ NLP Course Lecture 3.mp4' },
  { num: 4, title: 'Text Representation',        videoId: 'vo6gQz5lYRI', videoFile: '004 - Text Representation ｜ NLP Lecture 4 ｜ Bag of Words ｜ Tf-Idf ｜ N-grams, Bi-grams and Uni-grams.mp4' },
  { num: 5, title: 'Word2Vec',                   videoId: 'DDfLc5AHoJI', videoFile: '005 - Word2vec Complete Tutorial ｜ CBOW and Skip-gram ｜ Game of Thrones Word2vec.mp4' },
  { num: 6, title: 'Text Classification',        videoId: 'Qbd7U9F0QQ8', videoFile: '006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec.mp4' },
  { num: 7, title: 'POS Tagging & HMMs',         videoId: '269IGagoJfs', videoFile: '007 - POS Tagging ｜ Part of Speech Tagging in NLP ｜ Hidden Markov Models in NLP ｜ Viterbi Algorithm in NLP.mp4' },
];

// ─── State ────────────────────────────────────────────────────
let activeTab = 'dashboard';
let activeCategory = 'all';
let activeLecture = 'all';
let searchQuery = '';
let activeLectureNote = 1;
let wizardHistory = [];
let currentWizardNode = 'start';
let activeDiagnosticQuestions = [];
let activeDiagnosticAnswers = {};

// ─── DOM refs ─────────────────────────────────────────────────
const navButtons = document.querySelectorAll('.nav-btn[data-tab]');
const tabContents = document.querySelectorAll('.tab-content');
const searchInput = document.getElementById('search-input');
const categoryFilters = document.getElementById('category-filters');
const lectureFilters = document.getElementById('lecture-filters');
const techniquesGrid = document.getElementById('techniques-grid');
const drawer = document.getElementById('detail-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const drawerContent = document.getElementById('drawer-content');
const drawerCloseBtn = document.getElementById('drawer-close-btn');
const questionBox = document.getElementById('question-box');
const wizardProgressFill = document.getElementById('wizard-progress-fill');
const wizardBackBtn = document.getElementById('wizard-back-btn');
const wizardRestartBtn = document.getElementById('wizard-restart-btn');

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderTechniqueCards();
  initTabNavigation();
  initSearchAndFilter();
  initDrawer();
  initWizard();
  initThemeToggle();
  renderLectureDots();
  renderLectureNotes();
  lucide.createIcons();
});

// ─── 1. Tab Navigation ────────────────────────────────────────
function initTabNavigation() {
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabContents.forEach(c => {
        c.classList.remove('active');
        if (c.id === `${tabId}-tab`) c.classList.add('active');
      });
      activeTab = tabId;
      if (activeTab === 'wizard') restartWizard();
      lucide.createIcons();
    });
  });
}

// Helper: navigate to a tab
function goToTab(tabId) {
  document.querySelectorAll('.nav-btn[data-tab]').forEach(b => b.classList.remove('active'));
  const targetBtn = document.getElementById(`nav-${tabId}`);
  if (targetBtn) targetBtn.classList.add('active');
  tabContents.forEach(c => {
    c.classList.remove('active');
    if (c.id === `${tabId}-tab`) c.classList.add('active');
  });
  activeTab = tabId;
  lucide.createIcons();
}

// ─── 2. Search & Filter ───────────────────────────────────────
function initSearchAndFilter() {
  searchInput.addEventListener('input', e => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderTechniqueCards();
  });

  categoryFilters.addEventListener('click', e => {
    if (e.target.classList.contains('filter-tag')) {
      document.querySelectorAll('#category-filters .filter-tag').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      activeCategory = e.target.getAttribute('data-category');
      renderTechniqueCards();
    }
  });

  lectureFilters.addEventListener('click', e => {
    if (e.target.classList.contains('lecture-tag')) {
      document.querySelectorAll('.lecture-tag').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      const lec = e.target.getAttribute('data-lecture');
      activeLecture = lec === 'all' ? 'all' : parseInt(lec);
      renderTechniqueCards();
    }
  });
}

// ─── 3. Render Technique Cards ────────────────────────────────
function renderTechniqueCards() {
  techniquesGrid.innerHTML = '';

  const filtered = NLP_DB.filter(item => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchLec = activeLecture === 'all' || item.lectureNum === activeLecture;
    const matchSearch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery) ||
      item.categoryName.toLowerCase().includes(searchQuery) ||
      item.intuition.toLowerCase().includes(searchQuery) ||
      (item.subtopics || []).some(s => s.toLowerCase().includes(searchQuery)) ||
      item.advantages.some(a => a.toLowerCase().includes(searchQuery)) ||
      item.disadvantages.some(d => d.toLowerCase().includes(searchQuery));
    return matchCat && matchLec && matchSearch;
  });

  if (filtered.length === 0) {
    techniquesGrid.innerHTML = `
      <div class="no-results-card">
        <i data-lucide="search-x" style="width:44px;height:44px;color:var(--warning);margin-bottom:14px;"></i>
        <h3 style="margin-bottom:8px;">No concepts found</h3>
        <p style="color:var(--text-muted);">Try adjusting your search or filters.</p>
      </div>`;
    lucide.createIcons();
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'technique-card';
    const lectureMeta = LECTURES.find(l => l.num === item.lectureNum);
    card.innerHTML = `
      <div class="card-header">
        <span class="card-category badge-${item.category}">${item.categoryName}</span>
        <span class="lecture-badge">Lecture ${item.lectureNum}</span>
      </div>
      <h3>${item.name}</h3>
      <p class="card-intuition">${item.intuition.split('\n')[0]}</p>
      <div class="card-tags">
        ${(item.subtopics || []).slice(0, 3).map(s => `<span class="card-tag">${s}</span>`).join('')}
      </div>
      <div class="card-footer" style="margin-top:14px;">
        <span>View Details & Code</span>
        <i data-lucide="arrow-right" style="width:15px;height:15px;"></i>
      </div>`;
    card.addEventListener('click', () => openDrawer(item.id));
    techniquesGrid.appendChild(card);
  });

  lucide.createIcons();
}

// ─── 4. Detail Drawer ─────────────────────────────────────────
function initDrawer() {
  drawerCloseBtn.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
}

function openDrawer(conceptId) {
  const item = NLP_DB.find(t => t.id === conceptId);
  if (!item) return;

  const ytUrl = `${YT_BASE}${item.videoId}`;
  const isLocal = window.location.protocol === 'file:';
  const lectureMeta = LECTURES.find(l => l.num === item.lectureNum);
  const localVideoUrl = lectureMeta ? (LOCAL_VIDEO_BASE + encodeURIComponent(lectureMeta.videoFile)) : null;

  // Screenshot gallery for this lecture
  const screenshots = SS_MAPPING[item.lectureNum] || [];
  let galleryHtml = '';
  if (screenshots.length > 0) {
    const itemsHtml = screenshots.map(fname => `
      <div class="gallery-item" onclick="zoomImage('${SS_BASE}${encodeURIComponent(fname)}')">
        <img src="${SS_BASE}${encodeURIComponent(fname)}" alt="${fname}" loading="lazy">
      </div>`).join('');
    galleryHtml = `
      <div class="drawer-section">
        <h3><i data-lucide="image"></i> Lecture ${item.lectureNum} Screenshots</h3>
        <p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:10px;">
          Manually curated screenshots from Lecture ${item.lectureNum}. Click to zoom.
        </p>
        <div class="gallery-container">${itemsHtml}</div>
      </div>`;
  }

  let linksHtml = `
    <a href="${ytUrl}" class="link-btn youtube-btn" target="_blank">
      <i data-lucide="youtube"></i> Watch on YouTube
    </a>`;

  if (isLocal && localVideoUrl) {
    linksHtml += `
      <a href="${localVideoUrl}" class="link-btn" target="_blank">
        <i data-lucide="play-circle"></i> Play Local Video
      </a>`;
  }

  drawerContent.innerHTML = `
    <div class="drawer-header">
      <div class="drawer-meta">
        <span class="card-category badge-${item.category}">${item.categoryName}</span>
        <span class="lecture-badge">Lecture ${item.lectureNum}</span>
      </div>
      <h2>${item.name}</h2>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
        ${(item.subtopics || []).map(s => `<span class="card-tag" style="font-size:0.74rem;padding:3px 10px;">${s}</span>`).join('')}
      </div>
    </div>

    <div class="drawer-section">
      <h3><i data-lucide="external-link"></i> Resources</h3>
      <div class="local-links">${linksHtml}</div>
    </div>

    <div class="drawer-section">
      <h3><i data-lucide="lightbulb"></i> Intuition & Explanation</h3>
      <p style="white-space:pre-wrap;">${item.intuition}</p>
    </div>

    ${galleryHtml}

    <div class="drawer-section">
      <div style="display:grid;gap:16px;">
        <div>
          <h3 style="color:var(--success);"><i data-lucide="check-circle"></i> Advantages</h3>
          <ul class="pros-list">
            ${item.advantages.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>
        <div>
          <h3 style="color:var(--danger);"><i data-lucide="x-circle"></i> Disadvantages</h3>
          <ul class="cons-list">
            ${item.disadvantages.map(d => `<li>${d}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>

    <div class="drawer-section">
      <h3><i data-lucide="sparkles"></i> Best Practices & Warnings</h3>
      <ul class="tips-list">
        ${item.bestPractices.map(bp => `<li>${bp}</li>`).join('')}
      </ul>
    </div>

    <div class="drawer-section">
      <h3><i data-lucide="code"></i> Python Code</h3>
      <div class="code-container">
        <div class="code-header">
          <span>Python / NLTK / spaCy / sklearn</span>
          <button class="copy-btn" onclick="copyCode(this)">
            <i data-lucide="copy" style="width:13px;height:13px;"></i> Copy Code
          </button>
        </div>
        <pre><code id="code-block">${escapeHtml(item.code)}</code></pre>
      </div>
    </div>
  `;

  lucide.createIcons();
  drawer.classList.add('active');
  drawerOverlay.classList.add('active');
}

function closeDrawer() {
  drawer.classList.remove('active');
  drawerOverlay.classList.remove('active');
}

function copyCode(btn) {
  const code = document.getElementById('code-block').innerText;
  navigator.clipboard.writeText(code).then(() => {
    btn.innerHTML = `<i data-lucide="check" style="width:13px;height:13px;"></i> Copied!`;
    lucide.createIcons();
    setTimeout(() => {
      btn.innerHTML = `<i data-lucide="copy" style="width:13px;height:13px;"></i> Copy Code`;
      lucide.createIcons();
    }, 2000);
  });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── 5. Image Zoom ────────────────────────────────────────────
window.zoomImage = function(src) {
  let modal = document.querySelector('.img-zoom-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'img-zoom-modal';
    modal.innerHTML = `
      <button class="img-zoom-close" onclick="this.parentElement.classList.remove('active')">
        <i data-lucide="x" style="width:22px;height:22px;"></i>
      </button>
      <img src="" alt="Zoomed screenshot">`;
    document.body.appendChild(modal);
    lucide.createIcons();
  }
  modal.querySelector('img').src = src;
  modal.classList.add('active');
  modal.onclick = e => { if (e.target.tagName !== 'IMG') modal.classList.remove('active'); };
};

// ─── 6. Sidebar Lecture Dots ──────────────────────────────────
function renderLectureDots() {
  const container = document.getElementById('lecture-dots');
  LECTURES.forEach(lec => {
    const dot = document.createElement('div');
    dot.className = 'lecture-dot';
    dot.textContent = `L${lec.num}`;
    dot.title = lec.title;
    dot.addEventListener('click', () => {
      // Switch to lecture notes tab and show that lecture
      goToTab('lectures');
      showLectureNote(lec.num);
      // update lecture nav buttons
      document.querySelectorAll('.lecture-nav-btn').forEach(b => b.classList.remove('active'));
      const targetBtn = document.getElementById(`lec-nav-${lec.num}`);
      if (targetBtn) targetBtn.classList.add('active');
    });
    container.appendChild(dot);
  });
}

// ─── 7. Lecture Notes Tab ────────────────────────────────────
function renderLectureNotes() {
  renderLectureNavStrip();
  LECTURES.forEach(lec => renderLecturePanelFor(lec));
  // Show first lecture by default
  showLectureNote(1);
}

function renderLectureNavStrip() {
  const strip = document.getElementById('lecture-nav-strip');
  LECTURES.forEach(lec => {
    const btn = document.createElement('button');
    btn.className = 'lecture-nav-btn';
    btn.id = `lec-nav-${lec.num}`;
    btn.innerHTML = `
      <span class="lecture-num-badge">${lec.num}</span>
      ${lec.title}`;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lecture-nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showLectureNote(lec.num);
    });
    strip.appendChild(btn);
  });
}

function showLectureNote(num) {
  activeLectureNote = num;
  document.querySelectorAll('.lecture-note-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`lecture-panel-${num}`);
  if (panel) panel.classList.add('active');
  // Update nav buttons
  document.querySelectorAll('.lecture-nav-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`lec-nav-${num}`);
  if (btn) btn.classList.add('active');
  lucide.createIcons();
}

function renderLecturePanelFor(lec) {
  const container = document.getElementById('lecture-notes-content');
  const concepts = NLP_DB.filter(item => item.lectureNum === lec.num);
  const screenshots = SS_MAPPING[lec.num] || [];

  // Topic chips from all concepts in this lecture
  const allTopics = [...new Set(concepts.flatMap(c => c.subtopics || []))].slice(0, 10);

  // Screenshot strip (all for the lecture)
  let ssStripHtml = '';
  if (screenshots.length > 0) {
    const thumbs = screenshots.map(fname => `
      <div class="ss-thumb" onclick="zoomImage('${SS_BASE}${encodeURIComponent(fname)}')">
        <img src="${SS_BASE}${encodeURIComponent(fname)}" alt="${fname}" loading="lazy">
      </div>`).join('');
    ssStripHtml = `
      <div class="lecture-ss-strip">
        <div class="lecture-ss-header">
          <i data-lucide="camera"></i>
          <span>Lecture ${lec.num} Screenshots (${screenshots.length} frames)</span>
        </div>
        <div class="ss-strip">${thumbs}</div>
      </div>`;
  }

  // Concept sections
  const conceptSectionsHtml = concepts.map((item, idx) => `
    <div class="concept-section" id="concept-sec-${item.id}">
      <div class="concept-section-header" onclick="toggleConceptSection('${item.id}')">
        <div class="concept-section-title">
          <div class="concept-dot"></div>
          <h3>${item.name}</h3>
          <span class="card-category badge-${item.category}" style="font-size:0.65rem;padding:2px 8px;">${item.categoryName}</span>
        </div>
        <i data-lucide="chevron-down" class="concept-chevron"></i>
      </div>
      <div class="concept-body">
        <div class="concept-body-inner">
          <div class="concept-intuition">${item.intuition}</div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px;">
            <div>
              <p style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;color:var(--success);margin-bottom:8px;">✓ Advantages</p>
              <ul class="pros-list">
                ${item.advantages.map(a => `<li>${a}</li>`).join('')}
              </ul>
            </div>
            <div>
              <p style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;color:var(--danger);margin-bottom:8px;">✗ Disadvantages</p>
              <ul class="cons-list">
                ${item.disadvantages.map(d => `<li>${d}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div style="margin-bottom:18px;">
            <p style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;color:var(--warning);margin-bottom:8px;">★ Best Practices</p>
            <ul class="tips-list">
              ${item.bestPractices.map(bp => `<li>${bp}</li>`).join('')}
            </ul>
          </div>

          <div class="code-container" style="margin-bottom:14px;">
            <div class="code-header">
              <span>Python Code</span>
              <button class="copy-btn" onclick="copyCodeById('code-${item.id}')">
                <i data-lucide="copy" style="width:12px;height:12px;"></i> Copy
              </button>
            </div>
            <pre><code id="code-${item.id}">${escapeHtml(item.code)}</code></pre>
          </div>

          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <a href="${YT_BASE}${item.videoId}" class="link-btn youtube-btn" target="_blank">
              <i data-lucide="youtube"></i> Watch Lecture ${lec.num}
            </a>
            <button class="link-btn" onclick="openDrawer('${item.id}');void(0);">
              <i data-lucide="maximize-2"></i> Full Detail View
            </button>
          </div>
        </div>
      </div>
    </div>`).join('');

  const panel = document.createElement('div');
  panel.className = 'lecture-note-panel';
  panel.id = `lecture-panel-${lec.num}`;
  panel.innerHTML = `
    <div class="lecture-note-header">
      <div class="lecture-num-big">${lec.num}</div>
      <div class="lecture-note-meta">
        <h2>${lec.title}</h2>
        <p>${concepts.length} concept${concepts.length !== 1 ? 's' : ''} covered in this lecture</p>
        <div class="topic-chips">
          ${allTopics.map(t => `<span class="topic-chip">${t}</span>`).join('')}
        </div>
      </div>
    </div>

    ${ssStripHtml}

    <div>
      ${conceptSectionsHtml}
    </div>
  `;

  container.appendChild(panel);
}

window.toggleConceptSection = function(id) {
  const sec = document.getElementById(`concept-sec-${id}`);
  if (!sec) return;
  sec.classList.toggle('open');
  lucide.createIcons();
};

window.copyCodeById = function(codeId) {
  const el = document.getElementById(codeId);
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => {
    // Visual feedback is handled generically
  });
};

// ─── 8. Decision Wizard ───────────────────────────────────────
function initWizard() {
  wizardRestartBtn.addEventListener('click', restartWizard);
  wizardBackBtn.addEventListener('click', handleWizardBack);
  renderWizardNode();
}

function renderWizardNode() {
  const node = NLP_WIZARD_NODES[currentWizardNode];
  if (!node) return;

  const tipContainer = document.getElementById('wizard-tip');
  const tipText = document.getElementById('wizard-tip-text');
  if (node.tip) {
    tipText.innerText = node.tip;
    tipContainer.style.display = 'flex';
  } else {
    tipContainer.style.display = 'none';
  }

  let progress = 25;
  if (currentWizardNode === 'start') progress = 20;
  else if (['preprocess', 'representation', 'classification', 'sequence'].includes(currentWizardNode)) progress = 50;
  else if (['normalization', 'bow_or_tfidf'].includes(currentWizardNode)) progress = 75;
  else progress = 90;

  wizardProgressFill.style.width = `${progress}%`;
  wizardBackBtn.style.visibility = wizardHistory.length > 0 ? 'visible' : 'hidden';

  let optionsHtml = '';
  node.options.forEach(opt => {
    if (opt.next) {
      optionsHtml += `
        <button class="option-btn" onclick="advanceWizard('${opt.next}')">
          <span>${opt.text}</span>
          <i data-lucide="chevron-right"></i>
        </button>`;
    } else if (opt.result) {
      optionsHtml += `
        <button class="option-btn" onclick="showWizardResult('${opt.result}')">
          <span>${opt.text}</span>
          <i data-lucide="check"></i>
        </button>`;
    }
  });

  questionBox.innerHTML = `
    <h3 class="question-title">${node.question}</h3>
    <div class="options-list">${optionsHtml}</div>`;

  lucide.createIcons();
}

window.advanceWizard = function(nextNodeId) {
  wizardHistory.push(currentWizardNode);
  currentWizardNode = nextNodeId;
  renderWizardNode();
};

window.showWizardResult = function(conceptId) {
  const item = NLP_DB.find(t => t.id === conceptId);
  if (!item) return;

  document.getElementById('wizard-tip').style.display = 'none';
  wizardProgressFill.style.width = '100%';

  questionBox.innerHTML = `
    <div class="result-box">
      <div class="result-icon">
        <i data-lucide="award"></i>
      </div>
      <h3>Recommended: ${item.name}</h3>
      <p>${item.intuition.split('\n')[0]}</p>

      <div class="integrity-container">
        <div class="integrity-header">
          <div class="integrity-title">
            <i data-lucide="shield-check" style="color:var(--success);width:18px;height:18px;"></i>
            <span>🧠 NLP Pipeline Integrity Check</span>
          </div>
          <span class="integrity-score-badge badge-score-secure" id="integrity-badge">100% SECURE</span>
        </div>
        <div class="integrity-meter-bg">
          <div class="integrity-meter-fill" id="integrity-meter-fill" style="width:100%;"></div>
        </div>
        <div class="diagnostic-quiz-section" id="diagnostic-quiz-section"></div>
      </div>

      <div style="text-align:left;width:100%;background:rgba(255,255,255,0.01);border:1px solid var(--border-color);border-radius:12px;padding:18px;margin-top:4px;">
        <h4 style="color:var(--warning);margin-bottom:10px;display:flex;align-items:center;gap:8px;font-size:0.88rem;text-transform:uppercase;letter-spacing:0.5px;">
          <i data-lucide="alert-triangle" style="width:14px;height:14px;"></i> Key Considerations
        </h4>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:7px;">
          ${(item.bestPractices || []).map(bp => `
            <li style="position:relative;padding-left:18px;font-size:0.86rem;line-height:1.4;color:var(--text-muted);">
              <span style="position:absolute;left:0;color:var(--warning);">•</span>
              ${bp}
            </li>`).join('')}
        </ul>
      </div>

      <div style="display:flex;gap:10px;margin-top:8px;">
        <button class="btn btn-primary" onclick="openDrawer('${item.id}')">
          <i data-lucide="book-open"></i> Read Details & Code
        </button>
        <button class="btn btn-secondary" onclick="restartWizard()">
          <i data-lucide="rotate-ccw"></i> Try Again
        </button>
      </div>
    </div>`;

  renderDiagnosticQuiz(item.id);
  lucide.createIcons();
};

window.renderDiagnosticQuiz = function(conceptId) {
  const quizSection = document.getElementById('diagnostic-quiz-section');
  if (!quizSection) return;

  let questions = NLP_DIAGNOSTIC_DB[conceptId] || NLP_GENERAL_DIAGNOSTICS;
  activeDiagnosticQuestions = questions;
  activeDiagnosticAnswers = {};

  let html = '';
  questions.forEach((q, idx) => {
    const optionsHtml = q.options.map((opt, oi) => `
      <button class="diag-btn" id="diag-btn-${idx}-${oi}" onclick="selectDiagnosticAnswer('${conceptId}', ${idx}, ${oi})">
        ${opt.text}
      </button>`).join('');
    html += `
      <div class="diagnostic-item" id="diagnostic-item-${idx}">
        <div class="diagnostic-question-text">${idx + 1}. ${q.q}</div>
        <div class="diagnostic-options">${optionsHtml}</div>
        <div id="diag-feedback-${idx}" style="display:none;margin-top:8px;"></div>
      </div>`;
  });

  quizSection.innerHTML = html;
};

window.selectDiagnosticAnswer = function(conceptId, qIdx, optIdx) {
  if (activeDiagnosticAnswers[qIdx] !== undefined) return;
  activeDiagnosticAnswers[qIdx] = optIdx;

  const question = activeDiagnosticQuestions[qIdx];
  const selectedOpt = question.options[optIdx];

  question.options.forEach((opt, oi) => {
    const btn = document.getElementById(`diag-btn-${qIdx}-${oi}`);
    if (!btn) return;
    btn.disabled = true;
    if (oi === optIdx) {
      if (selectedOpt.isTrap) {
        btn.classList.add('selected-trap');
        btn.innerHTML += ` <i data-lucide="alert-triangle" style="width:12px;height:12px;margin-left:4px;"></i>`;
      } else {
        btn.classList.add('selected-yes');
        btn.innerHTML += ` <i data-lucide="check" style="width:12px;height:12px;margin-left:4px;"></i>`;
      }
    } else {
      btn.classList.add('selected-no');
    }
  });

  const feedbackEl = document.getElementById(`diag-feedback-${qIdx}`);
  if (feedbackEl) {
    let cardClass = 'feedback-safe', iconName = 'check-circle';
    if (selectedOpt.severity === 'danger') { cardClass = 'feedback-danger'; iconName = 'x-circle'; }
    else if (selectedOpt.severity === 'warning') { cardClass = 'feedback-warning'; iconName = 'alert-circle'; }

    feedbackEl.innerHTML = `
      <div class="diag-feedback-card ${cardClass}">
        <i data-lucide="${iconName}"></i>
        <div>${selectedOpt.feedback}</div>
      </div>`;
    feedbackEl.style.display = 'block';
  }

  updateIntegrityScore();
  lucide.createIcons();
};

function updateIntegrityScore() {
  const badge = document.getElementById('integrity-badge');
  const meterFill = document.getElementById('integrity-meter-fill');
  if (!badge || !meterFill) return;

  let traps = 0;
  Object.keys(activeDiagnosticAnswers).forEach(qIdx => {
    const opt = activeDiagnosticQuestions[qIdx].options[activeDiagnosticAnswers[qIdx]];
    if (opt && opt.isTrap) traps++;
  });

  const score = Math.max(10, 100 - traps * 30);
  meterFill.style.width = `${score}%`;

  if (score >= 90) {
    badge.innerText = `${score}% SECURE`;
    badge.className = 'integrity-score-badge badge-score-secure';
    meterFill.style.backgroundColor = 'var(--success)';
  } else if (score >= 60) {
    badge.innerText = `${score}% VULNERABLE`;
    badge.className = 'integrity-score-badge badge-score-warning';
    meterFill.style.backgroundColor = 'var(--warning)';
  } else {
    badge.innerText = `${score}% COMPROMISED`;
    badge.className = 'integrity-score-badge badge-score-danger';
    meterFill.style.backgroundColor = 'var(--danger)';
  }
}

function handleWizardBack() {
  if (wizardHistory.length > 0) {
    currentWizardNode = wizardHistory.pop();
    renderWizardNode();
  }
}

function restartWizard() {
  wizardHistory = [];
  currentWizardNode = 'start';
  renderWizardNode();
}

// ─── 9. Theme Toggle ─────────────────────────────────────────
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle-btn');
  const themeText = document.getElementById('theme-text');
  if (!btn) return;

  const saved = localStorage.getItem('nlp-theme');
  if (saved === 'light') {
    document.body.classList.add('light-theme');
    updateThemeUI(true);
  } else {
    updateThemeUI(false);
  }

  btn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('nlp-theme', isLight ? 'light' : 'dark');
    updateThemeUI(isLight);
  });

  function updateThemeUI(isLight) {
    const iconContainer = document.getElementById('theme-icon-container');
    if (!iconContainer) return;
    if (isLight) {
      iconContainer.innerHTML = `<i data-lucide="moon" id="theme-icon"></i>`;
      themeText.innerText = 'Dark Mode';
    } else {
      iconContainer.innerHTML = `<i data-lucide="sun" id="theme-icon"></i>`;
      themeText.innerText = 'Light Mode';
    }
    lucide.createIcons();
  }
}
