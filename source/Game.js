class PlayScene extends Phaser.Scene {

  constructor() {
    super('PlayScene');
  }

  create() {
    this.nsSound = this.sound.add("good");
    this.gsSound = this.sound.add("great");
    this.failSound = this.sound.add("fail");

    this.background = this.add.image(0, 0, "background").setOrigin(0, 0).setDepth(-1);
    this.background.displayWidth = config.width;
    this.background.displayHeight = config.height;

    this.player = this.add.sprite(48, config.height-(32*7), "player").setOrigin(0.5 , 0.9);
    this.player.displayWidth = 64;
    this.player.displayHeight = 64;
    this.initAnims();

    this.platforms = [];
    this.platforms[0] = this.createPlatform(16,2);
    this.platforms[1] = this.randomPlatform(0);
    this.platforms[2] = this.randomPlatform(this.platforms[1][0].x);

    this.bridges = [];
    this.bridges[0] = this.createBridge();
    this.bridges[1] = this.createBridge();

    this.inputFlag = true; 
    this.extendFlag = false;   
    this.input.on("pointerdown", this.extendBridge, this);
    this.input.on("pointerup", this.rotateBridge, this);

    this.score = 0;
    this.scoreText = this.add.text(config.width/2, 50, String(this.score), {fill: "#ffffff", font: "900 50px Courier"}).setOrigin(0.5, 0);

    this.retryButton = this.add.image(config.width/2, config.height/2, "retry").setInteractive();
    this.retryButton.displayWidth = 128;
    this.retryButton.displayHeight = 128;
    this.retryButton.visible = false;
    this.retryButton.on('pointerup', () => {
      this.scene.start('PlayScene');
    })

    this.player.play('idle');
  }

  initAnims(){
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 1] }),
      frameRate: 2,
      repeat: -1
    });

    this.anims.create({
      key: 'act',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 27 ] }),
      repeat: 0
    });

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 7, 8, 9, 10, 14, 15, 16, 17 ] }),
      frameRate: 8,
      repeat: -1
    });
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

  randomPlatform(offset){
    var x = Math.floor(Math.random() * 5) + 5;
    var size = Math.floor(Math.random() * 3) + 1;
    console.log("Generate Platform:",x,size);
    return this.createPlatform(16+(x*32)+(offset-16), size);
  }

  createBridge(){
    var bridge = this.add.sprite(this.player.x+16, this.player.y, 'bridge').setOrigin(1);
    bridge.displayWidth = 5
    bridge.displayHeight = 0;
    this.bridgeRotate = this.tweens.add({
      targets: bridge,
      angle: 90,
      duration: 500,
      paused: true,
      onComplete: this.executeBridge,
      callbackScope: this,
    });
    return bridge;
  }

  extendBridge(){
    if(this.inputFlag){
      this.extendFlag = true;
    }   
  }

  rotateBridge(){
    if(this.inputFlag && this.extendFlag){
      this.inputFlag = false;
      this.extendFlag = false;
      this.bridgeRotate.play();
      this.player.play('act');
    }
  }

  executeBridge(){
    var platformSize = this.platforms[1].length / 7;
    var platformXStart = this.platforms[1][0].x - 16;
    var platformXEnd = platformXStart + (32*platformSize);
    var bridgeEnd = this.bridges[1].displayHeight + this.bridges[1].x;
    var greatSuccessStart = platformXStart-((platformXStart-platformXEnd)/2)-4;
    var greatSuccessEnd = platformXEnd+((platformXStart-platformXEnd)/2)+4;

    console.log("Platform Area: " + platformXStart + " - " + platformXEnd);
    console.log("Platform Area S: " + greatSuccessStart + " - " + greatSuccessEnd);
    console.log ("Bridge Point: " + bridgeEnd);

    this.player.play('walk');
    if(bridgeEnd > greatSuccessStart && bridgeEnd < greatSuccessEnd){
      this.tweens.add({
        targets: this.player,
        x: platformXEnd - 16,
        duration: (platformXEnd - 16 - this.player.x) * 5,
        onComplete: this.roundGreatSuccess,
        callbackScope: this,
      });
    }
    else if(bridgeEnd > platformXStart && bridgeEnd < platformXEnd){
      this.tweens.add({
        targets: this.player,
        x: platformXEnd - 16,
        duration: (platformXEnd - 16 - this.player.x) * 5,
        onComplete: this.roundSuccess,
        callbackScope: this,
      });
    }
    else{
      this.tweens.add({
        targets: this.player,
        x: bridgeEnd,
        duration: (bridgeEnd - this.player.x) * 5,
        onComplete: this.roundFail,
        callbackScope: this,
      });
    }
  }


  roundSuccess(){
    this.player.play('idle');
    this.nsSound.play();
    this.score++;
    this.scoreText.setText(this.score);
    this.moveScreen();    
  }

  
  roundGreatSuccess(){
    this.player.play('idle');
    this.gsSound.play();
    this.score+=2;
    this.scoreText.setText(this.score);
    this.moveScreen();    
  }

  roundFail(){
    this.player.play('idle');
    this.failSound.play();
    this.tweens.add({
      targets: this.player,
      y: config.height + 300,
      onComplete: this.gameOver,
      callbackScope: this,
    });
    this.tweens.add({
      targets: this.bridges[1],
      angle: 180,
    });
  }

  moveScreen(){
    var distance = this.platforms[1][0].x - 16;

    for(var i=0;i<this.platforms[1].length/7;i++){
      this.tweens.add({
        targets: this.platforms[1].slice(i*7,(i*7)+7),
        x: 16+(32*i),
        duration: 1000,
      });
    }


    for(var i=0;i<this.platforms[2].length/7;i++){
      this.tweens.add({
        targets: this.platforms[2].slice(i*7,(i*7)+7),
        x: this.platforms[2][i*7].x - distance,
        duration: 1000,
      });
    }

    for(var i=0;i<this.platforms[0].length/7;i++){
      this.tweens.add({
        targets: this.platforms[0].slice(i*7,i*7+7),
        x: this.platforms[0][i*7].x - distance,
        duration: 1000,
      });
    }


    this.tweens.add({
      targets: this.bridges[0],
      x: this.bridges[0].x -distance,
      duration: 1000,
    });

    this.tweens.add({
      targets: this.bridges[1],
      x: this.bridges[1].x -distance,
      duration: 1000,
    });

    this.tweens.add({
      targets: this.player,
      x: this.player.x - distance,
      duration: 1000,
      onComplete: this.nextRound,
      callbackScope: this,
    });
  }

  nextRound(){
    for(var i=0;i<this.platforms[0].length;i++){
      this.platforms[0][i].destroy();
    }
    this.platforms[0] = this.platforms[1];
    this.platforms[1] = this.platforms[2];
    this.platforms[2] = this.randomPlatform(this.platforms[1][0].x);

    this.bridges[0].destroy();
    this.bridges[0] = this.bridges[1];
    this.bridges[1] = this.createBridge();

    this.inputFlag = true;
  }

  gameOver(){
    this.retryButton.visible = true;
  }

  update(time, delta) {
    if (this.extendFlag) {
      this.bridges[1].displayHeight += 1;
    }
  }
}
