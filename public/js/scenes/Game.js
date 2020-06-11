const PLAY_TIME = 90; // Seconds
const GROUND_KEY = 'ground';
const GROUND_KEY_MAIN = 'ground_main';
const DUDE_KEY = 'dude';
const STAR_KEY = 'star';
const BOMB_KEY = 'bomb';
const MUSH_ROOM = 'mushRoom';
const GOLD_COIN = 'coldCoin';
const BRONZE_COIN = 'bronzeCoin';
const SILVER_COIN = 'silverCoin';
const MUSHROOM = ['tallShroom_brown', 'tallShroom_red', 'tallShroom_tan'];
const SIGN_EXIT = 'signExit';
const SHUTTLE = 'shuttle';
const KEY_BLUE = 'keyBlue';
const BOX_1 = 'box1';
const BOX_2 = 'box2';
const SPRING = ['spring_in', 'spring', 'sprung'];
const PLANET = ['planetLeft', 'planetMid', 'planetRight'];
const GEM = ['germBlue', 'germGreen', 'germRed'];
const ROCKET = 'rocket';
const PLAYER_VELOCITY_ON_GROUND = [-150, -230, 150]; // Left, Bounce, Right
const PLAYER_VELOCITY_AIR = [-80, -50, 80] // Left, Bounce, Right
const ROCKET_SUB_VALUE = 3; // How much health is deducted while rocket is used
const SOUND_DRUM = 'drunSound';
const SOUND_STAR = 'starSound';
const SOUND_COIN = 'coinSound';
const SOUND_MUSHROOM = 'mushroomSound';
const SOUND_GEM = 'gemSound';
const SOUND_JUMP = 'jumpSound';
const SOUND_BOX = 'boxSound';
const SOUND_ROCKET_PICKUP = 'rocketPickUpSound';
const SOUND_ROCKET_FIRE = 'rocketFireSound';
const SOUND_STAGE_CLEAR = 'stageClearSound';
const formatScore = (score) => `Score: ${score}`;

var size = 1.0;
var bombBounceValue = 0.1;
var countStarGenerate = 0;
var oldCountStarGenerate = 0;
var timedEvent;
var c = 0;
var timeSecondOld = 0;
var timeSecond = 0;
var text;
var textBounce;
var timerMax = PLAY_TIME;
var timerRemaining;
var timeTick = 0;
var oldTimeTick = 0;
var starRegeneratePosY = 0;
var score = 0;
var playerBounceValue = PLAYER_VELOCITY_ON_GROUND[1];
var playerLeftValue = PLAYER_VELOCITY_ON_GROUND[0];
var playerRightValue = PLAYER_VELOCITY_ON_GROUND[2];
var gemCollected = [];
var mushroomCollected = [];
var coinCollected = [];
var _springPlatformShowUp = false;
var _playerTouchPlatform = 0; // 1: subPlatform, 2: platform, 3: spring 4: skyPlatforms
var rocketCollected = false;
var boxPhysicsRef = [];
var bombsGroup;



class Game extends Phaser.Scene {
  constructor() {
    super({
      key: "Game",
      // Phaser will decide use Canvas or WebGL 
      width: 800,
      height: 600,

      physics: {
        default: 'arcade',
        arcade: {
          gravity: {
            y: 300
          },
          debug: false
        }
      }
    }) // Scene 'game'

    this.player = undefined;
    this.cursors = undefined;
    this.scoreLabel = undefined;
    this.stars = undefined;
    this.bombSpawner = undefined;
    this.gameOver = false;
    //this.score = score;
  }

  /*** preload() and create() wiil be called by Phaser at appropriate timing ***/
  // specify images, audio, or other assets to load before starting the Scene
  preload() {

    this.load.image('sky', '/public/assets/images/bg_shroom.png');
    this.load.image(GROUND_KEY, '/public/assets/images/platform.png');
    this.load.image(GROUND_KEY_MAIN, '/public/assets/images/sand.png');
    this.load.image(MUSHROOM[0], '/public/assets/images/tallShroom_brown.png');
    this.load.image(MUSHROOM[1], '/public/assets/images/tallShroom_red.png');
    this.load.image(MUSHROOM[2], '/public/assets/images/tallShroom_tan.png');
    this.load.image(SIGN_EXIT, '/public/assets/images/signExit.png');
    this.load.image(SHUTTLE, '/public/assets/images/shuttle.png');
    this.load.image(KEY_BLUE, '/public/assets/images/keyBlue.png');
    this.load.image(BOX_1, '/public/assets/images/boxCrate_single.png');
    this.load.image(BOX_2, '/public/assets/images/boxCrate_double.png');
    this.load.image(SPRING[0], '/public/assets/images/spring_in.png');
    this.load.image(SPRING[1], '/public/assets/images/spring.png');
    this.load.image(SPRING[2], '/public/assets/images/sprung.png');
    this.load.image(PLANET[0], '/public/assets/images/planetLeft.png');
    this.load.image(PLANET[1], '/public/assets/images/planetMid.png');
    this.load.image(PLANET[2], '/public/assets/images/planetRight.png');
    this.load.image(GEM[0], '/public/assets/images/gemBlue.png');
    this.load.image(GEM[1], '/public/assets/images/gemGreen.png');
    this.load.image(GEM[2], '/public/assets/images/gemRed.png');
    this.load.image(ROCKET, '/public/assets/images/spaceShips_007.png');

    this.load.image(STAR_KEY, '/public/assets/images/star.png');
    this.load.image(BOMB_KEY, '/public/assets/images/bomb.png');
    this.load.image(MUSH_ROOM, '/public/assets/images/mushroom_brown.png');
    this.load.image(GOLD_COIN, '/public/assets/images/goldCoin.png');
    this.load.image(BRONZE_COIN, '/public/assets/images/coinBronze.png');
    this.load.image(SILVER_COIN, '/public/assets/images/coinSilver.png');
    this.load.spritesheet(DUDE_KEY, '/public/assets/images/dude.png', {
      frameWidth: 32,
      frameHeight: 48
    });

    this.load.audio(SOUND_DRUM, '/public/assets/sound/drum.wav');
    this.load.audio(SOUND_COIN, '/public/assets/sound/collectCoin.wav');
    this.load.audio(SOUND_MUSHROOM, '/public/assets/sound/collectMushroom.wav');
    this.load.audio(SOUND_STAR, '/public/assets/sound/highDown.mp3');
    this.load.audio(SOUND_GEM, '/public/assets/sound/collectGem.wav');
    this.load.audio(SOUND_JUMP, '/public/assets/sound/jump.wav');
    this.load.audio(SOUND_BOX, '/public/assets/sound/stepOnBox.wav');
    this.load.audio(SOUND_ROCKET_PICKUP, '/public/assets/sound/rocketPickUp.wav');
    this.load.audio(SOUND_ROCKET_FIRE, '/public/assets/sound/rocketFire4.mp3');
    this.load.audio(SOUND_STAGE_CLEAR, '/public/assets/sound/stageClear.wav');


  }


  // Create() is called once all the assets for the Scene have been loaded
  // Only assets that have been loaded can be used in create()
  create() {
    // timerMax = 90;
    this.add.image(400, 300, 'sky');


    /** Exit sign **/
    this.physics.add.staticImage(700, 110, SIGN_EXIT).setScale(0.4).refreshBody();


    const platforms = this.createPlatforms();
    const subPlatforms = this.createSubPlatforms();
    const skyPlatforms = this.createSkyPlatforms();

    this.player = this.createPlayer();
    this.stars = this.createStars();

    this.scoreLabel = this.createScoreLabel(16, 16, 0);

    this.bombSpawner = new BombSpawner(this, BOMB_KEY);
    bombsGroup = this.bombSpawner.group;

    this.physics.add.collider(this.player, platforms, this.onPlatforms, null, this);
    this.physics.add.collider(this.stars, platforms);
    this.physics.add.collider(bombsGroup, platforms);

    this.physics.add.collider(this.player, subPlatforms, this.onSubPlatforms, null, this);
    this.physics.add.collider(this.stars, subPlatforms);
    this.physics.add.collider(bombsGroup, subPlatforms);

    this.physics.add.collider(this.stars, skyPlatforms);
    this.physics.add.collider(bombsGroup, skyPlatforms);
    this.physics.add.collider(this.player, skyPlatforms, this.onSkyPlatforms, null, this);

    this.physics.add.collider(this.player, bombsGroup, this.hitBomb, null, this);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    this.cursors = this.input.keyboard.createCursorKeys();

    /** Create gem **/
    const gemRed = this.physics.add.staticImage(280, 450, GEM[2]).setScale(0.4).refreshBody();
    this.physics.add.collider(this.player, gemRed, this.collectGemRed, null, this);

    const gemBlue = this.physics.add.staticImage(630, 120, GEM[0]).setScale(0.4).refreshBody();
    this.physics.add.collider(this.player, gemBlue, this.collectGemBlue, null, this);

    /** Create mushrooms **/
    const mushroom = this.physics.add.staticImage(770, 520, MUSHROOM[0]).setScale(1).refreshBody();
    this.physics.add.collider(this.player, mushroom, this.collectMushroomBrown, null, this);

    const mushroom2 = this.physics.add.staticImage(700, 350, MUSHROOM[1]).setScale(1).refreshBody();
    this.physics.add.collider(this.player, mushroom2, this.collectMushroomRed, null, this);

    const mushroom3 = this.physics.add.staticImage(50, 200, MUSHROOM[2]).setScale(1).refreshBody();
    this.physics.add.collider(this.player, mushroom3, this.collectMushroomTan, null, this);

    /** Create coins **/
    const coinBronze = this.physics.add.staticImage(100, 350, BRONZE_COIN).setScale(0.5).refreshBody();
    this.physics.add.collider(this.player, coinBronze, this.collectBronzeCoin, null, this);

    const coinSilver = this.physics.add.staticImage(200, 310, SILVER_COIN).setScale(0.5).refreshBody();
    this.physics.add.collider(this.player, coinSilver, this.collectSilverCoin, null, this);

    /** Exit window **/
    const exitWindow = this.physics.add.staticImage(765, 98, SHUTTLE).setScale(0.6).refreshBody();
    this.physics.add.collider(this.player, exitWindow, this.exitThisGame, null, this);


    /** Timer **/
    // For Text
    text = this.add.text(25, 50);
    timedEvent = this.time.addEvent({
      delay: 1000,
      callback: onEvent,
      callBackScope: this,
      loop: true
    });

    /** BounceValue **/
    textBounce = this.add.text(615, 20);
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();

    // Platform Level1
    platforms.create(400, 588, GROUND_KEY).setScale(2).refreshBody();
    return platforms;
  }

  createSubPlatforms() {

    const platforms = this.physics.add.staticGroup();

    // Platform level1.25
    platforms.create(100, 490, PLANET[0]).setScale(0.25).refreshBody();
    platforms.create(130, 490, PLANET[1]).setScale(0.25).refreshBody();
    platforms.create(160, 490, PLANET[2]).setScale(0.25).refreshBody();

    // Platform level1.5
    platforms.create(230, 480, PLANET[0]).setScale(0.25).refreshBody();
    platforms.create(260, 480, PLANET[1]).setScale(0.25).refreshBody();
    platforms.create(290, 480, PLANET[2]).setScale(0.25).refreshBody();

    return platforms;
  }

  createSpringPlatforms() {
    const platform = this.physics.add.staticImage(475, 550, SPRING[0]).setScale(0.25).refreshBody();
    return platform;
  }

  createSkyPlatforms() {

    const platforms = this.physics.add.staticGroup();

    // Platform Level2
    platforms.create(700, 400, GROUND_KEY);
    // Platform Level3
    platforms.create(50, 250, GROUND_KEY);
    // Platform Level4
    platforms.create(800, 150, GROUND_KEY);

    return platforms;
  }

  createPlayer() {
    this.player = this.physics.add.sprite(100, 450, DUDE_KEY);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'turn',
      frames: [{
        key: DUDE_KEY,
        frame: 4
      }],
      frameRate: 20,
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, {
        start: 5,
        end: 8
      }),
      frameRate: 10,
      repeat: -1
    })

    return this.player;
  }

  createStars() {
    const stars = this.physics.add.group({
      key: STAR_KEY,
      repeat: 11,
      setXY: {
        x: 12,
        y: 400,
        stepX: 70
      }
    });

    stars.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
    });

    return stars;
  }


  collectStar(player, star) {
    star.disableBody(true, true);
    size = size + 0.1;
    this.scoreLabel.add(10);
    score = this.scoreLabel.getScore();
    //console.log(score);

    this.sound.play(SOUND_STAR);

    // Generate stars once all stars are gone
    if (this.stars.countActive(true) === 0) {
      starRegeneratePosY = Phaser.Math.Between(0, 400); // Randomly generate Y value
      this.stars.children.iterate((child) => {
        child.enableBody(true, child.x + Phaser.Math.FloatBetween(-10, 10), starRegeneratePosY, true, true)
        //console.log(child.x);
      })
      countStarGenerate += 1;
      //console.log(countStarGenerate);

    }
    if (countStarGenerate != oldCountStarGenerate) {
      if (countStarGenerate === 1) {
        const goldCoin = this.physics.add.staticImage(110, 455, GOLD_COIN).setScale(0.4).refreshBody();
        this.physics.add.collider(this.player, goldCoin, this.collectGoldCoin, null, this);
      } else if (countStarGenerate === 2) {
        // Reserve for future usage
      }
    }
    oldCountStarGenerate = countStarGenerate;


    // bouncing value of star
    bombBounceValue = Phaser.Math.FloatBetween(0.1, 0.5);
    this.bombSpawner.spawn(player.x, bombBounceValue);
  }

  exitThisGame() {
    this.scene.start('RocketScene', {

    });
    this.sound.play(SOUND_STAGE_CLEAR);
  }

  // update() will be executed every over and over ('update loop')
  update() {

    // Timer
    timerRemaining = timerMax - (c + timedEvent.getProgress());
    timeSecond = timerRemaining.toFixed(0);
    //console.log(timeSecond);
    if (timerRemaining > 0) {
      text.setText('Time remaining: ' + timerRemaining.toString().substr(0, 4) + '[sec]');
    } else {
      text.setText('Time remaining: 0.00[sec]');
    }

    if (timeSecond !== timeSecondOld) {
      timeTick++;
    }
    timeSecondOld = timeSecond;

    textBounce.setText(`Bounce value: ${-1 * playerBounceValue}`);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(playerLeftValue);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(playerRightValue);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.player.body.touching.down) {
      playerLeftValue = PLAYER_VELOCITY_ON_GROUND[0];
      playerRightValue = PLAYER_VELOCITY_ON_GROUND[2];
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(playerBounceValue);
    }
    if (this.cursors.up.isDown && _playerTouchPlatform == 3) {
      this.sound.play(SOUND_JUMP);
    }

    if (this.cursors.up.isDown && _playerTouchPlatform == 4 && rocketCollected == true) {
      this.sound.play(SOUND_ROCKET_FIRE);
      this.player.setVelocityY(PLAYER_VELOCITY_AIR[1]);

      // Star coming down from player while in air
      var starImagePhysics = this.physics.add.image(this.player.x, this.player.y + 25, STAR_KEY);
      starImagePhysics.setVelocity(Phaser.Math.Between(-100, 100), 200);

      playerLeftValue = PLAYER_VELOCITY_AIR[0];
      playerRightValue = PLAYER_VELOCITY_AIR[2];
    }
    if (!this.player.body.touching.down && _playerTouchPlatform == 4 && rocketCollected == true) {
      if (timeTick !== oldTimeTick) {
        //console.log('timeTick: ' + timeTick);
        this.scoreLabel.subtract(ROCKET_SUB_VALUE);
      }
      oldTimeTick = timeTick;
    }

    if (gemCollected[0] && coinCollected[0] && mushroomCollected[0] && _springPlatformShowUp == false) {
      _springPlatformShowUp = true;
      const springPlatform = this.physics.add.staticImage(475, 550, SPRING[0]).setScale(0.25).refreshBody();
      this.physics.add.collider(bombsGroup, springPlatform);
      this.physics.add.collider(this.stars, springPlatform);
      this.physics.add.collider(this.player, springPlatform, this.onSpringPlatform, null, this);
    }
    if (timeSecond == 0) {
      timerMax = 90;
      this.scene.start('BackToSleep');
      //this.scene.start('ScorePage', {score : score});
      //Time 
    }
  }


  createScoreLabel(x, y, score) {
    const style = {
      fontSize: '20px',
      fill: '#FFF'
    }
    const label = new ScoreLabel(this, x, y, score, style);
    this.add.existing(label);
    return label;
  }

  onSubPlatforms(player, subPlatforms) {
    playerBounceValue = -80;
    playerBounceValue = (mushroomCollected[0] && coinCollected[0] && gemCollected[0]) ? -200 : playerBounceValue;
    _playerTouchPlatform = 1;
  }
  onPlatforms(player, platforms) {
    playerBounceValue = mushroomCollected[0] ? -235 : -100;
    _playerTouchPlatform = 2;
  }
  onSpringPlatform(player, platform) {
    playerBounceValue = -310;
    _playerTouchPlatform = 3;
  }

  onSkyPlatforms(player, platform) {
    playerBounceValue = -150;
    _playerTouchPlatform = 4;
  }

  collectGemRed(player, gem) {
    this.sound.play(SOUND_GEM);
    gem.disableBody(true, true);
    gemCollected[0] = true;
    this.scoreLabel.add(15);
    //console.log(gemCollected);
  }
  collectGemBlue(player, gem) {
    this.sound.play(SOUND_GEM);
    boxPhysicsRef[0].disableBody(true, true);
    gem.disableBody(true, true);
    this.scoreLabel.add(15);
    gemCollected[1] = true;
  }

  collectMushroomBrown(player, mushroom) {
    this.sound.play(SOUND_MUSHROOM);
    mushroom.disableBody(true, true);
    mushroomCollected[0] = true;
  }

  /* SkyPlatform lowest */
  collectMushroomRed(player, mushroom) {
    this.sound.play(SOUND_MUSHROOM);
    mushroom.disableBody(true, true);
    mushroomCollected[1] = true;

    boxPhysicsRef[0] = this.physics.add.staticImage(450, 370, BOX_1).setScale(0.25).refreshBody();
    this.physics.add.collider(this.player, boxPhysicsRef[0], this.onBox1_1, null, this);
    playerBounceValue = -160;
  }
  onBox1_1(player, box) {
    //console.log('onBox1_1');
    boxPhysicsRef[1] = this.physics.add.staticImage(400, 330, BOX_1).setScale(0.25).refreshBody();
    this.physics.add.collider(this.player, boxPhysicsRef[1], this.onBox1_2, null, this);
    this.sound.play(SOUND_BOX);
    playerBounceValue = -160;
  }
  onBox1_2() {
    //boxPhysicsRef[0].disableBody(true, true);
    //console.log('onBox1_2');
    boxPhysicsRef[2] = this.physics.add.staticImage(350, 290, BOX_1).setScale(0.25).refreshBody();
    this.physics.add.collider(this.player, boxPhysicsRef[2], this.onbox1_3, null, this);
    this.sound.play(SOUND_BOX);
    playerBounceValue = -160;
  }
  onbox1_3() {
    //boxPhysicsRef[1].disableBody(true, true);
    //console.log('onBox1_3');
    boxPhysicsRef[3] = this.physics.add.staticImage(300, 250, BOX_1).setScale(0.25).refreshBody();
    this.physics.add.collider(this.player, boxPhysicsRef[3], this.onbox1_4, null, this);
    this.sound.play(SOUND_BOX);
    playerBounceValue = -160;
  }
  onbox1_4() {
    this.sound.play(SOUND_BOX);
    //console.log('onBox1_4');
    //boxPhysicsRef[2].disableBody(true, true);
  }

  collectMushroomTan(player, mushroom) {
    mushroom.disableBody(true, true);
    const rocket = this.physics.add.staticImage(160, 210, ROCKET).setScale(0.3).refreshBody();
    this.physics.add.collider(this.player, rocket, this.onRocket, null, this);
    this.sound.play(SOUND_MUSHROOM);
  }
  onRocket(player, rocket) {
    this.sound.play(SOUND_ROCKET_PICKUP);
    rocket.disableBody(true, true);
    rocketCollected = true;
  }
  collectGoldCoin(player, coin) {
    coin.disableBody(true, true);
    coinCollected[0] = true;
    this.scoreLabel.add(25);
    this.sound.play(SOUND_COIN);
  }
  collectBronzeCoin(player, coin) {
    coin.disableBody(true, true);
    coinCollected[1] = true;
    this.scoreLabel.add(50);
    this.sound.play(SOUND_COIN);
  }
  collectSilverCoin(player, coin) {
    coin.disableBody(true, true);
    coinCollected[2] = true;
    this.scoreLabel.add(50);
    this.sound.play(SOUND_COIN);
  }

  hitBomb(player, bomb) {
    //this.physics.setTint(0xff0000);
    bomb.disableBody(true, true);
    this.scoreLabel.subtract(5);
    this.sound.play(SOUND_DRUM);
    score = this.scoreLabel.getScore();
    //console.log(score);
  }

}

class ScoreLabel extends Phaser.GameObjects.Text {

  constructor(scene, x, y, score, style) {
    super(scene, x, y, score, style);
    this.score = score;
  }

  setScore(score) {
    this.score = score;
    this.updateScoreText();
  }
  getScore() {
    return this.score;
  }
  add(points) {
    this.setScore(this.score + points);
  }
  subtract(points) {
    this.setScore(this.score - points);
  }
  updateScoreText() {
    this.setText(formatScore(this.score));
  }
}

class BombSpawner {


  constructor(scene, bombKey = 'bomb') {
    this.scene = scene
    this.key = bombKey

    this._group = this.scene.physics.add.group({
      key: this.key,
      collideWorldBounds: true
    })
  }

  get group() {
    return this._group
  }

  spawn(playerX = 0, bounceValue) {
    const x = (playerX < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)

    const bomb = this.group.create(x, 16, this.key);
    bomb.setBounce(bounceValue);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    return bomb
  }
}


// For timer
function onEvent() {
  c++;
}

//console.log('Hello World');