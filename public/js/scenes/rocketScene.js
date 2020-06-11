/**
 * File: /Users/bradsmialek/tlg/javaScript/projects/gameUp_Inc/public/js/scenes/cut2.js
 * Project: /Users/bradsmialek/tlg/javaScript/projects/gameUp_Inc
 * Created Date: Wednesday, June 10th 2020, 7:24:00 pm
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


//rocket to space scene
class RocketScene extends Phaser.Scene {
  constructor() {
    super('RocketScene')
  }
  preload() {
    //load images and sound
    // this.load.image("face", "images/face.png");

  }

  create() {

    // this.face = this.add.image(100, 200, "face");


    //   var frameNames = this.anims.generateFrameNumbers('rocket');

    //   this.anims.create({
    //     key: 'fly',
    //     frames: frameNames,
    //     frameRate: 8,
    //     repeat: -1
    //   });

    //   this.char.play('fly')

    //   this.tweens.add({
    //     targets: this.char,
    //     duration: 5000,
    //     x: game.config.width,
    //     y: 0,
    //     alpha: 0
    //   });

    exitThisScene();
  }

  exitThisScene() {
    this.scene.start('SceneMain', {

    });
  }

  update() {
    //constant running loop
    // this.char.x++
  }
}