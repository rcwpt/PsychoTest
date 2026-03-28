/**
 * PsychoTest — Main JavaScript
 * Handles: fetch(), localStorage, page state, timer, score calculation
 */

'use strict';

/* =============================================
   CONSTANTS & CONFIG
   ============================================= */
const STORAGE_KEYS = {
  ANSWERS_PART1: 'psychotest_answers_part1',
  ANSWERS_PART2: 'psychotest_answers_part2',
  GAME_RESULTS:  'psychotest_game_results',
  SCORES:        'psychotest_scores',
  START_TIME:    'psychotest_start_time',
};

const PERSONALITY_TYPES = [
  {
    id: 'explorer',
    name: 'Sang Penjelajah',
    tagline: 'Jiwa bebas yang haus akan petualangan!',
    icon: 'fa-compass',
    iconColor: 'icon-orange',
    description:
      'Kamu adalah jiwa yang penuh semangat, selalu haus akan pengalaman baru dan petualangan. ' +
      'Dengan intuisi tajam dan keberanian yang luar biasa, kamu melihat setiap perubahan sebagai kesempatan. ' +
      'Kreativitasmu tak terbatas dan semangatmu menular kepada semua orang di sekitarmu.',
    traits: ['Petualang', 'Kreatif', 'Spontan', 'Karismatik', 'Visioner'],
    condition: (s) => s.inovatif + s.ekstrovert + s.impulsif >= s.stabil + s.introvert + s.analitis,
    dominantFills: ['fill-orange', 'fill-orange', 'fill-pink', 'fill-orange'],
  },
  {
    id: 'thinker',
    name: 'Sang Pemikir',
    tagline: 'Otak jenius di balik setiap keputusan besar.',
    icon: 'fa-brain',
    iconColor: 'icon-purple',
    description:
      'Kamu adalah pemikir mendalam yang melihat pola di balik kekacauan. Pikiranmu tajam seperti pisau bedah, ' +
      'selalu mencari kebenaran melalui data dan logika. Orang-orang mengandalkanmu untuk solusi cerdas ' +
      'yang tidak terpikirkan oleh orang lain. Kamu adalah aset luar biasa di setiap tim.',
    traits: ['Analitis', 'Strategis', 'Teliti', 'Independen', 'Visioner'],
    condition: (s) => s.analitis + s.introvert >= s.ekstrovert + s.impulsif + 2,
    dominantFills: ['fill-blue', 'fill-blue', 'fill-green', 'fill-blue'],
  },
  {
    id: 'connector',
    name: 'Sang Penghubung',
    tagline: 'Jembatan yang menyatukan hati dan pikiran.',
    icon: 'fa-handshake',
    iconColor: 'icon-green',
    description:
      'Kamu adalah magnet sosial yang membuat setiap orang merasa didengar dan dihargai. ' +
      'Kemampuanmu membaca emosi orang lain dan menciptakan harmoni adalah kekuatan supermu. ' +
      'Di mana pun kamu berada, suasana menjadi lebih hangat dan positif. Kamu adalah jiwa yang dicintai semua.',
    traits: ['Empati', 'Komunikatif', 'Harmonis', 'Hangat', 'Inspiratif'],
    condition: (s) => s.ekstrovert + s.stabil >= s.introvert + s.inovatif + 2,
    dominantFills: ['fill-green', 'fill-pink', 'fill-green', 'fill-green'],
  },
  {
    id: 'guardian',
    name: 'Sang Penjaga',
    tagline: 'Pilar kokoh yang selalu bisa diandalkan.',
    icon: 'fa-shield-alt',
    iconColor: 'icon-blue',
    description:
      'Kamu adalah fondasi yang kokoh bagi semua orang di sekitarmu. Dengan keandalan, kesetiaan, ' +
      'dan kehati-hatian yang luar biasa, kamu membangun kepercayaan yang tidak ternilai. ' +
      'Kamu tidak hanya menjaga dirimu sendiri, tapi juga menjadi pelindung bagi orang-orang yang kamu cintai.',
    traits: ['Dapat Dipercaya', 'Setia', 'Stabil', 'Bertanggung Jawab', 'Bijak'],
    condition: (s) => s.stabil + s.analitis >= s.inovatif + s.impulsif + 2,
    dominantFills: ['fill-blue', 'fill-green', 'fill-blue', 'fill-blue'],
  },
  {
    id: 'innovator',
    name: 'Sang Inovator',
    tagline: 'Pikiran yang selalu selangkah ke depan!',
    icon: 'fa-rocket',
    iconColor: 'icon-pink',
    description:
      'Otakmu adalah mesin ide yang tak pernah berhenti. Kamu melihat dunia bukan sebagaimana adanya, ' +
      'tapi sebagaimana bisa menjadi. Dengan kombinasi unik antara kreativitas dan analisis, ' +
      'kamu menciptakan solusi yang mengubah permainan. Kamu adalah bintang masa depan!',
    traits: ['Inovatif', 'Visioner', 'Berani', 'Cerdas', 'Dinamis'],
    condition: (s) => s.inovatif + s.analitis >= s.stabil + s.ekstrovert + 1,
    dominantFills: ['fill-pink', 'fill-orange', 'fill-blue', 'fill-pink'],
  },
];

const SCORE_CATEGORIES = ['ekstrovert', 'introvert', 'inovatif', 'stabil', 'analitis', 'intuitif', 'impulsif'];

/* =============================================
   UTILITY FUNCTIONS
   ============================================= */

/**
 * Save data to localStorage (JSON-serialized)
 */
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
}

/**
 * Load data from localStorage
 */
function loadFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('localStorage read failed:', e);
    return null;
  }
}

/**
 * Initialise empty score object
 */
function createEmptyScores() {
  return SCORE_CATEGORIES.reduce((acc, cat) => { acc[cat] = 0; return acc; }, {});
}

/**
 * Merge score deltas into a base score object
 */
function addScores(base, delta) {
  Object.entries(delta || {}).forEach(([k, v]) => {
    if (base[k] !== undefined) base[k] += v;
    else base[k] = v;
  });
}

/**
 * Navigate to another page with a fade-out animation
 */
function navigateTo(url, delayMs = 350) {
  document.body.classList.add('fade-out');
  setTimeout(() => { window.location.href = url; }, delayMs);
}

/**
 * Show a brief toast notification
 */
function showToast(message, durationMs = 2200) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-info-circle" style="color:var(--purple-light);margin-right:0.4rem"></i>${message}`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, durationMs);
}

/**
 * Add button shake feedback
 */
function shakeFeedback(el) {
  el.classList.remove('btn-shake');
  void el.offsetWidth; // reflow
  el.classList.add('btn-shake');
  el.addEventListener('animationend', () => el.classList.remove('btn-shake'), { once: true });
}

/**
 * Generate floating CSS particles
 */
function createParticles() {
  const container = document.querySelector('.particles-container');
  if (!container) return;

  const colors = ['#8B5CF6','#EC4899','#F97316','#3B82F6','#10B981','#FBBF24'];
  const count = window.innerWidth < 600 ? 18 : 30;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 8 + 3;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${color};
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * -15}s;
      box-shadow: 0 0 ${size * 2}px ${color};
    `;
    container.appendChild(p);
  }
}

/* =============================================
   PAGE: LANDING (index.html)
   ============================================= */
function initLanding() {
  // Typing animation
  const titleEl = document.getElementById('typing-title');
  if (!titleEl) return;

  const fullText = titleEl.dataset.text || 'Kenali Dirimu Lebih Dalam';
  titleEl.textContent = '';

  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  titleEl.after(cursor);

  let i = 0;
  const speed = 55;

  function typeChar() {
    if (i < fullText.length) {
      titleEl.textContent += fullText[i++];
      setTimeout(typeChar, speed + Math.random() * 30);
    } else {
      // Cursor keeps blinking - done
    }
  }

  setTimeout(typeChar, 500);

  // Start button
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      // Clear previous session
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
      saveToStorage(STORAGE_KEYS.START_TIME, Date.now());
      shakeFeedback(startBtn);
      setTimeout(() => navigateTo('assessment-1.html'), 200);
    });
  }
}

/* =============================================
   PAGE: ASSESSMENT (assessment-1.html / assessment-2.html)
   ============================================= */
async function initAssessment(part) {
  const storageKey = part === 1 ? STORAGE_KEYS.ANSWERS_PART1 : STORAGE_KEYS.ANSWERS_PART2;
  const nextUrl   = part === 1 ? 'game.html' : 'result.html';

  // Fetch questions
  let allQuestions;
  try {
    const res = await fetch('data/questions.json');
    const data = await res.json();
    allQuestions = part === 1 ? data.part1 : data.part2;
  } catch (e) {
    console.error('Failed to load questions:', e);
    showToast('Gagal memuat pertanyaan. Pastikan file data tersedia.');
    return;
  }

  // Load saved answers (if any)
  const savedAnswers = loadFromStorage(storageKey) || {};

  // Render questions
  const container = document.getElementById('questions-container');
  if (!container) return;

  container.innerHTML = '';
  allQuestions.forEach((q, qi) => {
    const card = buildQuestionCard(q, qi, savedAnswers, part, allQuestions.length);
    container.appendChild(card);
  });

  updateProgress(part, allQuestions.length);

  // Next button
  const nextBtn = document.getElementById('next-btn');
  if (!nextBtn) return;

  nextBtn.addEventListener('click', () => {
    const answers = loadFromStorage(storageKey) || {};
    const answered = Object.keys(answers).length;

    if (answered < allQuestions.length) {
      shakeFeedback(nextBtn);
      showToast(`Jawab semua ${allQuestions.length} pertanyaan dulu, ya! 😊`);
      return;
    }

    // Calculate & persist partial scores
    const partScores = createEmptyScores();
    Object.values(answers).forEach(opts => addScores(partScores, opts.scores));

    const existing = loadFromStorage(STORAGE_KEYS.SCORES) || createEmptyScores();
    addScores(existing, partScores);
    saveToStorage(STORAGE_KEYS.SCORES, existing);

    shakeFeedback(nextBtn);
    setTimeout(() => navigateTo(nextUrl), 200);
  });
}

/**
 * Build a single question card DOM element
 */
function buildQuestionCard(question, qi, savedAnswers, part, totalQuestions) {
  const iconColors = ['color-purple', 'color-pink', 'color-orange', 'color-green'];

  const wrapper = document.createElement('div');
  wrapper.className = 'glass-card question-card mb-2 animate__animated animate__fadeInUp';
  wrapper.style.animationDelay = `${qi * 0.12}s`;

  const header = `
    <div class="question-header">
      <div class="question-num-badge">${question.id}</div>
      <i class="fas ${question.icon} question-icon"></i>
      <p class="question-text">${question.text}</p>
    </div>
  `;

  const optionsHtml = question.options.map((opt, oi) => {
    const isSelected = savedAnswers[question.id]?.text === opt.text;
    return `
      <div class="option-card ${isSelected ? 'selected' : ''}"
           data-qid="${question.id}" data-oi="${oi}"
           role="button" tabindex="0"
           aria-label="${opt.text}">
        <i class="fas ${opt.icon} option-icon ${iconColors[oi % iconColors.length]}"></i>
        <span class="option-text">${opt.text}</span>
      </div>
    `;
  }).join('');

  wrapper.innerHTML = header + `<div class="options-grid">${optionsHtml}</div>`;

  // Event listeners on option cards
  wrapper.querySelectorAll('.option-card').forEach(card => {
    const activate = () => {
      const qid  = parseInt(card.dataset.qid);
      const oi   = parseInt(card.dataset.oi);
      const opt  = question.options[oi];
      const storageKey = part === 1 ? STORAGE_KEYS.ANSWERS_PART1 : STORAGE_KEYS.ANSWERS_PART2;

      // Deselect siblings
      wrapper.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      // Persist
      const answers = loadFromStorage(storageKey) || {};
      answers[qid] = { text: opt.text, scores: opt.scores };
      saveToStorage(storageKey, answers);

      updateProgress(part, totalQuestions);
    };

    card.addEventListener('click', activate);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') activate(); });
  });

  return wrapper;
}

/**
 * Update progress bar based on how many questions answered
 */
function updateProgress(part, total) {
  const storageKey = part === 1 ? STORAGE_KEYS.ANSWERS_PART1 : STORAGE_KEYS.ANSWERS_PART2;
  const answers = loadFromStorage(storageKey) || {};
  const answered = Math.min(Object.keys(answers).length, total);
  const pct = Math.round((answered / total) * 100);

  const fill = document.getElementById('progress-fill');
  const label = document.getElementById('progress-label');

  if (fill)  fill.style.width = `${pct}%`;
  if (label) label.textContent = `${answered} / ${total} dijawab`;
}

/* =============================================
   PAGE: GAME (game.html)
   ============================================= */
const GAME_ROUNDS = 5;
const GAME_DURATION = 30; // seconds total
const FAST_THRESHOLD_MS = 1200; // under this = impulsif

let gameState = {
  stimuli: [],
  currentRound: 0,
  results: [],
  roundStartTime: 0,
  timer: null,
  timeLeft: GAME_DURATION,
  gameOver: false,
};

async function initGame() {
  // Load game content
  let allStimuli;
  try {
    const res = await fetch('data/game-content.json');
    const data = await res.json();
    allStimuli = shuffleArray([...data.stimuli]);
  } catch (e) {
    console.error('Failed to load game content:', e);
    showToast('Gagal memuat konten permainan.');
    return;
  }

  // Pick GAME_ROUNDS random stimuli
  gameState.stimuli  = allStimuli.slice(0, GAME_ROUNDS);
  gameState.currentRound = 0;
  gameState.results  = [];
  gameState.timeLeft = GAME_DURATION;
  gameState.gameOver = false;

  // Render dots
  renderRoundDots();

  // Start timer
  startGameTimer();

  // Show first stimulus
  showStimulus();
}

function renderRoundDots() {
  const container = document.getElementById('round-dots');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < GAME_ROUNDS; i++) {
    const dot = document.createElement('div');
    dot.className = 'round-dot' + (i === 0 ? ' active' : '');
    dot.id = `dot-${i}`;
    container.appendChild(dot);
  }
}

function startGameTimer() {
  const timerText = document.getElementById('timer-text');
  const ring = document.getElementById('timer-ring-progress');
  const circumference = 283;

  function tick() {
    if (gameState.gameOver) return;

    if (timerText) timerText.textContent = gameState.timeLeft;

    // Update ring
    if (ring) {
      const fraction = gameState.timeLeft / GAME_DURATION;
      ring.style.strokeDashoffset = circumference * (1 - fraction);
      if (gameState.timeLeft <= 8) {
        ring.classList.add('urgent');
      } else {
        ring.classList.remove('urgent');
      }
    }

    if (gameState.timeLeft <= 0) {
      endGame();
      return;
    }

    gameState.timeLeft--;
    gameState.timer = setTimeout(tick, 1000);
  }

  tick();
}

function showStimulus() {
  if (gameState.currentRound >= GAME_ROUNDS) {
    endGame();
    return;
  }

  const stim = gameState.stimuli[gameState.currentRound];

  // Update round info
  const roundLabel = document.getElementById('round-label');
  if (roundLabel) roundLabel.textContent = `Ronde ${gameState.currentRound + 1} / ${GAME_ROUNDS}`;

  // Dot states
  for (let i = 0; i < GAME_ROUNDS; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (!dot) continue;
    dot.className = 'round-dot' + (i < gameState.currentRound ? ' done' : i === gameState.currentRound ? ' active' : '');
  }

  // Stimulus word
  const wordEl = document.getElementById('stimulus-word');
  if (wordEl) {
    wordEl.style.animation = 'none';
    void wordEl.offsetWidth;
    wordEl.style.animation = '';
    wordEl.textContent = stim.word;
  }

  // Option buttons
  renderGameOptions(stim);

  // Mark round start time
  gameState.roundStartTime = Date.now();
}

function renderGameOptions(stim) {
  const container = document.getElementById('game-options-container');
  if (!container) return;

  container.innerHTML = '';
  stim.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = `game-option-btn option-${i === 0 ? 'a' : 'b'}`;
    btn.innerHTML = `
      <i class="fas ${opt.icon}"></i>
      <span>${opt.text}</span>
    `;
    btn.addEventListener('click', () => handleGameChoice(opt, btn));
    container.appendChild(btn);
  });
}

function handleGameChoice(option, btnEl) {
  if (gameState.gameOver) return;

  const responseMs = Date.now() - gameState.roundStartTime;
  const isFast = responseMs < FAST_THRESHOLD_MS;

  // Visual feedback
  btnEl.classList.add('chosen');
  showSpeedFeedback(isFast, responseMs);

  // Build score delta
  const roundScore = { ...option.scores };
  if (isFast) {
    roundScore.impulsif = (roundScore.impulsif || 0) + 2;
  } else {
    roundScore.analitis = (roundScore.analitis || 0) + 2;
  }

  gameState.results.push({
    round: gameState.currentRound,
    stimulus: gameState.stimuli[gameState.currentRound].label,
    choice: option.text,
    responseMs,
    isFast,
    scores: roundScore,
  });

  // Disable buttons
  const container = document.getElementById('game-options-container');
  if (container) container.querySelectorAll('.game-option-btn').forEach(b => b.disabled = true);

  // Advance
  setTimeout(() => {
    gameState.currentRound++;
    if (gameState.currentRound < GAME_ROUNDS) {
      showStimulus();
    } else {
      endGame();
    }
  }, 700);
}

function showSpeedFeedback(isFast, ms) {
  const el = document.createElement('div');
  el.className = `speed-feedback ${isFast ? 'fast' : 'slow'}`;
  el.innerHTML = isFast
    ? `⚡ Cepat! <small>${ms}ms</small>`
    : `🧠 Hati-hati! <small>${ms}ms</small>`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

function endGame() {
  if (gameState.gameOver) return;
  gameState.gameOver = true;
  clearTimeout(gameState.timer);

  // Aggregate game scores
  const gameScores = createEmptyScores();
  gameState.results.forEach(r => addScores(gameScores, r.scores));

  // Merge into total scores
  const total = loadFromStorage(STORAGE_KEYS.SCORES) || createEmptyScores();
  addScores(total, gameScores);
  saveToStorage(STORAGE_KEYS.SCORES, total);
  saveToStorage(STORAGE_KEYS.GAME_RESULTS, gameState.results);

  // Show "lanjut" overlay
  showGameEndOverlay(gameState.results.length);
}

function showGameEndOverlay(roundsCompleted) {
  const overlay = document.getElementById('game-end-overlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    const msg = document.getElementById('game-end-msg');
    if (msg) {
      msg.textContent = roundsCompleted === GAME_ROUNDS
        ? `Luar biasa! Kamu menyelesaikan ${GAME_ROUNDS} asosiasi! 🎉`
        : `Waktu habis! Kamu sempat menjawab ${roundsCompleted} asosiasi. 👍`;
    }
  } else {
    // Fallback — navigate directly
    navigateTo('assessment-2.html');
  }
}

/* =============================================
   PAGE: RESULT (result.html)
   ============================================= */
async function initResult() {
  const scores = loadFromStorage(STORAGE_KEYS.SCORES);

  if (!scores || Object.keys(scores).length === 0) {
    // No data — redirect to start
    showToast('Kamu belum menyelesaikan asesmen. Mulai dari awal ya! 😊');
    setTimeout(() => navigateTo('index.html'), 2000);
    return;
  }

  // Determine personality type
  const type = determinePersonalityType(scores);

  // Render result
  renderResult(type, scores);

  // Trigger confetti
  triggerConfetti();
}

function determinePersonalityType(scores) {
  // Find first matching type
  for (const type of PERSONALITY_TYPES) {
    if (type.condition(scores)) return type;
  }
  // Fallback — find highest scoring dimension
  const maxKey = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  if (maxKey === 'ekstrovert' || maxKey === 'impulsif') return PERSONALITY_TYPES[0]; // explorer
  if (maxKey === 'analitis')                             return PERSONALITY_TYPES[1]; // thinker
  if (maxKey === 'stabil')                               return PERSONALITY_TYPES[3]; // guardian
  if (maxKey === 'inovatif')                             return PERSONALITY_TYPES[4]; // innovator
  return PERSONALITY_TYPES[2]; // connector
}

function renderResult(type, scores) {
  // Big icon
  const iconEl = document.getElementById('result-icon');
  if (iconEl) {
    iconEl.className = `fas ${type.icon} result-icon-big ${type.iconColor}`;
  }

  // Type name
  const nameEl = document.getElementById('result-type-name');
  if (nameEl) nameEl.textContent = type.name;

  // Tagline
  const taglineEl = document.getElementById('result-tagline');
  if (taglineEl) taglineEl.textContent = type.tagline;

  // Description
  const descEl = document.getElementById('result-description');
  if (descEl) descEl.textContent = type.description;

  // Trait tags
  const tagsEl = document.getElementById('result-traits');
  if (tagsEl) {
    tagsEl.innerHTML = type.traits.map(t => `<span class="trait-tag">${t}</span>`).join('');
  }

  // Score bars
  renderScoreBars(scores, type.dominantFills);
}

function renderScoreBars(scores, fills) {
  const container = document.getElementById('score-breakdown');
  if (!container) return;

  const scoreLabels = {
    ekstrovert: 'Ekstrovert',
    introvert:  'Introvert',
    inovatif:   'Inovatif',
    stabil:     'Stabil',
    analitis:   'Analitis',
    intuitif:   'Intuitif',
    impulsif:   'Impulsif',
  };

  const fillClasses = ['', 'fill-green', 'fill-orange', 'fill-blue', 'fill-pink'];

  const maxScore = Math.max(...Object.values(scores), 1);

  container.innerHTML = '';
  Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .forEach(([key, val], i) => {
      const pct = Math.round((val / (maxScore * 1.1)) * 100);
      const fill = fills[i % fills.length] || fillClasses[i % fillClasses.length];
      const row = document.createElement('div');
      row.className = 'score-row';
      row.innerHTML = `
        <span class="score-label">${scoreLabels[key] || key}</span>
        <div class="score-track">
          <div class="score-fill ${fill}" style="width:0%" data-target="${pct}%"></div>
        </div>
        <span class="score-value">${val}</span>
      `;
      container.appendChild(row);
    });

  // Animate bars after a brief delay
  setTimeout(() => {
    container.querySelectorAll('.score-fill').forEach(bar => {
      bar.style.width = bar.dataset.target;
    });
  }, 400);
}

/**
 * Launch confetti celebration using canvas-confetti CDN library
 */
function triggerConfetti() {
  if (typeof confetti !== 'function') return;

  const colors = ['#8B5CF6', '#EC4899', '#F97316', '#3B82F6', '#10B981', '#FBBF24', '#F43F5E'];

  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.55 },
    colors,
    startVelocity: 45,
  });

  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.6 },
      colors,
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.6 },
      colors,
    });
  }, 350);

  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 100,
      origin: { y: 0.4 },
      colors,
      scalar: 0.8,
    });
  }, 800);
}

/* =============================================
   HELPERS
   ============================================= */

/**
 * Fisher-Yates shuffle
 */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* =============================================
   AUTO-INIT based on page body data attribute
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Animate page entrance
  document.body.classList.add('page-enter');

  // Create background particles
  createParticles();

  // Hide loading overlay if present
  const loader = document.getElementById('loading-overlay');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 400);
  }

  // Route to correct init function
  const page = document.body.dataset.page;
  switch (page) {
    case 'landing':
      initLanding();
      break;
    case 'assessment-1':
      initAssessment(1);
      break;
    case 'assessment-2':
      initAssessment(2);
      break;
    case 'game':
      initGame();
      break;
    case 'result':
      initResult();
      break;
  }
});
