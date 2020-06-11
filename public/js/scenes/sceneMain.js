class SceneMain extends Phaser.Scene {
  constructor() {
    super('SceneMain');
  }

  preload() {

  }

  create() {
    emitter = new Phaser.Events.EventEmitter();
    controller = new Controller();
    var mediaManager = new MediaManager({
      scene: this
    });

    mediaManager.setBackgroundMusic("backgroundmusic");

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

    this.shield = 10;
    this.eshield = 10;

    model.playerWon = true;

    //
    this.bg_1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg_1");
    this.bg_1.setOrigin(0, 0);
    this.bg_1.setScrollFactor(0);

    this.bg_5 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg_5");
    this.bg_5.setOrigin(0, 0);
    this.bg_5.setScrollFactor(0);

    this.bg_6 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg_6");
    this.bg_6.setOrigin(0, 0);
    this.bg_6.setScrollFactor(0);
    //

    this.centerX = game.config.width / 2;
    this.centerY = game.config.height / 2;
    this.background = this.bg_6
    //
    //
    this.astronaut = this.physics.add.sprite(this.centerX, this.centerY, "astronaut");
    Align.scaleToGameW(this.astronaut, .025);
    //
    //
    this.background.setInteractive();
    this.background.on("pointerup", this.backgroundClicked, this);
    this.background.on("pointerdown", this.onDown, this);
    //
    // 
    this.cameras.main.startFollow(this.astronaut, true);
    //
    //
    this.bulletGroup = this.physics.add.group();
    this.ebulletGroup = this.physics.add.group();
    this.rockGroup = this.physics.add.group();
    this.makeRocks();
    //
    //
    this.eship = this.physics.add.sprite(this.centerX, 0, 'eship');
    this.eship.body.collideWorldBounds = true;
    Align.scaleToGameW(this.eship, .15);
    this.makeInfo();
    this.setColliders();
    var sb = new SoundButtons({
      scene: this
    });


    this.myCam = this.cameras.main;
    this.myCam.setBounds(0, 0, 2000, 0);

    // making the camera follow the player
    this.myCam.startFollow(this.astronaut);

  }

  setColliders() {
    this.physics.add.collider(this.bulletGroup, this.eship, this.damageEnemy, null, this);
    this.physics.add.collider(this.ebulletGroup, this.astronaut, this.damagePlayer, null, this);
  }

  setRockColliders() {
    this.physics.add.collider(this.rockGroup);
    this.physics.add.collider(this.bulletGroup, this.rockGroup, this.destroyRock, null, this);
    this.physics.add.collider(this.ebulletGroup, this.rockGroup, this.destroyRock, null, this);
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

        Align.scaleToGameW(child, .05)

        var vx = Math.floor(Math.random() * 2) - 1;
        var vy = Math.floor(Math.random() * 2) - 1;

        if (vx == 0 && vy == 0) {
          vx = 1;
          vy = 1;
        }

        var speed = Math.floor(Math.random() * 200) + 10;
        child.body.setVelocity(vx * speed, vy * speed);

      }.bind(this));
      this.setRockColliders();
    }
  }

  makeInfo() {
    this.text1 = this.add.text(0, 0, "Sheild\n10", {
      align: 'center',
      backgroundColor: '#000000'
    });
    this.text2 = this.add.text(0, 0, "Enemy Sheild\n10", {
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

    this.uiGrid.placeAtIndex(2, this.text1);
    this.uiGrid.placeAtIndex(8, this.text2);
    //
    //
    this.icon1 = this.add.image(0, 0, "astronaut");
    this.icon2 = this.add.image(0, 0, "eship");
    Align.scaleToGameW(this.icon1, .02);
    Align.scaleToGameW(this.icon2, .08);

    this.uiGrid.placeAtIndex(1, this.icon1);
    this.uiGrid.placeAtIndex(6, this.icon2);

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
    if (this.shield == 0) {
      model.playerWon = false;
      this.scene.start('BackToSleep')
    }
  }

  downEnemy() {
    this.eshield--;
    this.text2.setText('Enemy Shield\n' + this.eshield);
    if (this.eshield == 0) {
      model.playerWon = true;
      this.escene.start('EndAwake')
    }
  }

  rockHitPlayer(astronaut, rock) {
    var explosion = this.add.sprite(rock.x, rock.y, 'exp');
    explosion.play('boom');
    emitter.emit(G.PLAY_SOUND, "explode");
    rock.destroy();
    this.makeRocks();
    this.downPlayer();

  }
  damagePlayer(astronaut, bullet) {
    var explosion = this.add.sprite(this.astronaut.x, this.astronaut.y, 'exp');
    explosion.play('boom');
    emitter.emit(G.PLAY_SOUND, "explode");
    bullet.destroy();
    this.downPlayer();

  }
  rockHitEnemy(ship, rock) {
    var explosion = this.add.sprite(rock.x, rock.y, 'exp');
    explosion.play('boom');
    emitter.emit(G.PLAY_SOUND, "explode");
    rock.destroy();
    this.makeRocks();
    this.downEnemy();
  }
  damageEnemy(astronaut, bullet) {
    var explosion = this.add.sprite(bullet.x, bullet.y, 'exp');
    explosion.play('boom');
    emitter.emit(G.PLAY_SOUND, "explode");
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
    emitter.emit(G.PLAY_SOUND, "explode");
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

    if (elapsed < 300) {
      var tx = this.background.input.localX;
      this.tx = tx;
      var ty = this.background.input.localY;
      this.ty = ty;

      var angle = this.physics.moveTo(this.astronaut, tx, ty, 100);
      angle = this.toDegrees(angle);
      this.astronaut.angle = angle;

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

    var bullet = this.physics.add.sprite(this.astronaut.x + dirObj.tx * 30, this.astronaut.y + dirObj.tx * 30, 'bullet');
    Align.scaleToGameW(bullet, .02);
    this.bulletGroup.add(bullet);

    bullet.angle = this.astronaut.angle;
    bullet.body.setVelocity(dirObj.tx * 200, dirObj.ty * 200);
    emitter.emit(G.PLAY_SOUND, "laser");
  }

  showGun() {

    var dirObj = this.getDirFromAngle(this.astronaut.angle);
    var gun = this.physics.add.sprite(this.astronaut.x + 12, this.astronaut.y + 5, 'gun');
    Align.scaleToGameW(gun, .05); //TODO: fix gun on astro
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
    Align.scaleToGameW(ebullet, .035);
    ebullet.body.angularVelocity = 20;
    this.physics.moveTo(ebullet, this.astronaut.x, this.astronaut.y, 100);
    emitter.emit(G.PLAY_SOUND, "enemyShoot");
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

    this.bg_1.tilePositionX = this.myCam.scrollX * .3;
    this.bg_5.tilePositionX = this.myCam.scrollX * .6;
    this.bg_6.tilePositionX = this.myCam.scrollX * 1;

    var distX = Math.abs(this.astronaut.x - this.tx);
    var distY = Math.abs(this.astronaut.y - this.ty);

    if (distX < 10 && distY < 10) {
      this.astronaut.body.setVelocity(0, 0);
    }

    var distX2 = Math.abs(this.astronaut.x - this.eship.x);
    var distY2 = Math.abs(this.astronaut.y - this.eship.y);

    if (distX2 < game.config.width / 5 && distY2 < game.config.height / 5) {
      this.fireEBullet();
    }
  }
}