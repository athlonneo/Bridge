//Tako Bridge Master Replica
//Nicholas Aditya Halim 2017730018

const config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  pixelArt: true,
  transparent: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [PreloadScene,HomeScene,PlayScene]
};

this.game = new Phaser.Game(config);
