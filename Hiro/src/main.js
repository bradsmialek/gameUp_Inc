import Phaser from './lib/phaser.js';

import Scene1 from './scenes/Scene1.js'
import Scene2 from './scenes/Scene2.js'; // import Game scene
import ScorePage from './scenes/ScorePage.js' // import the GameOver scene
import GameOver from './scenes/GameOver.js' // import the GameOver scene
import TempScene from './scenes/TempScene.js';

//console.dir(Phaser)
//console.log("Hello World");

export default new Phaser.Game({
    type: Phaser.AUTO, // Phaser will decide use Canvas or WebGL 
    width: 800,
    height: 600,
    scene: [Scene1, Scene2, TempScene, , ScorePage, GameOver],
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