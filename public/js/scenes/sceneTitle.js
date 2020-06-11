class SceneTitle extends Phaser.Scene {
  constructor() {
    super('SceneTitle');
  }
  preload() {


    this.load.image("house", "/public/assets/images/dreamone.png")
    this.load.image('mist', '/public/assets/images/01_Mist.png');
    this.load.image('bushes', '/public/assets/images/02_Bushes.png');
    this.load.image('particles', '/public/assets/images/03_Particles.png');
    this.load.image('forest', '/public/assets/images/04_Forest.png');
    this.load.image('moreParticles', '/public/assets/images/05_Particles.png');
    this.load.image('forest1', '/public/assets/images/06_Forest.png');
    this.load.image('forest2', '/public/assets/images/07_Forest.png');
    this.load.image('forest3', '/public/assets/images/08_Forest.png');
    this.load.image('forest4', '/public/assets/images/09_Forest.png');
    this.load.image('lightsky', '/public/assets/images/10_Sky.png');
    this.load.image('dream-logo', '/public/assets/images/dreamlogo2.png');
  }
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

    this.alignGrid.showNumbers();

    this.lightsky = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'lightsky');
    this.lightsky.setOrigin(0, 0);
    this.lightsky.setScrollFactor(0);
    this.forest4 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'forest4');
    this.forest4.setOrigin(0, 0);
    this.forest4.setScrollFactor(0);
    this.forest3 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'forest3');
    this.forest3.setOrigin(0, 0);
    this.forest3.setScrollFactor(0);
    this.forest2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'forest2');
    this.forest2.setOrigin(0, 0);
    this.forest2.setScrollFactor(0);
    this.forest1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'forest1');
    this.forest1.setOrigin(0, 0);
    this.forest1.setScrollFactor(0);
    this.moreParticles = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'moreParticles');
    this.moreParticles.setOrigin(0, 0);
    this.moreParticles.setScrollFactor(0);
    this.forest = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'forest');
    this.forest.setOrigin(0, 0);
    this.forest.setScrollFactor(0);
    this.particles = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'particles');
    this.particles.setOrigin(0, 0);
    this.particles.setScrollFactor(0);
    this.bushes = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'bushes');
    this.bushes.setOrigin(0, 0);
    this.bushes.setScrollFactor(0);
    this.mist = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'mist');
    this.mist.setOrigin(0, 0);
    this.mist.setScrollFactor(0);


    var title = this.add.image(0, 0, 'dream-logo');
    Align.scaleToGameW(title, .7);
    // Align.scaleToGameH(title, .02);
    this.alignGrid.placeAtIndex(38, title);

    var btnStart = new FlatButton({
      scene: this,
      key: 'button1',
      text: 'start',
      event: 'start_game'
    });
    this.alignGrid.placeAtIndex(93, btnStart);

    // this.icon2.setScrollFactor(0);

    //TODO: add mario brothers here we go noise
    emitter.on('start_game', this.startGame, this);

    this.player = this.physics.add.sprite(400, 560, 'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'turn',
      frames: [{
        key: 'player',
        frame: 4
      }],
      frameRate: 20,
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', {
        start: 5,
        end: 8
      }),
      frameRate: 10,
      repeat: -1
    })

    // allow key inputs to control the player
    this.cursors = this.input.keyboard.createCursorKeys();


    // set workd bounds to allow camera to follow the player
    this.myCam = this.cameras.main;
    this.myCam.setBounds(0, 0, game.config.width * 3, game.config.height);

    // making the camera follow the player
    this.myCam.startFollow(this.player);



  }

  startGame() {
    console.log('starting');

    this.scene.start('Scene1'); //Scene1    RocketScene  Game   SceneMain   EndWake

  }

  update() {

    if (this.cursors.left.isDown && this.player.x > 0) {
      this.player.x -= 3;
      this.player.scaleX = 1;

    } else if (this.cursors.right.isDown && this.player.x < game.config.width * 3) {
      this.player.x += 3;
      this.player.scaleX = -1;

    }

    // scroll the texture of the tilesprites proportionally to the camera scroll
    this.mist.tilePositionX = this.myCam.scrollX * .7;
    this.bushes.tilePositionX = this.myCam.scrollX * .9;
    this.particles.tilePositionX = this.myCam.scrollX * .1;
    this.forest.tilePositionX = this.myCam.scrollX * 2;
    this.moreParticles.tilePositionX = this.myCam.scrollX * .9;
    this.forest1.tilePositionX = this.myCam.scrollX * .7;
    this.forest2.tilePositionX = this.myCam.scrollX * .9;
    this.forest3.tilePositionX = this.myCam.scrollX * .1;
    this.forest4.tilePositionX = this.myCam.scrollX * 2;
    this.lightsky.tilePositionX = this.myCam.scrollX * .9;
  }
}