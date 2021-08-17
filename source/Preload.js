class PreloadScene extends Phaser.Scene {

  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.image('bridge', 'assets/bridge.png');
    this.load.image ('background', 'assets/BG_01.png');
    this.load.image ('retry', 'assets/reload.png');
    
    this.load.spritesheet ('player', 'assets/UnityChan.png', {
      frameWidth: 64,
      frameHeight: 64
    });

    this.load.spritesheet ('block', 'assets/block.png', {
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.audio('bgm', ['assets/stage.wav']);
    this.load.audio('good', ['assets/start.wav']);
    this.load.audio('great', ['assets/get.wav']);
    this.load.audio('fail', ['assets/break.wav']);
  }

  create() {
    this.scene.start('HomeScene');
  }
}