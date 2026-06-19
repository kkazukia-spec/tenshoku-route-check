/**
 * 30秒転職ルート診断 - 診断ロジック
 *
 * 構成：
 *  1. CONFIG              - サイト全体の設定値
 *  2. RESULT_SERVICE_MAP  - 結果タイプと紹介サービスの対応（公開情報のみ）
 *  3. QUESTIONS           - 質問データ
 *  4. 内部状態変数
 *  5. 各処理関数
 *
 * ※ trackEvent は assets/js/analytics.js で window.trackEvent として定義済み
 * ※ ANALYTICS_CONFIG も analytics.js で管理（二重定義しない）
 * ※ 対象条件チェック（年齢・地域・学歴等）は実装しない。
 *    サービスの利用条件は遷移先の公式ページで利用者本人が確認する設計とする。
 */

'use strict';

/* =============================================
   1. サイト設定
   ============================================= */
const CONFIG = {
  siteName: '30秒転職ルート診断',
  totalQuestions: 7,
  animation: {
    highlight: 250,  // 選択肢ハイライト表示時間（ms）
    transition: 200, // 画面切り替え時間（ms）
    loading: 500,    // 判定中画面の最低表示時間（ms）
  },
  resultUrls: {
    RESTART:  'results/restart.html',
    GROWTH:   'results/growth.html',
    ORGANIZE: 'results/organize.html',
    IT:       'results/it.html',
    SALES:    'results/sales.html',
    PREPARE:  'results/prepare.html',
  },
  share: {
    baseUrl: 'https://twitter.com/intent/tweet',
    hashtag: '30秒転職ルート診断',
  },
};

/* =============================================
   2. 結果タイプと紹介サービスの対応
   公開情報のみを保持する（service_keyは内部の処理識別用）。
   年齢・地域・学歴・雇用形態などの対象条件は保持しない。
   サービスの最新の利用条件は、遷移先の公式ページで
   利用者本人が確認する設計とする。
   ============================================= */
const RESULT_SERVICE_MAP = {
  RESTART:  { serviceKey: 'uzuz' },
  GROWTH:   { serviceKey: 'onecareer' },
  ORGANIZE: { serviceKey: 'adecco' },
  IT:       { serviceKey: 'unison_career' },
  SALES:    { serviceKey: 'hape_agent' },
};

/* =============================================
   3. 質問データ
   各質問の加点ロジックは仕様書に準拠しています。
   ============================================= */
const QUESTIONS = [
  // Q1
  {
    id: 'q1',
    text: '今のあなたに最も近い状況は？',
    choices: [
      {
        id: 'q1a',
        label: '今の会社が社会人1〜2社目で、経験にまだ自信がない',
        score: { RESTART: 3, ORGANIZE: 1 },
        outsideScope: false,
      },
      {
        id: 'q1b',
        label: '社会人経験を生かして、次のキャリアへ進みたい',
        score: { GROWTH: 2, IT: 1, SALES: 1 },
        outsideScope: false,
      },
      {
        id: 'q1c',
        label: '離職中・既卒・短期離職など、職歴に不安がある',
        score: { RESTART: 4, ORGANIZE: 1 },
        outsideScope: false,
      },
      {
        id: 'q1d',
        label: '新卒就活、副業、フリーランスだけを検討している',
        score: {},
        outsideScope: true,
      },
    ],
  },
  // Q2
  {
    id: 'q2',
    text: '今、最も興味がある方向は？',
    choices: [
      {
        id: 'q2a',
        label: 'IT・Web業界やエンジニア職',
        score: { IT: 6 },
        preferredRoute: 'IT',
      },
      {
        id: 'q2b',
        label: '営業職、または営業経験を生かす仕事',
        score: { SALES: 6 },
        preferredRoute: 'SALES',
      },
      {
        id: 'q2c',
        label: '成長企業や、キャリアアップできる環境',
        score: { GROWTH: 5 },
        preferredRoute: 'GROWTH',
      },
      {
        id: 'q2d',
        label: 'まだ職種や方向性を決められていない',
        score: { ORGANIZE: 5 },
        preferredRoute: 'ORGANIZE',
      },
    ],
  },
  // Q3
  {
    id: 'q3',
    text: '転職を考えるうえで、最も大きな悩みは？',
    choices: [
      {
        id: 'q3a',
        label: '経験やスキル、職歴に自信がない',
        score: { RESTART: 4 },
      },
      {
        id: 'q3b',
        label: '自分に向いている仕事が分からない',
        score: { ORGANIZE: 4 },
      },
      {
        id: 'q3c',
        label: '収入・評価・成長環境を変えたい',
        score: { GROWTH: 4 },
      },
      {
        id: 'q3d',
        label: '希望する業界や職種への進み方が分からない',
        scoreConditional: {
          IT:      { IT: 4 },
          SALES:   { SALES: 4 },
          default: { ORGANIZE: 2 },
        },
      },
    ],
  },
  // Q4
  {
    id: 'q4',
    text: 'どのようなサポートがあると動きやすい？',
    choices: [
      {
        id: 'q4a',
        label: '応募書類や面接も含め、基本から支えてほしい',
        score: { RESTART: 3 },
      },
      {
        id: 'q4b',
        label: '希望する業界や職種に詳しい人へ相談したい',
        scoreConditional: {
          IT:      { IT: 4 },
          SALES:   { SALES: 4 },
          default: { ORGANIZE: 2 },
        },
      },
      {
        id: 'q4c',
        label: '複数の選択肢を見ながら、方向性を整理したい',
        score: { ORGANIZE: 3 },
      },
      {
        id: 'q4d',
        label: '成長企業やキャリアアップ求人を知りたい',
        score: { GROWTH: 3 },
      },
    ],
  },
  // Q5
  {
    id: 'q5',
    text: '次の職場で最も変えたいことは？',
    choices: [
      {
        id: 'q5a',
        label: '未経験でも挑戦できる環境やサポート',
        score: { RESTART: 3 },
        scoreConditionalAdd: { IT: { IT: 2 } },
      },
      {
        id: 'q5b',
        label: '専門性や手に職を身につけられること',
        scoreConditional: {
          IT:      { IT: 3 },
          SALES:   { SALES: 2 },
          default: { ORGANIZE: 1 },
        },
      },
      {
        id: 'q5c',
        label: '年収・裁量・キャリアアップ',
        score: { GROWTH: 3 },
        scoreConditionalAdd: { SALES: { SALES: 1 } },
      },
      {
        id: 'q5d',
        label: '自分に合う仕事内容や働き方',
        score: { ORGANIZE: 3 },
      },
    ],
  },
  // Q6
  {
    id: 'q6',
    text: '転職活動を始める時期は？',
    choices: [
      { id: 'q6a', label: 'できれば1か月以内',              readiness: 3 },
      { id: 'q6b', label: '3か月以内を目安に動きたい',       readiness: 2 },
      { id: 'q6c', label: '半年以内に良い選択肢があれば動きたい', readiness: 1 },
      { id: 'q6d', label: 'まだ時期は決めていない',          readiness: 0, score: { PREPARE: 2, ORGANIZE: 1 } },
    ],
  },
  // Q7
  {
    id: 'q7',
    text: '今の段階で、どこまでなら行動できそう？',
    choices: [
      { id: 'q7a', label: '無料相談を利用して具体的に整理したい',       readiness: 3 },
      { id: 'q7b', label: 'まず無料登録して求人や選択肢を比較したい',    readiness: 2, score: { GROWTH: 1, ORGANIZE: 1 } },
      { id: 'q7c', label: 'サービスを使う前に、もう少し情報を集めたい', readiness: 1, score: { PREPARE: 2 } },
      { id: 'q7d', label: '今は登録や相談をするつもりはない',            readiness: 0, notReadyForService: true },
    ],
  },
];

/**
 * タイブレーカー用ラベルマップ
 * 上位2タイプの組み合わせに応じた選択肢ラベル
 */
const TIEBREAKER_LABELS = {
  RESTART:  '経験に自信がなくても始められる転職方法',
  IT:       'IT・Web業界への具体的な進み方',
  SALES:    '営業経験を生かせる会社やキャリア',
  GROWTH:   '成長できる企業やキャリアアップ',
  ORGANIZE: '職種や転職方法を一緒に整理すること',
};

/* =============================================
   4. 内部状態変数
   ============================================= */

/** スコア管理 */
let scores = { RESTART: 0, GROWTH: 0, ORGANIZE: 0, IT: 0, SALES: 0, PREPARE: 0 };

/** 転職意欲スコア */
let readinessScore = 0;

/** Q2で選んだ希望ルート */
let preferredRoute = null;

/** 対象外フラグ */
let outsideScope = false;

/** 登録不要フラグ */
let notReadyForService = false;

/** タイブレーカーを使用したか */
let usedTiebreaker = false;

/** 各質問の回答ID */
let answers = new Array(QUESTIONS.length).fill(null);

/** 現在表示中の質問インデックス */
let currentQuestionIndex = 0;

/** タイブレーカーモード中か */
let isTiebreakerMode = false;

/** タイブレーカーの回答 */
let tiebreakerAnswer = null;

/**
 * 基本7問終了時に保存した上位2タイプ
 * タイブレーカーから戻る際にリセットする
 */
let tiebreakerCandidates = null; // { first: 'RESTART', second: 'ORGANIZE' } 形式

/* =============================================
   5. 処理関数
   ============================================= */

/**
 * 診断ツールを初期化する
 */
function initializeDiagnosis() {
  saveUtmParameters();
  showScreen('start');
  trackEvent('diagnosis_view', {});

  const startBtn = document.getElementById('btn-start');
  if (startBtn) startBtn.addEventListener('click', startDiagnosis);

  // キャラクター画像フォールバック
  const charImg = document.querySelector('.start__character img');
  if (charImg) {
    charImg.style.color = 'transparent';
    charImg.style.fontSize = '0';

    const showFallback = () => {
      const wrapper = charImg.closest('.start__character');
      if (wrapper) {
        wrapper.innerHTML = '<span class="start__character--fallback" aria-hidden="true">🗺️</span>';
      }
    };
    charImg.addEventListener('error', showFallback);
    if (charImg.complete && !charImg.naturalWidth) showFallback();
  }
}

/**
 * 診断を開始する
 */
function startDiagnosis() {
  resetDiagnosis();
  showScreen('question');
  currentQuestionIndex = 0;
  showQuestion(currentQuestionIndex);
  trackEvent('diagnosis_start', {});
}

/**
 * 指定インデックスの質問を表示する
 * @param {number} index
 */
function showQuestion(index) {
  const question = QUESTIONS[index];
  if (!question) return;

  const questionContainer = document.getElementById('question-container');
  if (!questionContainer) return;

  updateProgress(index + 1, CONFIG.totalQuestions);

  const choicesHtml = question.choices.map((choice) => {
    const isSelected = answers[index] === choice.id;
    return `
      <li>
        <button
          class="choice-btn${isSelected ? ' is-selected' : ''}"
          data-choice-id="${choice.id}"
          data-question-index="${index}"
          aria-pressed="${isSelected}"
          tabindex="0"
        >${escapeHtml(choice.label)}</button>
      </li>`;
  }).join('');

  questionContainer.innerHTML = `
    <div class="question-card">
      <p class="question-card__text" id="question-text-${index}">
        ${escapeHtml(question.text)}
      </p>
      <ul class="choices" role="group" aria-labelledby="question-text-${index}">
        ${choicesHtml}
      </ul>
    </div>
    <nav class="question-nav" aria-label="診断ナビゲーション">
      ${index > 0
        ? '<button class="btn-back" id="btn-back" aria-label="前の質問に戻る">前の質問へ</button>'
        : '<span></span>'
      }
      <button class="btn-reset" id="btn-reset">最初からやり直す</button>
    </nav>`;

  questionContainer.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectAnswer(parseInt(btn.dataset.questionIndex, 10), btn.dataset.choiceId);
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });

  const backBtn = document.getElementById('btn-back');
  if (backBtn) backBtn.addEventListener('click', goBack);

  const resetBtn = document.getElementById('btn-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('最初からやり直しますか？')) {
        resetDiagnosis();
        showScreen('start');
        trackEvent('retry_click', {});
      }
    });
  }

  // question_view：answer_id は送信しない
  trackEvent('question_view', { question_id: question.id });

  const questionText = questionContainer.querySelector('.question-card__text');
  if (questionText) {
    questionText.setAttribute('tabindex', '-1');
    questionText.focus();
  }
}

/**
 * タイブレーカー（追加質問）を表示する
 * 上位2タイプに対応する選択肢だけを表示する
 * @param {{ first: string, second: string }} candidates - 上位2タイプ
 */
function showTiebreaker(candidates) {
  const questionContainer = document.getElementById('question-container');
  if (!questionContainer) return;

  isTiebreakerMode = true;
  usedTiebreaker = true;
  tiebreakerCandidates = candidates;

  updateProgress(CONFIG.totalQuestions, CONFIG.totalQuestions);

  // 上位2タイプの選択肢だけを生成
  const tbChoices = [candidates.first, candidates.second].map(type => ({
    id: 'tb_' + type.toLowerCase(),
    type: type,
    label: TIEBREAKER_LABELS[type] || type,
  }));

  const choicesHtml = tbChoices.map(choice => `
    <li>
      <button
        class="choice-btn"
        data-choice-id="${choice.id}"
        data-choice-type="${choice.type}"
        aria-pressed="false"
        tabindex="0"
      >${escapeHtml(choice.label)}</button>
    </li>`).join('');

  questionContainer.innerHTML = `
    <div class="question-card">
      <p class="question-card__text" id="question-text-tb">
        今のあなたが、最も相談したいことは？
      </p>
      <ul class="choices" role="group" aria-labelledby="question-text-tb">
        ${choicesHtml}
      </ul>
    </div>
    <nav class="question-nav" aria-label="診断ナビゲーション">
      <button class="btn-back" id="btn-back-tb" aria-label="前の質問に戻る">前の質問へ</button>
      <button class="btn-reset" id="btn-reset-tb">最初からやり直す</button>
    </nav>`;

  questionContainer.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectTiebreakerAnswer(btn.dataset.choiceId, btn.dataset.choiceType);
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });

  // 戻るボタン：タイブレーカー関連状態をリセット
  const backBtn = document.getElementById('btn-back-tb');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      usedTiebreaker = false;
      tiebreakerAnswer = null;
      isTiebreakerMode = false;
      tiebreakerCandidates = null;
      currentQuestionIndex = QUESTIONS.length - 1;
      showQuestion(currentQuestionIndex);
      trackEvent('diagnosis_back', { question_id: 'tb' });
    });
  }

  const resetBtn = document.getElementById('btn-reset-tb');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('最初からやり直しますか？')) {
        resetDiagnosis();
        showScreen('start');
        trackEvent('retry_click', {});
      }
    });
  }

  trackEvent('question_view', { question_id: 'tb' });
}

/**
 * 回答を選択する（基本7問用）
 * @param {number} questionIndex
 * @param {string} choiceId
 */
function selectAnswer(questionIndex, choiceId) {
  const question = QUESTIONS[questionIndex];
  if (!question) return;
  const choice = question.choices.find(c => c.id === choiceId);
  if (!choice) return;

  // ハイライト表示
  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.classList.remove('is-selected');
    btn.setAttribute('aria-pressed', 'false');
  });
  const selectedBtn = document.querySelector(`[data-choice-id="${choiceId}"]`);
  if (selectedBtn) {
    selectedBtn.classList.add('is-selected');
    selectedBtn.setAttribute('aria-pressed', 'true');
  }

  answers[questionIndex] = choiceId;

  // フラグ処理
  if (choice.outsideScope) outsideScope = true;
  if (choice.notReadyForService) notReadyForService = true;
  if (choice.preferredRoute !== undefined) preferredRoute = choice.preferredRoute;

  // question_answer：question_id のみ送信（answer_idなどの回答内容は送信しない）
  trackEvent('question_answer', { question_id: question.id });

  setTimeout(() => {
    if (questionIndex + 1 < QUESTIONS.length) {
      currentQuestionIndex = questionIndex + 1;
      showQuestion(currentQuestionIndex);
    } else {
      runDiagnosis();
    }
  }, CONFIG.animation.highlight);
}

/**
 * タイブレーカーの回答を選択する
 * 選んだタイプを直接最終結果にする
 * @param {string} choiceId
 * @param {string} choiceType - 'RESTART' | 'IT' | 'SALES' | 'GROWTH' | 'ORGANIZE'
 */
function selectTiebreakerAnswer(choiceId, choiceType) {
  const selectedBtn = document.querySelector(`[data-choice-id="${choiceId}"]`);
  if (selectedBtn) {
    selectedBtn.classList.add('is-selected');
    selectedBtn.setAttribute('aria-pressed', 'true');
  }

  tiebreakerAnswer = choiceType;
  trackEvent('question_answer', { question_id: 'tb' });

  setTimeout(() => { runDiagnosis(); }, CONFIG.animation.highlight);
}

/**
 * 前の質問へ戻る
 */
function goBack() {
  trackEvent('diagnosis_back', { question_id: QUESTIONS[currentQuestionIndex].id });
  currentQuestionIndex = Math.max(0, currentQuestionIndex - 1);
  showQuestion(currentQuestionIndex);
}

/**
 * 過去の回答状態を復元する（showQuestion内で対応済み・拡張用）
 * @param {number} questionIndex
 */
function restoreAnswerState(questionIndex) {
  const savedAnswer = answers[questionIndex];
  if (!savedAnswer) return;
  const btn = document.querySelector(`[data-choice-id="${savedAnswer}"]`);
  if (btn) {
    btn.classList.add('is-selected');
    btn.setAttribute('aria-pressed', 'true');
  }
}

/**
 * スコアを全回答から再計算する
 */
function calculateScores() {
  scores = { RESTART: 0, GROWTH: 0, ORGANIZE: 0, IT: 0, SALES: 0, PREPARE: 0 };
  readinessScore = 0;
  preferredRoute = null;
  outsideScope = false;
  notReadyForService = false;

  answers.forEach((choiceId, qIndex) => {
    if (choiceId === null) return;
    const question = QUESTIONS[qIndex];
    const choice = question.choices.find(c => c.id === choiceId);
    if (!choice) return;

    if (choice.outsideScope) outsideScope = true;
    if (choice.notReadyForService) notReadyForService = true;
    if (choice.preferredRoute !== undefined) preferredRoute = choice.preferredRoute;
    if (choice.readiness !== undefined) readinessScore += choice.readiness;

    if (choice.score) {
      Object.entries(choice.score).forEach(([type, point]) => {
        scores[type] = (scores[type] || 0) + point;
      });
    }

    if (choice.scoreConditional) {
      const conditional = choice.scoreConditional[preferredRoute] || choice.scoreConditional.default;
      if (conditional) {
        Object.entries(conditional).forEach(([type, point]) => {
          scores[type] = (scores[type] || 0) + point;
        });
      }
    }

    if (choice.scoreConditionalAdd) {
      const addScore = choice.scoreConditionalAdd[preferredRoute];
      if (addScore) {
        Object.entries(addScore).forEach(([type, point]) => {
          scores[type] = (scores[type] || 0) + point;
        });
      }
    }
  });
}

/**
 * PREPAREを表示すべきか判定する
 * @returns {boolean}
 */
function checkPrepareResult() {
  if (outsideScope) return true;
  if (notReadyForService) return true;
  if (readinessScore <= 1) return true;

  const eligibleTypes = ['RESTART', 'GROWTH', 'ORGANIZE', 'IT', 'SALES'];
  const hasEligible = eligibleTypes.some(type => checkEligibility(type));
  if (!hasEligible) return true;

  return false;
}

/**
 * 指定タイプに紹介サービスが存在するか確認する
 * 年齢・地域・学歴・雇用形態などの対象条件チェックは行わない。
 * サービスの利用条件は遷移先の公式ページで利用者本人が確認する。
 * @param {string} type
 * @returns {boolean}
 */
function checkEligibility(type) {
  return Object.prototype.hasOwnProperty.call(RESULT_SERVICE_MAP, type);
}

/**
 * スコアを降順にランキングした配列を返す
 * @returns {Array<{type: string, score: number}>}
 */
function getRankedResults() {
  const targetTypes = ['RESTART', 'GROWTH', 'ORGANIZE', 'IT', 'SALES'];
  return targetTypes
    .filter(type => checkEligibility(type))
    .map(type => ({ type, score: scores[type] }))
    .sort((a, b) => b.score - a.score);
}

/**
 * タイブレーカーが必要か判定する
 * @param {Array} ranked
 * @returns {boolean}
 */
function needsTiebreaker(ranked) {
  if (ranked.length < 2) return false;
  return Math.abs(ranked[0].score - ranked[1].score) <= 1;
}

/**
 * タイブレーカー結果から最終タイプを確定する
 * 選択タイプを優先し、紹介サービスがなければ対方、両方なければPREPARE
 * @returns {string}
 */
function determineTiebreakerResult() {
  if (!tiebreakerAnswer || !tiebreakerCandidates) return 'PREPARE';

  const selected = tiebreakerAnswer;
  const other = (selected === tiebreakerCandidates.first)
    ? tiebreakerCandidates.second
    : tiebreakerCandidates.first;

  if (checkEligibility(selected)) return selected;
  if (checkEligibility(other)) return other;
  return 'PREPARE';
}

/**
 * 最終結果タイプを確定する
 * @returns {string} 結果タイプID、または '__TIEBREAKER__'
 */
function determineFinalResult() {
  calculateScores();

  if (checkPrepareResult()) return 'PREPARE';

  // タイブレーカー済みの場合は選択タイプを優先
  if (usedTiebreaker && tiebreakerAnswer) {
    return determineTiebreakerResult();
  }

  const ranked = getRankedResults();
  if (ranked.length === 0) return 'PREPARE';

  if (!needsTiebreaker(ranked)) return ranked[0].type;

  // タイブレーカーが必要 → 上位2タイプを保存して返す
  return '__TIEBREAKER__';
}

/**
 * 診断を実行し、結果へ遷移する
 * 重要: determineFinalResult() 内で calculateScores() が走るため、
 *       ランキングは必ずその後に取得する
 */
function runDiagnosis() {
  // 1〜3. スコア計算 → PREPARE判定 → タイブレーカー済みなら最終確定
  let result = determineFinalResult();

  if (result === '__TIEBREAKER__') {
    // 4. 最新スコアからランキングを取得（calculateScores後）
    const ranked = getRankedResults();
    // 5. 最新ランキングの上位2タイプだけを追加質問に表示
    showTiebreaker({
      first: ranked[0].type,
      second: ranked[1].type,
    });
    return;
  }

  showScreen('loading');
  setTimeout(() => {
    const utmData = getUtmParameters();
    trackEvent('diagnosis_complete', {
      result_type: result,
      question_count: usedTiebreaker ? CONFIG.totalQuestions + 1 : CONFIG.totalQuestions,
      used_tiebreaker: usedTiebreaker,
      utm_source: utmData.utm_source || '',
      utm_medium: utmData.utm_medium || '',
      utm_campaign: utmData.utm_campaign || '',
    });
    redirectToResult(result);
  }, CONFIG.animation.loading);
}

/**
 * UTMパラメータをsessionStorageへ保存する
 */
function saveUtmParameters() {
  const params = new URLSearchParams(window.location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(key => {
    const value = params.get(key);
    if (value) sessionStorage.setItem(key, value);
  });
}

/**
 * sessionStorageからUTMパラメータを取得する
 * @returns {Object}
 */
function getUtmParameters() {
  const result = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(key => {
    const value = sessionStorage.getItem(key);
    if (value) result[key] = value;
  });
  return result;
}

/**
 * 診断状態をすべてリセットする
 */
function resetDiagnosis() {
  scores = { RESTART: 0, GROWTH: 0, ORGANIZE: 0, IT: 0, SALES: 0, PREPARE: 0 };
  readinessScore = 0;
  preferredRoute = null;
  outsideScope = false;
  notReadyForService = false;
  usedTiebreaker = false;
  answers = new Array(QUESTIONS.length).fill(null);
  currentQuestionIndex = 0;
  isTiebreakerMode = false;
  tiebreakerAnswer = null;
  tiebreakerCandidates = null;
}

/**
 * 結果ページへ遷移する（回答内容はURLに含めない）
 * @param {string} resultType
 */
function redirectToResult(resultType) {
  const url = CONFIG.resultUrls[resultType];
  if (!url) { console.error('結果URLが見つかりません:', resultType); return; }
  window.location.href = url;
}

/* =============================================
   ユーティリティ
   ============================================= */

/**
 * 指定画面を表示し他を非表示にする
 * @param {string} screenName
 */
function showScreen(screenName) {
  ['start', 'question', 'loading'].forEach(name => {
    const el = document.getElementById('screen-' + name);
    if (!el) return;
    if (name === screenName) {
      el.style.display = '';
      el.classList.add('is-active');
    } else {
      el.style.display = 'none';
      el.classList.remove('is-active');
    }
  });
}

/**
 * プログレスバーと進捗テキストを更新する
 * @param {number} current
 * @param {number} total
 */
function updateProgress(current, total) {
  const fill = document.getElementById('progress-fill');
  const countEl = document.getElementById('progress-count');
  const timeEl = document.getElementById('progress-time');
  const bar = document.querySelector('.progress-bar');

  const pct = Math.round((current / total) * 100);

  if (fill) fill.style.width = pct + '%';

  // aria属性を更新
  if (bar) {
    bar.setAttribute('aria-valuenow', current);
    bar.setAttribute('aria-valuetext', current + '問目 / 全' + total + '問');
  }

  if (countEl) countEl.textContent = current + ' / ' + total + '問';
  if (timeEl) {
    const remaining = Math.ceil((total - current + 1) * 4);
    timeEl.textContent = remaining > 0 ? '残り約' + remaining + '秒' : '';
  }
}

/**
 * XSS対策: HTMLエスケープ
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* =============================================
   初期化
   ============================================= */
document.addEventListener('DOMContentLoaded', initializeDiagnosis);
