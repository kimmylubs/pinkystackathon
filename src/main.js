import Phaser from 'phaser'

import FairyTale from './scenes/FairyTale'
import GameOver from './scenes/Gameover'

const config = {
	type: Phaser.AUTO,
	width: 9500,
	height: 800,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 }
		}
	},
	scene: [FairyTale, GameOver]
}

export default new Phaser.Game(config)
