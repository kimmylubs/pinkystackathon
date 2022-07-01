import Phaser from "phaser";

const ENEMY_KEY= "enemyWalk"

export default class EnemySpawn{
    /*** @param {Phaser.Scene} scene */
    constructor(scene, enemyKey = ENEMY_KEY){
        this.scene = scene
        this.key = enemyKey

        this._group = this.scene.physics.add.group()
    }
    get group(){
        return this._group
    }
    spawn(){
      let a = Phaser.Math.Between(870,1150)
const enemy = this.group.create(a, 620, ENEMY_KEY)
enemy.setScale(2);
enemy.setBounce(1)
enemy.setCollideWorldBounds(true)
enemy.setVelocity(Phaser.Math.Between(-200, 200), 20)

        return enemy;
    }
}


