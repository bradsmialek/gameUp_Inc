class SceneTitle extends Phaser.Scene {
  constructor() {
    super('SceneTitle');
  }
  preload() {
    this.load.image("button1", "/public/assets/images/ui/buttons/2/1.png");
    this.load.image("title", "/public/assets/images/dream.jpg");
    this.load.image("house", "/public/assets/images/dreamone.jpg")
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
    //this.alignGrid.showNumbers();
    //TODO : parralax background
    var title = this.add.image(0, 0, 'title');
    Align.scaleToGameW(title, 3);
    // Align.scaleToGameH(title, .1);
    this.alignGrid.placeAtIndex(38, title);

    var btnStart = new FlatButton({
      scene: this,
      key: 'button1',
      text: 'start',
      event: 'start_game'
    });
    this.alignGrid.placeAtIndex(93, btnStart);

    //TODO: add mario brothers here we go noise
    emitter.on('start_game', this.startGame, this);

  }
  startGame() {
    this.scene.start('BackToSleep'); //Scene1    RocketScene  Game   SceneMain   EndWake
    // this.scene.start('SceneMain');
  }
  update() {}
}