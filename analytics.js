// ‏מדידת כניסות לאתר (Google Analytics 4), נוסף 26.11.2026.
//
// ‏עד היום לא היה לאתר שום נתון כניסות: לא GA ולא Search Console. ‏GitHub Pages לא
// ‏נותן סטטיסטיקה, ו«Traffic» בריפו סופר רק את דף הקוד ולא את האתר.
//
// ‏🔴 ‏כל עוד MEASUREMENT_ID ריק, הקובץ לא עושה כלום. ‏המזהה מגיע מערוץ מדידה (web app)
// ‏נפרד בפרויקט Firebase ‏`siddurhayom`, ‏ולא מזה של לוח העבודה (G-2L0NHHZBK6), כדי
// ‏שכניסות לאתר לא יתערבבו עם כניסות ללוח. ‏⚠️ ‏זה אותו נכס GA4 של האפליקציות, ולכן
// ‏`tool/analytics_report.py` ‏יספור גם את האתר עד שיסונן לפי פלטפורמה (platform != web).
//
// ‏מה נאסף ומתי: כמו האפליקציה (privacy.html, ‏«נתוני שימוש»), עם שני הבדלים מכוונים:
//   ‏1. ‏דפדפן שמבקש לא לעקוב (Do Not Track / Global Privacy Control) ‏לא נמדד בכלל.
//   ‏2. ‏אזור זמן אירופי (האיחוד, ‏EEA, ‏בריטניה) לא נמדד בכלל. ‏באפליקציה יש שם שאלת
//      ‏הסכמה; ‏באתר אין באנר הסכמה, ולכן ההכרעה היא לוותר על המדידה שם ולא לשאול.
//      ‏נדחה: consent mode עם analytics_storage=denied ‏- ‏עדיין שולח פינגים בלי עוגייה,
//      ‏כלומר עדיין איסוף, ובדוחות הרגילים הם כמעט לא נראים, אז אין בזה תועלת.
// ‏אותות פרסום כבויים תמיד (ad_* denied, ‏google signals כבוי), ‏כי המדיניות אומרת
// ‏שהנתונים אינם משמשים לפרסום.
(function () {
  var MEASUREMENT_ID = 'G-CDGGDHCENP';
  if (!MEASUREMENT_ID) { return; }

  var dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1' ||
            navigator.msDoNotTrack === '1' || navigator.globalPrivacyControl === true;
  if (dnt) { return; }

  var tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { /* דפדפן ישן */ }
  // ‏כל Europe/* ‏(כולל לונדון), ‏ועוד אזורי זמן של מדינות EEA ‏מחוץ לקידומת הזו.
  var europe = /^Europe\//.test(tz) ||
               /^(Atlantic\/(Reykjavik|Azores|Madeira|Canary|Faroe)|Arctic\/Longyearbyen|Asia\/Nicosia|Asia\/Famagusta)$/.test(tz);
  if (europe) { return; }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted'
  });
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
  document.head.appendChild(s);
})();
