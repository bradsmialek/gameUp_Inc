const SOUND_DREAM = 'havingDreamSound';
const BOY = 'boy';
const SOUND_DOORCLOSE = 'doorCloseSound';
const SOUND_STAIRS = 'stairsSound';
const SCENE_NEXT = 'Game';

var timedEvent;
var c = 0;
var timeSecondOld = 0;
var timeSecond = 0;
var timerRemaining;
var timeTick = 0;

var textMom;
var textChild;
var spaceKeyStatus = 0;
var oldCursor = 1;
var disableCursor = true;
var flagCharTouchedBed = false;
var flagCharTouchedBedOld = false;
var storeTimeValue = 0;
var doorCloseSoundPlayed = false;
var starsSoundPlayed = false;

class Scene1 extends Phaser.Scene {

  constructor() {
    super('Scene1') // Scene 'Scene1' // before game
    this.playerBoy = undefined;
    this.cursors = undefined;
  }

  init() {
    // reserve for future usage
  }

  /*** preload() and create() wiil be called by Phaser at appropriate timing ***/
  // specify images, audio, or other assets to load before starting the Scene
  preload() {

    this.load.atlas(BOY, '/public/assets/images/boy4.png', '/public/assets/images/boy4.json');

    this.load.image('block', '/public/assets/images/blackBlock.png');
    this.load.image('chair', '/public/assets/images/benchCushion.png');
    this.load.image('box', '/public/assets/images/cardboardBoxClosed.png');
    this.load.image('door', '/public/assets/images/doorway.png');
    this.load.image('window', '/public/assets/images/wallWindowSlide.png');

    this.load.image('bookcase1', '/public/assets/images/bookcaseClosed.png');
    this.load.image('bookcase2', '/public/assets/images/bookcaseClosedDoors.png');
    this.load.image('bed', '/public/assets/images/bedSingle.png');
    this.load.image('desk', '/public/assets/images/desk.png');
    this.load.image('deskCorner', '/public/assets/images/deskCorner.png');
    this.load.image('lampTall', '/public/assets/images/lampRoundFloor.png');
    this.load.image('plant', '/public/assets/images/pottedPlant.png');
    this.load.image('books', '/public/assets/images/books.png');


    this.load.audio(SOUND_DOORCLOSE, '/public/assets/sound/doorClose.wav');
    this.load.audio(SOUND_STAIRS, '/public/assets/sound/stairs.mp3');
    this.load.audio(SOUND_DREAM, '/public/assets/sound/havingDream.wav');
  }

  // Create() is called once all the assets for the Scene have been loaded
  // Only assets that have been loaded can be used in create()
  create() {

    const trigger = this.physics.add.staticImage(160, 520, 'books'); // this is used to trigger character to sleep
    const bookcase2 = this.physics.add.staticImage(340, 420, 'bookcase2');
    const bookcase1 = this.physics.add.staticImage(300, 420, 'bookcase1');
    const desk = this.physics.add.staticImage(460, 460, 'desk');
    const lamp = this.physics.add.staticImage(180, 420, 'lampTall');
    const books = this.physics.add.staticImage(430, 425, 'books');
    const platforms = this.createPlatforms();

    const chair = this.physics.add.staticImage(560, 480, 'chair').setScale(0.8).refreshBody();

    this.playerBoy = this.createPlayerBoy();
    const doorway = this.physics.add.staticImage(670, 500, 'door').setScale(1.1).refreshBody();
    const bed = this.physics.add.staticImage(180, 540, 'bed');

    const plant = this.physics.add.staticImage(30, 525, 'plant');

    this.physics.add.collider(this.playerBoy, platforms);
    this.physics.add.collider(this.playerBoy, trigger, this.touchBed, null, this);
    this.physics.add.collider(this.playerBoy, doorway);

    this.cursors = this.input.keyboard.createCursorKeys();

    /** Timer **/
    // For Text
    textMom = this.add.text(25, 50);
    textChild = this.add.text(225, 50);
    timedEvent = this.time.addEvent({
      delay: 1000,
      callback: onEvent,
      callBackScope: this,
      loop: true
    });

  }


  createPlatforms() {
    const platforms = this.physics.add.staticGroup();

    // Platform Level1
    platforms.create(400, 595, 'block');
    return platforms;
  }

  touchBed(playerBoy, bed) {
    disableCursor = true;
    playerBoy.anims.play('ontoBed_boy', false);
    this.physics.pause();
    flagCharTouchedBed = true;
    this.sound.play(SOUND_DREAM);
  }


  createPlayerBoy() {
    this.playerBoy = this.physics.add.sprite(600, 500, BOY);
    this.playerBoy.setScale(0.25);
    this.playerBoy.visible = false;
    this.playerBoy.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left_boy',
      frames: this.anims.generateFrameNames(BOY, {
        start: 1,
        end: 5,
        prefix: 'run-left-',
        suffix: '.png'
      }),
      frameRate: 15,
      repeat: -1
    })

    this.anims.create({
      key: 'stand_right_boy',
      frames: [{
        key: BOY,
        frame: 'standing-right-1.png'
      }],
      frameRate: 20,
    })

    this.anims.create({
      key: 'stand_left_boy',
      frames: [{
        key: BOY,
        frame: 'standing-left-1.png'
      }],
      frameRate: 20,
    })

    this.anims.create({
      key: 'right_boy',
      frames: this.anims.generateFrameNames(BOY, {
        start: 1,
        end: 5,
        prefix: 'run-right-',
        suffix: '.png'
      }),
      frameRate: 15,
      repeat: -1
    })

    this.anims.create({
      key: 'ontoBed_boy',
      frames: this.anims.generateFrameNames(BOY, {
        start: 1,
        end: 3,
        prefix: 'goToBed-',
        suffix: '.png'
      }),
      frameRate: 0.70,
      repeat: 0
    })

    return this.playerBoy;
  }

  // update() will be executed every over and over ('update loop')
  update() {

    // Timer
    timerRemaining = c + timedEvent.getProgress();
    timeSecond = timerRemaining.toFixed(0);

    if (timeSecond !== timeSecondOld) {
      timeTick++;
      //console.log(timeTick);
      textMom.setText('');
      textChild.setText('');

      /*** Controlling Dialog and sound effect played before a boy show up ***/

      if (3 < timeTick && timeTick < 7) {
        textMom.setText('Mom : \"Time to go to bed!\"');
      }
      if (6 < timeTick && timeTick < 9) {
        textMom.setText('');
        textChild.setText('Child : \"Good night, Mom!\"');
      }
      if (8 < timeTick && timeTick < 12) {
        textMom.setText('Mom : \"Sleep well\"');
        textChild.setText('');
      }
      // Sound : Stairs
      if (timeTick == 9 && starsSoundPlayed == false) {
        starsSoundPlayed = true;
        this.sound.play(SOUND_STAIRS);
      }
      // Sound : Doorclose
      if (timeTick == 16 && doorCloseSoundPlayed == false) {
        doorCloseSoundPlayed = true;
        this.sound.play(SOUND_DOORCLOSE);
      }
      // Set the boy visible
      if (timeTick == 17) {
        this.playerBoy.visible = true;
        disableCursor = false;
      }


      if ((flagCharTouchedBed == true) && (flagCharTouchedBedOld == false)) {
        storeTimeValue = timeTick;
        //console.log(storeTimeValue);
      }
      flagCharTouchedBedOld = flagCharTouchedBed;
      if (storeTimeValue + 4 == timeTick && storeTimeValue !== 0) {

        this.scene.start(SCENE_NEXT);
        c = 0;
        disableCursor = true;
        flagCharTouchedBed = false;
        storeTimeValue = 0;
        doorCloseSoundPlayed = false;
        starsSoundPlayed = false;
        mediaManagerSkywave.setStopMusic();
      }

    }
    timeSecondOld = timeSecond;


    /* Cursor control */
    if (disableCursor == false) {
      if (this.cursors.left.isDown) {
        this.playerBoy.setVelocityX(-110);
        this.playerBoy.anims.play('left_boy', true);
        oldCursor = 1;
      } else if (this.cursors.right.isDown) {
        this.playerBoy.setVelocityX(110);
        this.playerBoy.anims.play('right_boy', true);
        oldCursor = 2;
      } else {
        this.playerBoy.setVelocityX(0);
        if (oldCursor == 1) {
          this.playerBoy.anims.play('stand_left_boy');
        } else if (oldCursor == 2) {
          this.playerBoy.anims.play('stand_right_boy');
        }
      }
    }

  }
}
// For timer
function onEvent() {
  c++;
}