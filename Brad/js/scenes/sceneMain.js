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
    //
    //
    //
    //
    this.astronaut = this.physics.add.sprite(this.centerX, this.centerY, "astronaut");
    Align.scaleToGameW(this.astronaut, .05);
    // this.background.scaleX = this.astronaut.scaleX;
    // this.background.scaleY = this.astronaut.scaleY;
    this.physics.world.setBounds(0, 0, this.background.displayWidth, this.displayHeight)
    //
    //
    //
    this.background.setInteractive();
    this.background.on("pointerup", this.backgroundClicked, this);
    this.background.on("pointerdown", this.onDown, this);


    this.cameras.main.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight);
    this.cameras.main.startFollow(this.astronaut, true);
    //
    //
    //
    //
    this.rockGroup = this.physics.add.group({
      key: 'rocks',
      frame: [0, 1, 2],
      frameQuantity: 5,
      bounceX: 1,
      bounceY: 1,
      angularVelocity: 1,
      collideWorldBounds: true
    });

    this.rockGroup.children.iterate(function (child) {
      var xx = Math.floor(Math.random() * this.background.displayWidth);
      var yy = Math.floor(Math.random() * this.background.displayHeight);
      child.x = xx;
      child.y = yy;

      Align.scaleToGameW(child, .1)

      var vx = Math.floor(Math.random() * 2) - 1;
      var vy = Math.floor(Math.random() * 2) - 1;

      if (vx == 0 && vy == 0) {
        vx = 1;
        vy = 1;
      }

      var speed = Math.floor(Math.random() * 200) + 10;
      child.body.setVelocity(vx * speed, vy * speed);

    }.bind(this));
    this.physics.add.collider(this.rockGroup);
  }

  getTimer() {
    var d = new Date();
    return d.getTime();
  }

  onDown() {
    this.downTime = this.getTimer();
  }

  backgroundClicked() {
    var elapsed = Math.abs(this.downTime - this.getTimer());

    console.log(elapsed);

    if (elapsed < 300) {
      var tx = this.background.input.localX;
      this.tx = tx;
      //console.log(tx);
      var ty = this.background.input.localY;
      this.ty = ty;
      //console.log(ty);

      var angle = this.physics.moveTo(this.astronaut, tx, ty, 60);
      angle = this.toDegrees(angle);
      this.astronaut.angle = angle;
    } else {
      // console.log('fire');
      this.makeBullet();

    }
  }

  makeBullet() {

    var dirObj = this.getDirFromAngle(this.astronaut.angle);
    console.log(dirObj);

    var bullet = this.physics.add.sprite(this.astronaut.x + dirObj.tx * 30, this.astronaut.y + dirObj.tx * 30, 'bullet');
    bullet.angle = this.astronaut.angle;
    bullet.body.setVelocity(dirObj.tx * 200, dirObj.ty * 200);
  }

  toDegrees(angle) {
    return angle * (180 / Math.PI);
  }

  getDirFromAngle(angle) {
    var rads = angle * Math.PI / 180;
    var tx = Math.cos(rads);
    var ty = Math.sin(rads);
    return {
      tx,
      ty
    }
  }

  update() {
    //constant running loop

    var distX = Math.abs(this.astronaut.x - this.tx);
    //console.log(this.astronaut.x);
    //console.log("distx", distX);

    var distY = Math.abs(this.astronaut.y - this.ty);
    //console.log('distY', distY);
    //console.log(distX < 10 && distY < 10);

    if (distX < 10 && distY < 10) {
      this.astronaut.body.setVelocity(0, 0);
    }

  }
}