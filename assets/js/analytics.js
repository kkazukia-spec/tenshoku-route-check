/**
 * アクセス解析処理 - 全ページ共通
 * れん｜20代転職の道案内
 *
 * ■ 有効化方法
 *   ANALYTICS_CONFIG.enabled = true に変更し
 *   measurementId に GA4測定ID（例: G-XXXXXXXXXX）を入力してください。
 *
 * ■ 送信するイベント（内部IDのみ、個人情報・回答文は送信しない）
 *   diagnosis_view / diagnosis_start / question_view / diagnosis_complete
 *   result_view / affiliate_cta_click / retry_click / share_click
 *
 * ■ 送信しない情報
 *   answer_id / 回答文 / 個人情報 / 回答の組み合わせ
 */

(function () {
  'use strict';

  /* =============================================
     解析設定
     measurementId が空の場合は GA4を読み込まない
     ============================================= */
  const ANALYTICS_CONFIG = {
    enabled: false,
    provider: 'ga4',
    measurementId: '', // 例: 'G-XXXXXXXXXX'
  };

  /**
   * GA4スクリプトを動的に読み込む
   * @param {string} measurementId
   */
  function loadGA4(measurementId) {
    if (!measurementId) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: true,
      anonymize_ip: true,
    });
  }

  /**
   * アクセス解析イベントを送信する（全ページから window.trackEvent で呼び出す）
   * enabled が false または measurementId が空の場合は何もしない
   * 回答内容・個人情報は送信しない
   *
   * @param {string} eventName - イベント名
   * @param {Object} params    - イベントパラメータ（内部IDのみ）
   */
  window.trackEvent = function (eventName, params) {
    if (!ANALYTICS_CONFIG.enabled) return;
    if (!ANALYTICS_CONFIG.measurementId) return;
    if (typeof window.gtag !== 'function') return;

    // answer_id が含まれていたら除去（安全装置）
    const safeParams = Object.assign({}, params);
    delete safeParams.answer_id;

    window.gtag('event', eventName, safeParams);
  };

  /**
   * 結果ページ表示時に result_view を1回送信する
   * data-result-type 属性から結果タイプを取得する
   */
  function sendResultView() {
    const el = document.querySelector('[data-result-type]');
    if (!el) return;
    const resultType = el.dataset.resultType;
    if (resultType) {
      window.trackEvent('result_view', { result_type: resultType });
    }
  }

  /**
   * affiliate-slot 内のリンククリックを計測する
   * 広告コード自体は改変しない（親要素のイベントリスナーで検知）
   * a要素のクリック時のみ計測し、プレースホルダーのクリックでは計測しない（修正2）
   */
  function setupAffiliateTracking() {
    document.querySelectorAll('.affiliate-slot').forEach(function (slot) {
      slot.addEventListener('click', function (e) {
        // PREPARE ページは計測しない（data-no-affiliate 属性で制御）
        if (slot.closest('[data-no-affiliate]')) return;

        // クリック対象またはその親に a要素が存在するときだけ計測（修正2）
        // プレースホルダーのクリックでは計測しない
        const link = e.target.closest('a');
        if (!link || !slot.contains(link)) return;

        const resultTypeEl = document.querySelector('[data-result-type]');
        const resultType = resultTypeEl ? resultTypeEl.dataset.resultType : '';
        const serviceKey = slot.dataset.serviceKey || '';
        const ctaPosition = slot.dataset.ctaPosition || '';

        window.trackEvent('affiliate_cta_click', {
          result_type: resultType,
          service_key: serviceKey,
          cta_position: ctaPosition,
        });
      });
    });
  }

  /**
   * 初期化処理
   */
  function init() {
    if (ANALYTICS_CONFIG.enabled && ANALYTICS_CONFIG.measurementId) {
      loadGA4(ANALYTICS_CONFIG.measurementId);
    }

    // 結果ページ：result_view 送信 + 広告クリック計測
    sendResultView();
    setupAffiliateTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
