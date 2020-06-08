class SceneMain extends Phaser.Scene {
  constructor() {
    super('SceneMain');
  }
  preload() {

  }
  create() {
    //define our objects
    //set up 
    emitter = new Phaser.Events.EventEmitter();
    controller = new Controller();
    var mediaManager = new MediaManager({
      scene: this
    });

    var sb = new SoundButtons({
      scene: this
    });

    this.centerX = game.config.width / 2;
    this.centerY = game.config.height / 2;

    this.background = this.add.image(0, 0, "background");
    this.background.setOrigin(0, 0);


    this.astronaut = this.physics.add.sprite(this.centerX, this.centerY, "astronaut");
    Align.scaleToGameW(this.astronaut, .05);

    // this.background.scaleX = this.astronaut.scaleX;
    // this.background.scaleY = this.astronaut.scaleY;

    this.background.setInteractive();
    this.background.on("pointerdown", this.backgroundClicked, this);

  }

  backgroundClicked() {

    var tx = this.background.input.localX;
    var ty = this.background.input.localY;

    var angle = this.physics.moveTo(this.astronaut, tx, ty, 60);
    angle = this.toDegrees(angle);
    this.astronaut.angle = angle;
  }

  toDegrees(angle) {
    return angle * (180 / Math.PI);
  }

  update() {
    //constant running loop
  }
}