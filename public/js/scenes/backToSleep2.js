/**
 * File: /Users/bradsmialek/tlg/javaScript/projects/gameUp_Inc/public/js/scenes/wakeup.js
 * Project: /Users/bradsmialek/tlg/javaScript/projects/gameUp_Inc
 * Created Date: Wednesday, June 10th 2020, 7:24:14 pm
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


// const SOUND_DREAM = 'havingDreamSound';
// const BOY = 'boy';
// const SOUND_DOORCLOSE = 'doorCloseSound';
// const SOUND_STAIRS = 'stairsSound';
// const SCENE_NEXT = 'Game';

// var timedEvent;
// var c = 0;
// var timeSecondOld = 0;
// var timeSecond = 0;
// var timerRemaining;
// var timeTick = 0;

// var textMom;
// var textChild;
// var spaceKeyStatus = 0;
// var oldCursor = 1;
// var disableCursor = true;
// var flagCharTouchedBed = false;
// var flagCharTouchedBedOld = false;
// var storeTimeValue = 0;
// var doorCloseSoundPlayed = false;
// var starsSoundPlayed = false;

class BackToSleep2 extends Phaser.Scene {
  constructor() {
    super('BackToSleep2')
    this.playerBoy = undefined;
    this.cursors = undefined;
  }

  preload() {}

  create() {
    emitter = new Phaser.Events.EventEmitter();
    controller = new Controller();
    var mediaManager = new MediaManager({
      scene: this
    });
    mediaManager.setBackgroundMusic("skywave");

    this.alignGrid = new AlignGrid({
      rows: 11,
      cols: 11,
      scene: this
    });
    // this.alignGrid.showNumbers();


    var btn1 = new FlatButton({
      scene: this,
      key: 'button3',
      text: 'Quit Game',
      event: 'quit_game'
    });
    this.alignGrid.placeAtIndex(49, btn1);
    emitter.on('quit_game', this.endGame, this);

    var btn2 = new FlatButton({
      scene: this,
      key: 'button4',
      text: 'Sleep',
      event: 'sleep'
    });
    this.alignGrid.placeAtIndex(27, btn2);
    emitter.on('sleep', this.sleepy, this);


    const trigger = this.physics.add.staticImage(160, 520, 'books'); // change to astronaut for trigger
    const bookcase2 = this.physics.add.staticImage(340, 420, 'bookcase2');
    const bookcase1 = this.physics.add.staticImage(300, 420, 'bookcase1');
    const desk = this.physics.add.staticImage(460, 460, 'desk');
    const lamp = this.physics.add.staticImage(180, 420, 'lampTall');
    const books = this.physics.add.staticImage(430, 425, 'books');
    const platforms = this.createPlatforms();
    const chair = this.physics.add.staticImage(560, 480, 'chair').setScale(0.8).refreshBody();
    const doorway = this.physics.add.staticImage(670, 480, 'door').setScale(1.1).refreshBody();
    const bed = this.physics.add.staticImage(160, 520, 'bed');
    const plant = this.physics.add.staticImage(30, 525, 'plant');

    this.physics.add.collider(this.playerBoy, platforms);
    this.physics.add.collider(this.playerBoy, trigger, this.touchBed, null, this);
    this.cursors = this.input.keyboard.createCursorKeys();
    // this.playerBoy = this.createPlayerBoy();
  }

  endGame() {
    this.scene.start('SceneTitle')
  }

  sleepy() {
    this.scene.start('SceneMain');
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();

    // Platform Level1
    platforms.create(400, 595, 'block');
    return platforms;
  }

  // touchBed(playerBoy, bed) {
  //   console.log("touched bed");

  //   disableCursor = true;
  //   playerBoy.anims.play('ontoBed', false);
  //   this.physics.pause();
  //   flagCharTouchedBed = true;
  //   this.sound.play(SOUND_DREAM);
  // }

  createPlayerBoy() {
    this.playerBoy = this.physics.add.sprite(600, 500, BOY);
    this.playerBoy.setScale(0.25);
    this.playerBoy.visible = false;
    this.playerBoy.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNames(BOY, {
        start: 1,
        end: 5,
        prefix: 'run-left-',
        suffix: '.png'
      }),
      frameRate: 30,
      repeat: -1
    })

    this.anims.create({
      key: 'stand-right',
      frames: [{
        key: BOY,
        frame: 'standing-right-1.png'
      }],
      frameRate: 20,
    })

    this.anims.create({
      key: 'stand-left',
      frames: [{
        key: BOY,
        frame: 'standing-left-1.png'
      }],
      frameRate: 20,
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNames(BOY, {
        start: 1,
        end: 5,
        prefix: 'run-right-',
        suffix: '.png'
      }),
      frameRate: 30,
      repeat: -1
    })

    this.anims.create({
      // x: 200,
      // y: 200,
      key: 'ontoBed',
      frames: this.anims.generateFrameNames(BOY, {
        start: 1,
        end: 3,

        prefix: 'goToBed-',
        suffix: '.png'
      }),
      frameRate: 2,
      repeat: 0,

    })

    return this.playerBoy;
  }

  update() {
    // 0 : Up, 1: Down
    if (spaceKeyStatus == 0) {
      this.input.keyboard.once('keydown_SPACE', () => {
        console.log('keydown');
        spaceKeyStatus = 1;
      });
    } else if (spaceKeyStatus == 1) {
      this.input.keyboard.once('keyup_SPACE', () => {
        console.log('keyup');
        spaceKeyStatus = 0;
      });
    }

    /* Cursor control */
    if (disableCursor == false) {
      if (this.cursors.left.isDown) {
        this.playerBoy.setVelocityX(-90);
        this.playerBoy.anims.play('left', true);
        oldCursor = 1;
      } else if (this.cursors.right.isDown) {
        this.playerBoy.setVelocityX(90);
        this.playerBoy.anims.play('right', true);
        oldCursor = 2;
      } else {
        this.playerBoy.setVelocityX(0);
        if (oldCursor == 1) {
          this.playerBoy.anims.play('stand-left');
        } else if (oldCursor == 2) {
          this.playerBoy.anims.play('stand-right');
        }
      }
    }
  }

}

// For timer
function onEvent() {
  c++;
}