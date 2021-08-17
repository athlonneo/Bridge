class HomeScene extends Phaser.Scene {

  constructor() {
    super('HomeScene');
  }

  preload() {
  }

  create() {  		
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0).setDepth(-1);
    this.background.displayWidth = config.width;
    this.background.displayHeight = config.height;

    this.platform = this.createPlatform(16,2);
    this.player = this.add.sprite(48, config.height-(32*7), "player").setOrigin(0.5 , 0.9);
    this.player.displayWidth = 64;
    this.player.displayHeight = 64;
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 1] }),
      frameRate: 2,
      repeat: -1
    });
    this.player.play('idle');

    this.titleText = this.add.text(config.width/2, 100, "BRIDGE", {fill: "#ffffff", font: '900 50px Courier'}).setOrigin(0.5, 0);
    this.startText = this.add.text(config.width/3*2, config.height/3*2, "TAP ", {fill: "#ffffff", font: '900 50px Courier'}).setOrigin(0.5, 0);

    this.input.on('pointerup', this.startGame, this);
  }

  createPlatform(x, size){
    var platform = [];
    for(var j=0; j<size; j++){
      for(var i=0;i<7;i++){
        var block = this.add.sprite(x+(j*32), config.height-(i*32)-16,'block');
        
        block.displayWidth = 32;
        block.displayHeight = 32;
        platform.push(block);
      }
    }
    return platform;
  }

  startGame(){
    this.scene.start('PlayScene');
  }

}