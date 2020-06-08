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

    this.cameras.main.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight);
    this.cameras.main.startFollow(this.astronaut, true);
  }

  backgroundClicked() {

    var tx = this.background.input.localX;
    this.tx = tx;
    console.log(tx);
    var ty = this.background.input.localY;
    this.ty = ty;
    console.log(ty);


    var angle = this.physics.moveTo(this.astronaut, tx, ty, 60);
    angle = this.toDegrees(angle);
    this.astronaut.angle = angle;
  }

  toDegrees(angle) {
    return angle * (180 / Math.PI);
  }

  update() {
    //constant running loop

    var distX = Math.abs(this.astronaut.x - this.tx);
    console.log(this.astronaut.x);
    console.log("distx", distX);

    var distY = Math.abs(this.astronaut.y - this.ty);
    console.log('distY', distY);
    console.log(distX < 10 && distY < 10);

    if (distX < 10 && distY < 10) {
      this.astronaut.body.setVelocity(0, 0);
    }

  }
}