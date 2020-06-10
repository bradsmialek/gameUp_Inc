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

    this.shield = 100;
    this.eshield = 100;

    this.centerX = game.config.width / 2;
    this.centerY = game.config.height / 2;
    this.background = this.add.image(0, 0, "background");
    this.background.setOrigin(0, 0);
    //
    //
    //
    //
    this.astronaut = this.physics.add.sprite(this.centerX, this.centerY, "astronaut");
    this.astronaut.body.collideWorldBounds = true;
    Align.scaleToGameW(this.astronaut, .05);
    //
    //

    // this.background.scaleX = this.astronaut.scaleX;
    // this.background.scaleY = this.astronaut.scaleY;
    this.physics.world.setBounds(0, 0, this.background.displayWidth, this.displayHeight) //TODO: fix backgrounds
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
    this.bulletGroup = this.physics.add.group();
    this.ebulletGroup = this.physics.add.group();
    this.rockGroup = this.physics.add.group();
    this.makeRocks();
    //
    //


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

    this.eship = this.physics.add.sprite(this.centerX, 0, 'eship');
    this.eship.body.collideWorldBounds = true;
    Align.scaleToGameW(this.eship, .35);
    this.makeInfo();
    this.setColliders();
  }

  setColliders() {
    this.physics.add.collider(this.rockGroup);
    this.physics.add.collider(this.bulletGroup, this.rockGroup, this.destroyRock, null, this);
    this.physics.add.collider(this.ebulletGroup, this.rockGroup, this.destroyRock, null, this);
    this.physics.add.collider(this.bulletGroup, this.eship, this.damageEnemy, null, this);
    this.physics.add.collider(this.ebulletGroup, this.astronaut, this.damagePlayer, null, this);
    this.physics.add.collider(this.rockGroup, this.astronaut, this.rockHitPlayer, null, this);
    this.physics.add.collider(this.rockGroup, this.eship, this.rockHitEnemy, null, this);
  }

  makeRocks() {
    if (this.rockGroup.getChildren().length == 0) {
      this.rockGroup = this.physics.add.group({
        key: 'rocks',
        frame: [0, 1, 2],
        frameQuantity: 4,
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
    }
  }

  makeInfo() {
    this.text1 = this.add.text(0, 0, "Sheild\n100", {
      align: 'center',
      backgroundColor: '#000000'
    });
    this.text2 = this.add.text(0, 0, "Enemy Sheild\n100", {
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
    // this.uiGrid.showNumbers();
    //
    //
    this.uiGrid.placeAtIndex(2, this.text1);
    this.uiGrid.placeAtIndex(9, this.text2);
    //
    //
    this.icon1 = this.add.image(0, 0, "astronaut");
    this.icon2 = this.add.image(0, 0, "eship");
    Align.scaleToGameW(this.icon1, .025);
    Align.scaleToGameW(this.icon2, .1);

    this.uiGrid.placeAtIndex(1, this.icon1);
    this.uiGrid.placeAtIndex(7, this.icon2);

    this.icon1.angle = 0;
    this.icon2.angle = 0;

    this.text1.setScrollFactor(0);
    this.text2.setScrollFactor(0);
    this.icon1.setScrollFactor(0);
    this.icon2.setScrollFactor(0);


  }

  downPlayer() {
    this.shield--;
    this.text1.setText('Shield\n' + this.shield);
  }

  downEnemy() {
    this.eshield--;
    this.text2.setText('Enemy Shield\n' + this.eshield);
  }

  rockHitPlayer(astronaut, rock) {
    var explosion = this.add.sprite(rock.x, rock.y, 'exp');
    explosion.play('boom');
    rock.destroy();
    this.makeRocks();
    this.downPlayer();

  }
  damagePlayer(astronaut, bullet) {
    var explosion = this.add.sprite(this.astronaut.x, this.astronaut.y, 'exp');
    explosion.play('boom');
    bullet.destroy();
    this.downPlayer();

  }
  rockHitEnemy(ship, rock) {
    var explosion = this.add.sprite(rock.x, rock.y, 'exp');
    explosion.play('boom');
    rock.destroy();
    this.makeRocks();
    this.downEnemy();
  }
  damageEnemy(astronaut, bullet) {
    var explosion = this.add.sprite(bullet.x, bullet.y, 'exp');
    explosion.play('boom');
    bullet.destroy();

    var angle2 = this.physics.moveTo(this.eship, this.astronaut.x, this.astronaut.y, 100);
    angle2 = this.toDegrees(angle2);
    this.eship.angle = angle2;

    this.downEnemy();

  }

  destroyRock(bullet, rock) {
    bullet.destroy();
    var explosion = this.add.sprite(rock.x, rock.y, 'exp');
    explosion.play('boom');
    rock.destroy();
    this.makeRocks();
  }

  destroyGun(gun) {
    gun.destroy();
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

      var angle = this.physics.moveTo(this.astronaut, tx, ty, 100);
      angle = this.toDegrees(angle);
      this.astronaut.angle = angle;
      //
      //
      //
      var distX2 = Math.abs(this.astronaut.x - tx);
      var distY2 = Math.abs(this.astronaut.y - ty);

      if (distX2 > 30 && distY2 > 30) {

        var angle2 = this.physics.moveTo(this.eship, this.astronaut.x, this.astronaut.y, 60);
        angle2 = this.toDegrees(angle2);
        this.eship.angle = angle2;
      }

      //
    } else {
      this.makeBullet();
    }
  }

  makeBullet() {
    this.showGun();
    var dirObj = this.getDirFromAngle(this.astronaut.angle);
    // console.log(dirObj);

    var bullet = this.physics.add.sprite(this.astronaut.x + dirObj.tx * 30, this.astronaut.y + dirObj.tx * 30, 'bullet');
    Align.scaleToGameW(bullet, .05);
    this.bulletGroup.add(bullet);

    bullet.angle = this.astronaut.angle;
    bullet.body.setVelocity(dirObj.tx * 200, dirObj.ty * 200);
  }

  showGun() {

    var dirObj = this.getDirFromAngle(this.astronaut.angle);
    var gun = this.physics.add.sprite(this.astronaut.x + 12, this.astronaut.y + 5, 'gun');
    Align.scaleToGameW(gun, .1); //TODO: fix gun on astro
    // var gun = this.physics.add.sprite(this.astronaut.x + dirObj.tx * 30, this.astronaut.y + dirObj.tx * 30, 'bullet');
    gun.angle = this.astronaut.angle;
    gun.body.setVelocity(dirObj.tx, dirObj.ty);
    // this.destroyGun(this.gun)
  }

  fireEBullet() {
    var elapsed = Math.abs(this.lastEBullet - this.getTimer());
    if (elapsed < 500) {
      return;
    }
    // var x = this.eship.x +20  //TODO:  fix laser position
    // var  = this.eship.y +20
    this.lastEBullet = this.getTimer();
    var ebullet = this.physics.add.sprite(this.eship.x, this.eship.y, 'ebullet');
    this.ebulletGroup.add(ebullet);
    Align.scaleToGameW(ebullet, .05);
    ebullet.body.angularVelocity = 20;
    this.physics.moveTo(ebullet, this.astronaut.x, this.astronaut.y, 60);
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