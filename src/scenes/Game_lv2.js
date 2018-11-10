import { format } from "path";

let x;
let y;
let width;
let height;
let platforms;
let player;
let gameover = false;
let cursors;

let player1;
let player2;

let door;
let diamond1;
let diamond2;
let diamond3;
let doorCheck = false;

class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'Game_lv2'
        });
    }

    preload() {
        this.load.image('bg', '../../images/map/bg.jpg');
        this.load.image('ground', '../../images/map/ground.png');
        this.load.image('sao', '../../images/map/sao.png');
        this.load.image('short_path', '../../images/map/short_path.png');
        this.load.image('fire', '../../images/map/fire.png');
        this.load.image('long_path', '../../images/map/long_path.png');
        this.load.image('lamp_on', '../../images/map/lamp_on.png');
        this.load.image('lamp_off', '../../images/map/lamp_off.png');

        this.load.spritesheet('door', '../../images/door/door_complete.png', { frameWidth: 99, frameHeight: 124 });

        this.load.image('diamond', '../../images/items/diamond.png');
        this.load.image('diamond1', '../../images/items/diamond.png');
        this.load.image('diamond2', '../../images/items/diamond.png');
        this.load.image('diamond3', '../../images/items/diamond.png');

        this.load.image('fire', '../../images/map/fire.png');
        this.load.image('shadow', '../../images/map2_only/shadow.png');
        this.load.image('fog', '../../images/map2_only/fog.png');
        this.load.image('switch', '../../images/map2_only/switch.png');
        this.load.image('updown', '../../images/map2_only/updown.png');

        this.load.spritesheet('yang', '../../images/yang/ya1.png', { frameWidth: 85, frameHeight: 113 }); //white
        this.load.spritesheet('ying', '../../images/ying/yi3.png', { frameWidth: 80, frameHeight: 90 }); //black


    }

    create() {
        let width = this.scene.scene.physics.world.bounds.width;
        let height = this.scene.scene.physics.world.bounds.height;
        let x = width * 0.5;
        let y = height * 0.5;

        this.add.image(x, y, 'bg');
        width = this.scene.scene.physics.world.bounds.width;
        height = this.scene.scene.physics.world.bounds.height;
        x = width * 0.5;
        y = height * 0.5;

        this.add.image(x, y, 'bg');

        let platforms = this.physics.add.staticGroup();

        platforms.create(10, 570, 'ground');
        platforms.create(400, 570, 'ground');

        platforms.create(x, 400, 'long_path');
        platforms.create(x, 200, 'long_path');

        platforms.create(x, 240, 'lamp_off');
        // this.add.image(x, y, 'fog');
        this.add.image(x, y, 'shadow');

        platforms.create(100, 100, 'long_path');        
        platforms.create(750, 350, 'short_path');
        platforms.create(750, 335, 'switch');

        platforms.create(x, 500, 'fire');

        platforms.create(100, 400, 'updown');

        door = this.add.sprite(750, 485, 'door');

        player1 = this.physics.add.image(50, 500, 'yang').setScale(0.5); //white
        player2 = this.physics.add.image(100, 500, 'ying').setScale(0.5); //black

        player1.setBounce(0.2);
        player1.setCollideWorldBounds(true);

        player2.setBounce(0.2);
        player2.setCollideWorldBounds(true);



        this.physics.add.collider(player1, platforms);
        this.physics.add.collider(player2, platforms);

        cursors = this.input.keyboard.createCursorKeys();

        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        //diamond1
        diamond1 = this.physics.add.group();
        this.physics.add.collider(diamond1, platforms);
        this.physics.add.collider(player1, diamond1);

        diamond1 = this.physics.add.group({
            key: 'diamond1',
            repeat: 1,
            setXY: { x: 12, y: 50, stepX: 680, stepY: 50 }

        });

        diamond1.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));
        });

        this.physics.add.collider(diamond1, platforms);
        this.physics.add.overlap(player1, diamond1, this.collectDiamond);
        this.physics.add.overlap(player1, player2, this.nextLevel);

        //diamond2
        diamond2 = this.physics.add.group();
        this.physics.add.collider(diamond2, platforms);
        this.physics.add.collider(player2, diamond1);

        diamond2 = this.physics.add.group({
            key: 'diamond2',
            repeat: 0,
            setXY: { x: 700, y: 500, stepX: 0 }

        });      

        diamond2.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));
            child.disableBody(true, true)
        });

        //diamond3
        diamond3 = this.physics.add.group();
        this.physics.add.collider(diamond3, platforms);
        this.physics.add.collider(player1, diamond2);

        diamond3 = this.physics.add.group({
            key: 'diamond3',
            repeat: 0,
            setXY: { x: 0, y: 600, stepX: 800 }

        });

        diamond3.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));
            child.disableBody(true, true)
        });


        this.physics.add.collider(diamond3, platforms);
        this.physics.add.overlap(player1, diamond2, this.collectDiamond);

        //door anime
        this.anims.create({
            key: 'doors',
            frames: this.anims.generateFrameNumbers('door', { start: 0, end: 4 }),
            frameRate: 10
        });

        /*this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('yang', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });*/

        /* this.anims.create({
            key: 'turn',
            frames: [{ key: 'beaver', frame: 4 }],
            frameRate: 20
        }); */

        /*this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player1', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        //anime yang
        this.anims.create({
            key: 'keyA',
            frames: this.anims.generateFrameNumbers('player2', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        /* this.anims.create({
            key: 'turn',
            frames: [{ key: 'beaver', frame: 4 }],
            frameRate: 20
        }); */

        /* this.anims.create({
             key: 'keyD',
             frames: this.anims.generateFrameNumbers('player2', { start: 0, end: 2 }),
             frameRate: 10,
             repeat: -1
         });*/


    }

    update() {
        if (cursors.left.isDown) {
            player1.setVelocityX(-160);
            //player1.anims.play('left', true);
        } else if (cursors.right.isDown) {
            player1.setVelocityX(160);
            //player1.anims.play('right', true);

        } else {
            player1.setVelocityX(0);

        }
        if (cursors.up.isDown && player1.body.onFloor()) {
            player1.setVelocityY(-330);
        }


        //control ying
        if (this.keyA.isDown) {
            player2.setVelocityX(-160);
            //player2.anims.play('keyA', true);

        } else if (this.keyD.isDown) {
            player2.setVelocityX(160);
            //player2.anims.play('keyD', true);

        } else {
            player2.setVelocityX(0);
        }
        if (this.keyW.isDown && player2.body.onFloor()) {
            player2.setVelocityY(-330);
        }
        if (doorCheck === true) {
            this.scene.start('Game_lv3');
        }

        if (gameover == true) {
            this.physics.pause();
        }

    }
    collectDiamond(player1, diamondtmep) {
        diamondtmep.disableBody(true, true);
        //diamond2.disableBody(true, true);

        if (diamond1.countActive(true) === 0) {
            door.anims.play('doors', true);
            this.nextLevel;
        }
    }
    nextLevel(player1, player2, door) {
        if (diamond1.countActive(true) === 0) {
            doorCheck = true;
        }
    }
    hitFire(player1, player2, fire) {
        gameover = true;
    }
    slideSwitch(pointer, x, y){
        // if (){
        //     for(y = 0; y < 1; y++){

        //     }
        // }
    }

}

export default GameScene;