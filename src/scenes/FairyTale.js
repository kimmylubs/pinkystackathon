import Phaser from "phaser";
import EnemySpawn from "./EnemySpawn";
import Winning from "./Winning";

//keys = easier to reference stuff and no typos
const LAYER_1 = "bottom";
const LAYER_2 = "fairytale3";
const LAYER_3 = "fairytale4";
const LAYER_4 = "fairytale5";
const LAYER_5 = "fairytale6";
const LAYER_6 = "fairytale7";
const LAYER_7 = "fairytale8";

// platforms
const BOWL_1 = "bowl1";
const BUILDING_2 = "building2";
const BUILDING_3 = "building3";
const BUILDING_5 = "building5";
const WIN_KEY = "building4";
const BUILDING_8 = "building8";
const ROCK = 'rock';

//pinky spitesheet
const PINKY_ATTACK = "pinkyAttack";
const PINKY_CLIMB = "pinkyClimb";
const PINKY_DIE = "pinkyDie";
const PINKY_HURT = "pinkyHurt";
const PINKY_IDLE = "pinkyIdle";
const PINKY_JUMP = "pinkyJump";
const PINKY_RUN = "pinkyRun";
const PINKY_WALK = "pinkyWalk";

//enemy spritesheet
const ENEMY_KEY= "enemyWalk";


// action keys
const LEFT_KEY = 'left';
const JUMP_KEY = 'jump';
const RIGHT_KEY = 'right';
const IDLE_KEY = 'idle';
const CLIMB_KEY = 'climb';
const ATTACKR_KEY = 'attackR';
const ATTACKL_KEY = 'attackL';
const DIE_KEY = 'die';

            // use this reusable function instead of this.add.image
            const createAligned = ( scene, count, texture, origin1, origin2, scrollFactor) => {
                let x = 0;
                // to loop the image aka to make at least COUNT MANY OF THESE
                for (let i = 0; i < count; i++) {
                  // x = count/width, and width of last created image in the for loop
                  const m = scene.add
                    .image(x, scene.scale.height, texture)
                    .setOrigin(origin1, origin2)
                    .setScrollFactor(scrollFactor);
                  // to keep the image looping +1 count
                  x += m.width;
                }
              };

// scene = this will be Phaser.Scene, so a scene
// count/width = number of appeareances of the image
// texture = the image
// setOrigin/origin 1 = horizontal x origin
// origin 2 = horizontal 6 origin
// setScrollFactor/scrollFactor = lets you control movement of Camera/image; 0 means no movement, 1 means in sync with the camera

export default class FairyTale extends Phaser.Scene {
  constructor() {
    super("fairytale-game");

    this.player = undefined;
    this.cursors = undefined;
    
    this.gameOver = false;
    this.gameWin = false;

  }
preload() {
  //background
  this.load.image(LAYER_1, "assets/background/bottom.png");
  this.load.image(LAYER_2, "assets/background/fairytale3.png");
  this.load.image(LAYER_3, "assets/background/fairytale4.png");
  this.load.image(LAYER_4, "assets/background/fairytale5.png");
  this.load.image(LAYER_5, "assets/background/fairytale6.png");
  this.load.image(LAYER_6, "assets/background/fairytale7.png");
  this.load.image(LAYER_7, "assets/background/fairytale8.png");

  //platform
  this.load.image(BOWL_1, "assets/buildings/bowl1.png");
  this.load.image(BUILDING_2, "assets/buildings/building2.png");
  this.load.image(BUILDING_3, "assets/buildings/building3.png");
  this.load.image(BUILDING_5, "assets/buildings/building5.png");
  this.load.image(WIN_KEY, "assets/buildings/building4.png");
  this.load.image(BUILDING_8, "assets/buildings/building8.png");
  this.load.image(ROCK, 'assets/buildings/rock2.png')

  //pinky sprite sheet
  this.load.spritesheet(PINKY_ATTACK, "assets/pinky/pinkyAttack.png" , {frameWidth: 32,frameHeight: 32}); 
  this.load.spritesheet(PINKY_CLIMB, "assets/pinky/pinkyClimb.png" , {frameWidth: 32,frameHeight: 32});
  this.load.spritesheet(PINKY_DIE, "assets/pinky/pinkyDie.png" , {frameWidth: 32,frameHeight: 32});
  this.load.spritesheet(PINKY_HURT, "assets/pinky/pinkyHurt.png" , {frameWidth: 32,frameHeight: 32});
  this.load.spritesheet(PINKY_IDLE, "assets/pinky/pinkyIdle.png" , {frameWidth: 32,frameHeight: 32});
  this.load.spritesheet(PINKY_JUMP, "assets/pinky/pinkyJump.png" , {frameWidth: 32,frameHeight: 32});
  this.load.spritesheet(PINKY_RUN, "assets/pinky/pinkyRun.png" , {frameWidth: 32,frameHeight: 32});
  this.load.spritesheet(PINKY_WALK, "assets/pinky/pinkyWalk.png" , {frameWidth: 32,frameHeight: 32});

  // enemy sprite sheet 
  this.load.spritesheet(ENEMY_KEY, "assets/enemy/dudeWalk.png", {frameWidth: 32,frameHeight: 32});
}
  create() {
      const {width, height} = this.scale;
      this.createLayers();

    //   const GameOverText = this.add.text(width * 0.5, height * 0.5, 'Game Over', { fontSize: '48' }).setOrigin(0.5)
    //   this.scoreText = this.add.text(16,16, 'Score: 0',{ color: '#000', fontSize:'24' })
      const rocks = this.createRock();
      const platforms = this.createPlatform();
      this.player = this.createPlayer();    

      this.enemySpawn = new EnemySpawn(this, ENEMY_KEY);
      const enemyGroup = this.enemySpawn.group
      this.enemySpawn.spawn();

      this.winning = new Winning(this, WIN_KEY)
      const winGroup = this.winning.group
      this.winning.spawn();


      this.physics.add.collider(rocks, platforms);
      this.physics.add.collider(this.player, platforms);
      this.physics.add.collider(enemyGroup, platforms);
      this.physics.add.collider(this.player,enemyGroup, this.hitEnemy, null, this);
      this.physics.add.collider(this.player,winGroup, this.gameCompleted, null, this);

      this.cursors = this.input.keyboard.createCursorKeys();
          // camera movement
    this.cameras.main.setBounds(0, 0, width * 5, height);
    // this.cameras.main.startFollow(this.player, true);

    // this.cameras.main.startFollow(this.player);
    this.physics.world.setBounds(0, 0, width * 5, height);
    
    
}
update() {
    let keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    let keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    let keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    const cam = this.cameras.main;
    const speed = 1.7;

        if(this.cursors.left.isDown){
            this.player.setVelocityX(-160)
            this.player.anims.play(LEFT_KEY, true)
            cam.scrollX -= speed
        }
        else if(this.cursors.right.isDown){
            this.player.setVelocityX(160)
            this.player.anims.play(RIGHT_KEY, true) 
            cam.scrollX += speed;
        }
        else if (this.cursors.up.isDown  && (this.player.body.onFloor() || this.player.body.touching.down)) {
            this.player.setVelocityY(-350);
            this.player.anims.play(JUMP_KEY, true)
            // this.enemy.anims.play(ENEMY_IDLE, true)
        }
        else if (keySpace.isDown ) {
            console.log('Space')
           this.player.setVelocityY(-100);
           this.player.anims.play(CLIMB_KEY, true)
        }
        else if (keyA.isDown) {

           this.player.anims.play(ATTACKL_KEY, true)
           console.log('A')
        }
        else if (keyS.isDown ) {
            console.log('S')
           this.player.anims.play(ATTACKR_KEY, true)
        }
        else if(this.gameOver){
            this.player.anims.play(DIE_KEY, true)
        }
        else {
            this.player.setVelocityX(0)
            this.player.anims.play(IDLE_KEY, true)
            // this.enemy.anims.play(ENEMY_WALK, true)
        } 
        


}
  createLayers(){
    const {width} = this.scale
    const totalWidth = width * 6;
    const mountainCount =
      totalWidth / this.textures.get(LAYER_6).getSourceImage().width;

    createAligned(this, mountainCount, LAYER_7, 0.8, 0.8, 0.1);
    createAligned(this, mountainCount, LAYER_6, 0, 0.8, 0.25);
    createAligned(this, mountainCount, LAYER_5, 0, 0.8, 0.35);
    createAligned(this, mountainCount, LAYER_4, 0, 0.8, 0.35);
    createAligned(this, mountainCount, LAYER_3, 0, 0.8, 0.45);
    createAligned(this, mountainCount, LAYER_2, 0, 0.8, 0.45);
      
  }
  createRock(){
      // non moving group, if they were static, they would be through each other
      const rocks = this.physics.add.staticGroup();
      rocks.create(2700,700, ROCK).setScale(4)
      rocks.create(2700,650, ROCK).setScale(4)
      rocks.create(2700,600, ROCK).setScale(4)
      rocks.create(2700,550, ROCK).setScale(4)
      rocks.create(2700,500, ROCK).setScale(4)
      rocks.create(2700,450, ROCK).setScale(4)
      rocks.create(2700,400, ROCK).setScale(4)
      rocks.create(2700,350, ROCK).setScale(4)
      rocks.create(2700,300, ROCK).setScale(4)
      rocks.create(2700,250, ROCK).setScale(4)
      rocks.create(2700,200, ROCK).setScale(4)
      
      return rocks;
  }
  createPlatform() {
      const platforms = this.physics.add.staticGroup();
      //creating playform width x height, texture, scale
      platforms.create(600, 750, BUILDING_5);
      platforms.create(1420, 670, BUILDING_5);
      //   platforms.create(2400, 600, BUILDING_2);
      platforms.create(3000, 360, BUILDING_5);
      platforms.create(3000, 530, BUILDING_5);
      platforms.create(3000, 700, BUILDING_5);
      // 9500 is end
      // platforms.create(9500, 400, BOWL_1)
      platforms.create(4000, 620, BUILDING_8).setScale(2);
      platforms.create(4600, 620, BUILDING_8).setScale(2);
      platforms.create(5200, 620, BUILDING_8).setScale(2);
    //   platforms.create(6000, 620, BUILDING_8).setScale(2);
    //   platforms.create(6000, 540, BUILDING_4).setScale(1);
      platforms.create(0, 760, LAYER_1)
      platforms.create(1804, 760, LAYER_1)
      platforms.create(3608, 760, LAYER_1)
      platforms.create(5413, 760, LAYER_1)
      platforms.create(7216, 760, LAYER_1)
      platforms.create(9020, 760, LAYER_1)
      platforms.create(10824, 760, LAYER_1)

      
      return platforms;
    }
    createPlayer(){
        const player = this.physics.add.sprite(100, 600, PINKY_IDLE)
        player.setScale(4);
        // when it lands on the floor it will bounce up twice
        player.setBounce(0)
        // setCollideWorldBounds means it wont come out of the window.
        player.setCollideWorldBounds(true)
        // this.cameras.main.startFollow(player,true, 0.5,0.5);

        this.anims.create({
            key: LEFT_KEY,
            frames: this.anims.generateFrameNumbers(PINKY_WALK, {start: 0, end: 5}),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({ 
            key: IDLE_KEY,
            frames:this.anims.generateFrameNumbers(PINKY_IDLE, {frames: [0,1,2,3]}),
            frameRate: 6,
        })
        this.anims.create({
            key: RIGHT_KEY,
            frames: this.anims.generateFrameNumbers(PINKY_RUN, {start: 0, end: 5}),
            frameRate: 15,
            repeat: -1,
        })
        this.anims.create({
            key: JUMP_KEY,
            frames: this.anims.generateFrameNumbers(PINKY_JUMP, {start: 0, end: 7}),
            frameRate: 8,
            repeat: -1,
        })
        this.anims.create({
            key: CLIMB_KEY,
            frames: this.anims.generateFrameNumbers(PINKY_CLIMB, {start:0, end:3}),
            frameRate: 8,
            repeat: -1,
        })
        this.anims.create({
            key: ATTACKR_KEY,
            frames: this.anims.generateFrameNumbers(PINKY_ATTACK, {start: 3, end: 5}),
            frameRate: 6,
            repeat: -1,
        })
        this.anims.create({
            key: ATTACKL_KEY,
            frames: this.anims.generateFrameNumbers(PINKY_ATTACK, {start: 0, end: 3}),
            frameRate: 6,
            repeat: -1,
        })
        this.anims.create({
            key: DIE_KEY,
            frames: this.anims.generateFrameNumbers(PINKY_DIE, {start:0, end:7}),
            frameRate: 4,
            repeat: 1,
        })
        return player;
    }
    gameCompleted(player){
        this.physics.pause()
        player.setTint(0xA3EC79)
        player.anims.play(PINKY_IDLE)
        this.gameWin = true;
    }
    hitEnemy(player){
        player.setTint(0xff0000)
        this.gameOver = true;
        this.physics.pause()
        setTimeout(() => {
           alert('Game Over! ')
            location.reload(); 
        }, 1900) 
        }
    // restartPopup(){

    // }

}
