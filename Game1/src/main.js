import Phaser from './lib/phaser.js';

import Game from './scenes/Game.js'; // import Game scene
import ScorePage from './scenes/ScorePage.js' // import the GameOver scene

console.dir(Phaser)
console.log("Hello World");

export default new Phaser.Game({
    type: Phaser.AUTO, // Phaser will decide use Canvas or WebGL 
    width: 800,
    height: 600,
    scene: [Game, ScorePage],
    physics:{
        default: 'arcade',
        arcade:{
            gravity:{
                y: 300
            },
            debug: false
        }
    }
})