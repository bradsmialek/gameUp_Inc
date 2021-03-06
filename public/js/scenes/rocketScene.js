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
var MediaManagerBackground1;
class RocketScene extends Phaser.Scene {
  constructor() {
    super('RocketScene')
  }
  preload() {

  }

  create() {
    MediaManagerBackground1 = new MediaManager({
      scene: this
    });
    MediaManagerBackground1.setBackgroundMusic("backgroundmusic");
    // create an tiled sprite with the size of our game screen
    this.bg_1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg_1");
    // Set its pivot to the top left corner
    this.bg_1.setOrigin(0, 0);
    // fixe it so it won't move when the camera moves.
    // Instead we are moving its texture on the update
    this.bg_1.setScrollFactor(0);

    this.bg_5 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg_5");
    this.bg_5.setOrigin(0, 0);
    this.bg_5.setScrollFactor(0);

    this.bg_6 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg_6");
    this.bg_6.setOrigin(0, 0);
    this.bg_6.setScrollFactor(0);

    this.spaceShuttle = this.physics.add.sprite(game.config.width / 2, game.config.height * 1, "shuttle");
    this.singleBoy = this.physics.add.sprite(game.config.width / 2, game.config.height * 1, 'singleBoy');

    const trigger = this.physics.add.staticImage(400, 0, 'books');
    trigger.alpha = 0;
    this.physics.add.collider(this.singleBoy, trigger, this.goToGame, null, this);

  }


  goToGame() {
    this.scene.start("SceneMain")
    MediaManagerBackground1.setStopMusic();
  }

  moveRocket(rocket, boy) {
    rocket.y--;
    boy.y--;
  }

  update() {

    this.moveRocket(this.spaceShuttle, this.singleBoy);

    this.bg_1.tilePositionY -= .5;
    this.bg_5.tilePositionY -= 3;
    this.bg_6.tilePositionY -= 8;
  }

}
