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
    //
    //  
    this.cameras.main.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight);
    this.cameras.main.startFollow(this.astronaut, true);
    //
    //
    this.bulletGroup = this.physics.add.group()
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
    this.physics.add.collider(this.bulletGroup, this.rockGroup, this.destroyRock, null, this);
    var frameNames = this.anims.generateFrameNumbers('exp');
    var f2 = frameNames.slice();
    f2.reverse();
    var f3 = f2.concat(frameNames);
    this.anims.create({
      key: 'boom',
      frames: f3,
      frameRate: 48,
      repeat: false
    });
    this.eship = this.physics.add.sprite(this.centerX, 100, 'eship');
    Align.scaleToGameW(this.eship, .25)
    this.makeInfo();
  }

  makeInfo() {
    this.text1 = this.add.text(0, 0, "Sheilds\n100", {
      align: 'center',
      backgroundColor: '#000000'
    });
    this.text2 = this.add.text(0, 0, "Enemy Sheilds\n100", {
      align: 'center',
      backgroundColor: '#000000'
    });

    this.text1.setOrigin(0.5, 0.5);
    this.text2.setOrigin(0.5, 0.5);

    this.uiGrid = new AlignGrid({
      scene: this,
      rows: 11,
      cols: 11,
    })
    this.uiGrid.showNumbers();
    //
    //
    this.uiGrid.placeAtIndex(2, this.text1);
    this.uiGrid.placeAtIndex(9, this.text2);

  }

  destroyRock(bullet, rock) {
    bullet.destroy();
    this.explosion = this.add.sprite(rock.x, rock.y, 'exp');
    this.explosion.play('boom');
    rock.destroy();
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

    // console.log(elapsed);

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

    var angle2 = this.physics.moveTo(this.eship, this.astronaut.x, this.astronaut.y, 100);
    angle2 = this.toDegrees(angle2);
    this.eship.angle = angle2;
  }

  makeBullet() {

    var dirObj = this.getDirFromAngle(this.astronaut.angle);
    // console.log(dirObj);

    var bullet = this.physics.add.sprite(this.astronaut.x + dirObj.tx * 30, this.astronaut.y + dirObj.tx * 30, 'bullet');
    this.bulletGroup.add(bullet);
    bullet.angle = this.astronaut.angle;
    bullet.body.setVelocity(dirObj.tx * 200, dirObj.ty * 200);
  }

  fireEBullet() {
    var elapsed = Math.abs(this.lastEBullet - this.getTimer());
    if (elapsed < 500) {
      return;
    }
    this.lastEBullet = this.getTimer();
    var ebullet = this.physics.add.sprite(this.eship.x, this.eship.y, 'ebullet');
    ebullet.body.angularVelocity = 10;
    this.physics.moveTo(ebullet, this.astronaut.x, this.astronaut.y, 100);
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

    var distX2 = Math.abs(this.astronaut.x - this.eship.x);
    //console.log(this.astronaut.x);
    //console.log("distx", distX);

    var distY2 = Math.abs(this.astronaut.y - this.eship.y);
    //console.log('distY', distY);
    //console.log(distX < 10 && distY < 10);

    if (distX2 < game.config.width / 5 && distY2 < game.config.height / 5) {
      this.fireEBullet();
    }


  }
}