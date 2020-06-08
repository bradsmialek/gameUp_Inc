import Phaser from '/src/lib/phaser.js';
import ScoreLabel from '/src/game/ScoreLabel.js';
import BombSpawner from '/src/game/BombSpawner.js';
import ScorePage from '/src/scenes/ScorePage.js';
//import Carrot from '/src/game/Carrot.js';

//import GameOver from '/src/scenes/GameOver.js';

const GROUND_KEY = 'ground';
const DUDE_KEY = 'dude';
const STAR_KEY = 'star';
const BOMB_KEY = 'bomb';
const MUSH_ROOM = 'mushRoom';
const GOLD_COIN = 'coldCoin';
var size = 1.0;
var bombBounceValue = 0.1;
var countStarGenerate = 0;
var oldCountStarGenerate = 0;
var timedEvent;
var c = 0;
var timeSecondOld = 0;
var timeSecond = 0;
var text;
var timerMax = 60; // seconds 
var timerRemaining;
var starRegeneratePosY = 0;
var score = 0;

export default class Game extends Phaser.Scene{

    constructor(){
        super('Game') // Scene 'game'
        this.player = undefined;
        this.cursors = undefined;
        this.scoreLabel = undefined;
        this.stars = undefined;
        this.bombSpawner = undefined;
        this.gameOver = false;
        //this.score = score;
    }

    init(){
        
    }

    /*** preload() and create() wiil be called by Phaser at appropriate timing ***/
    // specify images, audio, or other assets to load before starting the Scene
    preload(){
  
        this.load.image('sky', 'assets/sky.png');
        this.load.image(GROUND_KEY, 'assets/platform.png');
        this.load.image(STAR_KEY, 'assets/star.png');
        this.load.image(BOMB_KEY, 'assets/bomb.png');
        this.load.image(MUSH_ROOM, 'assets/mushroom_brown.png');
        this.load.image(GOLD_COIN, 'assets/goldCoin.png');
        this.load.spritesheet(DUDE_KEY, 'assets/dude.png', {frameWidth:32, frameHeight:48});
    }

    // Create() is called once all the assets for the Scene have been loaded
    // Only assets that have been loaded can be used in create()
    create(){

        this.add.image(400, 300, 'sky');
        //this.add.image(400, 300, 'star').setScale(size);
        

        const platforms = this.createPlatforms();
        this.player = this.createPlayer();
        //const stars = this.createStars();
        this.stars = this.createStars();
        //const goldCoins = this.createCoins();

        this.scoreLabel = this.createScoreLabel(16, 16, 0);

        this.bombSpawner = new BombSpawner(this, BOMB_KEY);
        const bombsGroup = this.bombSpawner.group;

        this.physics.add.collider(this.player, platforms);
        //this.physics.add.collider(stars, platforms);
        this.physics.add.collider(this.stars, platforms);
        this.physics.add.collider(bombsGroup, platforms);
        //this.physics.add.collider(this.player, goldCoins);
        this.physics.add.collider(this.player, bombsGroup, this.hitBomb, null, this);
        //this.physics.add.collider(this.player, goldCoins, this.hitGoldCoins, null, this);
        //this.physics.add.overlap(this.player, stars, this.collectStar, null, this);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.cursors = this.input.keyboard.createCursorKeys();

        /** Timer **/
        text = this.add.text(25, 50);
        timedEvent = this.time.addEvent({delay: 1000, callback: onEvent, callBackScope: this, loop: true});
    }

    createPlatforms(){
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody();
        platforms.create(600, 400, GROUND_KEY);
        platforms.create(50, 250, GROUND_KEY);
        platforms.create(750, 220, GROUND_KEY);

        return platforms;
    }

    createPlayer(){
        this.player = this.physics.add.sprite(100, 450, DUDE_KEY);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        
        this.anims.create({
            key : 'left',
            frames: this.anims.generateFrameNumbers(DUDE_KEY, {start:0, end: 3}),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key : 'turn',
            frames: [{key: DUDE_KEY, frame: 4}],
            frameRate: 20,
        })

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(DUDE_KEY, {start:5, end:8}),
            frameRate: 10,
            repeat: -1
        })

        return this.player;
    }

    // createCoins(){
    //     const coins = this.physics.add.staticGroup();
    //     coins.create(400, 400, GOLD_COIN).setScale(0.5).refreshBody();
    //     return coins;
    // }

    createStars(){
        const stars = this.physics.add.group({
            key : STAR_KEY,
            repeat : 11,
            setXY : {x:12, y:300, stepX:70}
        });

        stars.children.iterate((child) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        });

        return stars;
    }


    collectStar(player, star){
        star.disableBody(true, true);
        size = size + 0.1;
        this.scoreLabel.add(10);
        score = this.scoreLabel.getScore();
        console.log(score);

        // Generate stars once all stars are gone
        if (this.stars.countActive(true) === 0){
            starRegeneratePosY = Phaser.Math.Between(0, 400); // Randomly generate Y value
            this.stars.children.iterate((child) => {child.enableBody(true, child.x + Phaser.Math.FloatBetween(-10, 10), starRegeneratePosY, true, true)
                console.log(child.x);
            })
            countStarGenerate += 1;
            console.log(countStarGenerate);

        }
        if (countStarGenerate != oldCountStarGenerate){
            if (countStarGenerate === 1){
                const mushRoom1 = this.physics.add.staticImage(200, 500, MUSH_ROOM).setScale(0.5).refreshBody();
                this.physics.add.collider(this.player, mushRoom1);
                this.physics.add.collider(mushRoom1, this.stars);
                console.log("this is count1");
            }
            else if (countStarGenerate === 2){
                const mushRoom2 = this.physics.add.staticImage(300, 250, MUSH_ROOM).setScale(0.5).refreshBody();
                this.physics.add.collider(this.player, mushRoom2);
                this.physics.add.collider(mushRoom2, this.stars);
                console.log("this is count2");
            }
        //     console.log('Count :' + countStarGenerate);
        //     console.log('OldCount:' + oldCountStarGenerate);
        }
        oldCountStarGenerate = countStarGenerate;
        

        // bouncing value of star
        bombBounceValue = Phaser.Math.FloatBetween(0.1, 0.5);
        this.bombSpawner.spawn(player.x, bombBounceValue);
    }

    // update() will be executed every over and over ('update loop')
    update(){
        if (this.cursors.left.isDown){
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown){
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else{
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-330);
        }

        // Timer
        timerRemaining = timerMax-(c + timedEvent.getProgress());
        timeSecond = timerRemaining.toFixed(0);
        //console.log(timeSecond);
        if (timerRemaining > 0){
            text.setText('Time remaining: '+ timerRemaining.toString().substr(0, 4) + '[sec]');
        }
        else{
            text.setText('Time remaining: 0.00[sec]');
        }
        if (timeSecond !== timeSecondOld){
            if (timeSecond == 55){
                const goldCoin = this.physics.add.staticImage(100, 400, GOLD_COIN).setScale(0.5).refreshBody();
                //const goldCoins = this.createCoins();
                this.physics.add.collider(this.player, goldCoin, this.hitGoldCoins, null, this);
            }
            if (timeSecond == 45){
                const goldCoin = this.physics.add.staticImage(200, 300, GOLD_COIN).setScale(0.5).refreshBody();
                //const goldCoins = this.createCoins();
                this.physics.add.collider(this.player, goldCoin, this.hitGoldCoins, null, this);
            }
            if (timeSecond == 35){
                const goldCoin = this.physics.add.staticImage(400, 200, GOLD_COIN).setScale(0.5).refreshBody();
                //const goldCoins = this.createCoins();
                this.physics.add.collider(this.player, goldCoin, this.hitGoldCoins, null, this);
            }
            if (timeSecond == 25){
                const goldCoin = this.physics.add.staticImage(500, 100, GOLD_COIN).setScale(0.5).refreshBody();
                //const goldCoins = this.createCoins();
                this.physics.add.collider(this.player, goldCoin, this.hitGoldCoins, null, this);
            }
            if (timeSecond == 15){
                const goldCoin = this.physics.add.staticImage(300, 100, GOLD_COIN).setScale(0.5).refreshBody();
                //const goldCoins = this.createCoins();
                this.physics.add.collider(this.player, goldCoin, this.hitGoldCoins, null, this);
            }
            // if (timeSecond == 47){
            //     goldCoins.disableBody(true, true);
            // }
            //console.log('timeSecond :'+ timeSecond);
            //console.log('timeSecondOld : ' + timeSecondOld);
        }
        timeSecondOld = timeSecond;

        //score = this.scoreLabel.getScore();
        //console.log(score);

        if (timeSecond == 0){
            this.scene.start('ScorePage', {score : score});
        }

    }
    createScoreLabel(x, y, score){
        const style = { fontSize:'32px', fill:'#000'}
        const label = new ScoreLabel(this, x, y, score, style);
        this.add.existing(label);
        return label;
    }

    hitBomb(player, bomb){
        //this.physics.setTint(0xff0000);
        bomb.disableBody(true, true);
        this.scoreLabel.subtract(5);
        score = this.scoreLabel.getScore();
        console.log(score);
    }
    hitGoldCoins(player, coin){
        coin.disableBody(true, true);
        this.scoreLabel.add(50);
        score = this.scoreLabel.getScore();
        console.log(score);
    }

}
// For timer
function onEvent(){
    c++;
}


console.log('Hello World');
