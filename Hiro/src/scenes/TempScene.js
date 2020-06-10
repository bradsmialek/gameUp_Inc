import Phaser from '/Hiro/src/lib/phaser.js';

//var myGame = require('/src/scenes/Game.js');

export default class TempScene extends Phaser.Scene{
    constructor(){
        super('TempScene');
    }

    create(){
        const width = this.scale.width;
        const height = this.scale.height;

        this.add.text(width * 0.5, height*0.5, `Next scene`, {
            fontSize: 48
        }).setOrigin(0.5);
    }
}