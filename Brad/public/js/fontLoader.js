/**
 * File: /Users/bradsmialek/tlg/javaScript/projects/gameUp_Inc/Brad/js/game.js
 * Project: /Users/bradsmialek
 * Created Date: Monday, June 8th 2020, 9:27:57 am
 * Author: Brad Smialek
 * ------------------------------------
 * Quokka: option q, q
 * Comments: option d
 * Highlight Line Wrap: command h, '
 * Peacock: option p, c
 * Line String Log: command L
 * Down log: command k
 * comment: option x
 * comment: option y
 */

WebFontConfig = {
  google: {
    families: ["Fresca", "Flamenco", "Indie Flower", 'Anton']
  }
};
(function () {
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();