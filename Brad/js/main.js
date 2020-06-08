/**
 * File: /Users/bradsmialek/tlg/javaScript/projects/gameUp_Inc/Brad/js/main.js
 * Project: /Users/bradsmialek
 * Created Date: Monday, June 8th 2020, 9:27:47 am
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

var game;
var model;
var emitter;
var G;
var controller;
window.onload = function () {
  var isMobile = navigator.userAgent.indexOf("Mobile");
  if (isMobile == -1) {
    isMobile = navigator.userAgent.indexOf("Tablet");
  }
  //
  //
  if (isMobile == -1) {
    var config = {
      type: Phaser.AUTO,
      width: 480,
      height: 640,
      parent: 'phaser-game',
      physics: {
        default: 'arcade',
        arcade: {
          debug: true
        }
      },
      scene: [SceneLoad, SceneTitle, SceneMain, SceneOver]
    };
  } else {
    var config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: 'phaser-game',
      physics: {
        default: 'arcade',
        arcade: {
          debug: true
        }
      },
      scene: [SceneLoad, SceneTitle, SceneMain, SceneOver]
    };
  }
  G = new Constants();
  model = new Model();
  model.isMobile = isMobile;
  game = new Phaser.Game(config);
}