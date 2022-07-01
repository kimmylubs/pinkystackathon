import Phaser from 'phaser';

export default class GameOver extends Phaser.Scene{
    constructor(){
        super('game-over')
    }
    create(){
        const width = this.scale.width;
        const height = this.scale.height;
        
        this.add.text(width *.5, height *.5, 'Game Over')
        .setOrigin(0.5)
        
        this.input.keyboard.once('keydown-Z', ()=> {
            this.scene.start("fairytale-game")
        })


    }
}