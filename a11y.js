/* ===================================================
   סידור היום — Accessibility widget
   כלי נגישות: הגדלת/הקטנת טקסט, ניגודיות גבוהה,
   הדגשת קישורים, עצירת אנימציות, ודילוג-לתוכן.
   כל ההעדפות נשמרות ב-localStorage.
   =================================================== */
(function () {
  'use strict';

  var isHe = (document.documentElement.lang || 'he').toLowerCase().indexOf('en') !== 0;

  var T = isHe ? {
    open:      'תפריט נגישות',
    title:     'נגישות',
    bigger:    'הגדל טקסט',
    smaller:   'הקטן טקסט',
    contrast:  'ניגודיות גבוהה',
    underline: 'הדגשת קישורים',
    noanim:    'עצירת אנימציות',
    reset:     'איפוס הגדרות',
    skip:      'דילוג לתוכן הראשי'
  } : {
    open:      'Accessibility menu',
    title:     'Accessibility',
    bigger:    'Increase text',
    smaller:   'Decrease text',
    contrast:  'High contrast',
    underline: 'Highlight links',
    noanim:    'Stop animations',
    reset:     'Reset settings',
    skip:      'Skip to main content'
  };

  var MIN = 100, MAX = 160, STEP = 10;

  var state = {
    font:      parseInt(localStorage.getItem('a11yFont'), 10) || 100,
    contrast:  localStorage.getItem('a11yContrast') === '1',
    underline: localStorage.getItem('a11yUnderline') === '1',
    noanim:    localStorage.getItem('a11yNoAnim') === '1'
  };

  function apply() {
    document.documentElement.style.fontSize = (16 * state.font / 100) + 'px';
    document.body.classList.toggle('a11y-contrast', state.contrast);
    document.body.classList.toggle('a11y-underline', state.underline);
    document.body.classList.toggle('a11y-no-anim', state.noanim);
    localStorage.setItem('a11yFont', String(state.font));
    localStorage.setItem('a11yContrast', state.contrast ? '1' : '0');
    localStorage.setItem('a11yUnderline', state.underline ? '1' : '0');
    localStorage.setItem('a11yNoAnim', state.noanim ? '1' : '0');
  }

  function makeBtn(icon, label, onClick, pressed) {
    var b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = '<span class="a11y-icn" aria-hidden="true">' + icon + '</span><span>' + label + '</span>';
    if (typeof pressed === 'boolean') b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    b.addEventListener('click', onClick);
    return b;
  }

  function init() {
    /* יעד הדילוג — הוספת מזהה ל-<main> */
    var main = document.querySelector('main');
    if (main) {
      if (!main.id) main.id = 'main';
      main.setAttribute('tabindex', '-1');
    }

    /* קישור דילוג-לתוכן (ראשון בגוף העמוד) */
    if (main) {
      var skip = document.createElement('a');
      skip.href = '#' + main.id;
      skip.className = 'skip-link';
      skip.textContent = T.skip;
      document.body.insertBefore(skip, document.body.firstChild);
    }

    /* כפתור פתיחה */
    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'a11y-toggle';
    toggle.setAttribute('aria-label', T.open);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'a11y-panel');
    toggle.innerHTML = '<span aria-hidden="true">&#9855;</span>';

    /* פאנל */
    var panel = document.createElement('div');
    panel.className = 'a11y-panel';
    panel.id = 'a11y-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', T.title);
    panel.hidden = true;

    var h = document.createElement('h2');
    h.textContent = T.title;
    panel.appendChild(h);

    var bBigger = makeBtn('A+', T.bigger, function () {
      state.font = Math.min(MAX, state.font + STEP); apply();
    });
    var bSmaller = makeBtn('A&minus;', T.smaller, function () {
      state.font = Math.max(MIN, state.font - STEP); apply();
    });
    var bContrast = makeBtn('&#9681;', T.contrast, function () {
      state.contrast = !state.contrast; bContrast.setAttribute('aria-pressed', state.contrast); apply();
    }, state.contrast);
    var bUnderline = makeBtn('&#95;', T.underline, function () {
      state.underline = !state.underline; bUnderline.setAttribute('aria-pressed', state.underline); apply();
    }, state.underline);
    var bNoAnim = makeBtn('&#10074;&#10074;', T.noanim, function () {
      state.noanim = !state.noanim; bNoAnim.setAttribute('aria-pressed', state.noanim); apply();
    }, state.noanim);

    var bReset = makeBtn('&#8635;', T.reset, function () {
      state.font = 100; state.contrast = false; state.underline = false; state.noanim = false;
      bContrast.setAttribute('aria-pressed', 'false');
      bUnderline.setAttribute('aria-pressed', 'false');
      bNoAnim.setAttribute('aria-pressed', 'false');
      apply();
    });
    bReset.classList.add('a11y-reset');

    [bBigger, bSmaller, bContrast, bUnderline, bNoAnim, bReset].forEach(function (b) {
      panel.appendChild(b);
    });

    function openPanel() {
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      bBigger.focus();
    }
    function closePanel(returnFocus) {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) toggle.focus();
    }
    toggle.addEventListener('click', function () {
      if (panel.hidden) openPanel(); else closePanel(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) closePanel(true);
    });
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !panel.contains(e.target) && e.target !== toggle) closePanel(false);
    });

    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
