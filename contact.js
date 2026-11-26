// ‏חלון «צרו קשר» בתוך האתר, נוסף 26.11.2026 לבקשת אורי.
//
// ‏עד אז כל קישור «צרו קשר» היה mailto: ישיר, ולחיצה עליו יצאה מהאתר ופתחה את
// ‏Gmail (או כל תוכנת דואר אחרת) מיד. ‏אורי: «לא טוב, עדיף שיפתח חלון בתוך האתר
// ‏שמראה את המייל, וגם מסביר שאפשר לפנות גם דרך האפליקציה, וגם נותן אופציה ללחוץ
// ‏כדי שיפתח מייל בחלון נפרד».
//
// ‏איך: כל <a href="mailto:..."> באתר (בסרגל, בתחתית, ובקישורי «לפנות אלינו»
// ‏בפרטיות ובנגישות) נתפס כאן ופותח <dialog>. ‏בלי JavaScript, או בדפדפן בלי
// ‏<dialog>, הקישור נשאר mailto: רגיל ועובד כמו קודם - אין מצב שבו אי אפשר לפנות.
// ‏כפתור «פתיחה בתוכנת הדואר» בתוך החלון הוא mailto: אמיתי, ולכן לא נתפס שוב.
//
// ‏השם «פנייה ומשוב» הוא השם של השורה באפליקציה (`feedbackMenuItem`), והתשובה
// ‏אכן מגיעה לשם («הפניות שלי», `feedbackEmailFooter`).
(function () {
  if (typeof HTMLDialogElement !== 'function') { return; }

  var EMAIL = 'siddurhayom@gmail.com';
  var he = (document.documentElement.lang || 'he').indexOf('he') === 0;
  var T = he ? {
    title: 'צרו קשר',
    lead: 'אפשר לכתוב לנו לכתובת:',
    app: 'אפשר לפנות אלינו גם מתוך האפליקציה, ב״פנייה ומשוב״ שבמסך ההגדרות, והתשובה תגיע לשם.',
    copy: 'העתקת הכתובת',
    copied: 'הכתובת הועתקה',
    open: 'פתיחה באפליקציית הדוא״ל',
    close: 'סגירה'
  } : {
    title: 'Contact Us',
    lead: 'You can write to us at:',
    app: 'You can also reach us from inside the app, under "Feedback" in Settings, and the reply will arrive there.',
    copy: 'Copy address',
    copied: 'Address copied',
    open: 'Open in your email app',
    close: 'Close'
  };

  var dlg = null;

  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'contact-dialog';
    dlg.setAttribute('aria-labelledby', 'contact-dialog-title');
    dlg.innerHTML =
      '<h2 id="contact-dialog-title"></h2>' +
      '<p class="contact-lead"></p>' +
      '<p class="contact-email" dir="ltr"></p>' +
      '<p class="contact-app"></p>' +
      '<div class="contact-actions">' +
        '<a class="btn btn-gold contact-open" target="_blank" rel="noopener"></a>' +
        '<button type="button" class="btn contact-copy"></button>' +
      '</div>' +
      '<button type="button" class="contact-close"></button>';
    dlg.querySelector('h2').textContent = T.title;
    dlg.querySelector('.contact-lead').textContent = T.lead;
    dlg.querySelector('.contact-email').textContent = EMAIL;
    dlg.querySelector('.contact-app').textContent = T.app;
    var open = dlg.querySelector('.contact-open');
    open.textContent = T.open;
    open.href = 'mailto:' + EMAIL;
    open.addEventListener('click', function () { dlg.close(); });
    var copy = dlg.querySelector('.contact-copy');
    copy.textContent = T.copy;
    copy.addEventListener('click', function () {
      var done = function () { copy.textContent = T.copied; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(done, selectEmail);
      } else {
        selectEmail();
      }
    });
    var close = dlg.querySelector('.contact-close');
    close.textContent = T.close;
    close.addEventListener('click', function () { dlg.close(); });
    // ‏לחיצה על הרקע מחוץ לחלון סוגרת אותו (ה-dialog עצמו הוא היעד רק ברקע).
    dlg.addEventListener('click', function (e) { if (e.target === dlg) { dlg.close(); } });
    document.body.appendChild(dlg);
  }

  // ‏גיבוי כשאין גישה ללוח ההעתקה (http, דפדפן ישן): מסמן את הכתובת, ו-Ctrl/⌘+C עובד.
  function selectEmail() {
    var el = dlg.querySelector('.contact-email');
    var r = document.createRange();
    r.selectNodeContents(el);
    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="mailto:"]');
    if (!a || a.classList.contains('contact-open')) { return; }
    if (e.metaKey || e.ctrlKey || e.shiftKey) { return; }
    e.preventDefault();
    if (!dlg) { build(); }
    dlg.querySelector('.contact-copy').textContent = T.copy;
    dlg.showModal();
  });
})();
