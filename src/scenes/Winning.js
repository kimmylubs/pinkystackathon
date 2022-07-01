const WIN_KEY = "building4";

export default class Winning {
  /*** @param {Phaser.Scene} scene */
  constructor(scene, winKey = WIN_KEY) {
    this.scene = scene;
    this.key = winKey;

    this._group = this.scene.physics.add.group();
  }
  get group() {
    return this._group;
  }
  spawn() {
    const win = this.group.create(6000, 540, WIN_KEY);
    win.setScale(1);
    win.setCollideWorldBounds(true);

    return win;
  }
}
