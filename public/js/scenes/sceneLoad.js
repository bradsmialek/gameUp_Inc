class SceneLoad extends Phaser.Scene {
  constructor() {
    super('SceneLoad');
  }
  preload() {

    this.bar = new Bar({
      scene: this,
      x: game.config.width / 2,
      y: game.config.height / 2
    });
    this.progText = this.add.text(game.config.width / 2, game.config.height / 2, "0%", {
      color: '#ffffff',
      fontSize: game.config.width / 20
    });
    this.progText.setOrigin(0.5, 0.5);
    this.load.on('progress', this.onProgress, this);

    this.load.image("button1", "/public/assets/images/ui/buttons/2/1.png");
    this.load.image("button2", "/public/assets/images/ui/buttons/2/5.png");

    this.load.audio('explode', ["/public/assets/audio/explode.wav", "public/assets/audio/explode.ogg"]);
    this.load.audio('enemyShoot', ["/public/assets/audio/enemyShoot.wav", "public/assets/audio/enemyShoot.ogg"]);
    this.load.audio('laser', ["/public/assets/audio/laser.wav", "/assets/audio/laser.ogg"]);
    this.load.audio('backgroundmusic', ["/public/assets/audio/background.mp3", "/public/assets/audio/background.ogg"]);


    this.load.image("toggleBack", "/public/assets/images/ui/toggles/1.png");
    this.load.image("sfxOff", "/public/assets/images/ui/icons/sfx_off.png");
    this.load.image("sfxOn", "/public/assets/images/ui/icons/sfx_on.png");
    this.load.image("musicOn", "/public/assets/images/ui/icons/music_on.png");
    this.load.image("musicOff", "/public/assets/images/ui/icons/music_off.png");

    this.load.image("astronaut", "/public/assets/images/astronaut.png");
    this.load.image("background", "/public/assets/images/background.jpg");
    this.load.image("eship", "/public/assets/images/shark2.png");
    this.load.image("gun", "/public/assets/images/gun.png");
    this.load.image("ebullet", "/public/assets/images/bullet.png");
    this.load.image("bullet", "/public/assets/images/rainbow3.png");


    this.load.spritesheet("rocks", "/public/assets/images/rocks.png", {
      frameWidth: 120,
      frameHeight: 90,
    })

    this.load.spritesheet("exp", "/public/assets/images/exp.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  // Shows progress of game load
  onProgress(value) {
    this.bar.setPercent(value);
    var per = Math.floor(value * 100);
    this.progText.setText(per + "%");
  }
  create() {
    this.scene.start("SceneTitle");

  }
}