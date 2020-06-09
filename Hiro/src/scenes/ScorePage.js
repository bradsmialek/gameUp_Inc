import Phaser from '/Hiro/src/lib/phaser.js';

//var myGame = require('/src/scenes/Game.js');

export default class ScorePage extends Phaser.Scene{
    constructor(){
        super('ScorePage');
    }

    init(data){
        this.score = data.score;
    }

    create(){
        const width = this.scale.width;
        const height = this.scale.height;

        this.add.text(width * 0.5, height*0.5, `Your score : ${this.score}`, {
            fontSize: 48
        }).setOrigin(0.5);
    }
}