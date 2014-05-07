(function(P2D) {
    throw new Error('This example has not been updated to match the API change. Revert to 0.3.* to play');

    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild( stats.domElement );

    P2D.World.init({
        canvasContainer: 'game',
        width: 800,
        height: 600,
        backgroundColor: '#FFF'
    });

    var oldUpdate = P2D.World.update,
        oldDraw = P2D.World.draw;
    P2D.World.update = function(delta) {
        stats.begin();
        oldUpdate.call(P2D.World, delta);
    };
    P2D.World.draw = function() {
        oldDraw.call(P2D.World);
        stats.end();
    };

    var layer = P2D.World.createLayer(),
        drawSystem = new P2D.Systems.Render.Rectangle(),
        inputSystem = new Game.Systems.PlayerInput(),
        physicsSystem = new P2D.Systems.Behavior.Physics.Platformer({ cellSize: 100 }),
        spriteSystem = new P2D.Systems.Render.Sprite(),
        player = Game.Factory.createPlayer(),
        playerBody = player.getComponent('RectPhysicsBody');

    layer.camera = new Game.PlayerCam(playerBody);
    layer.addSystem(drawSystem);
    layer.addSystem(inputSystem);
    layer.addSystem(physicsSystem);
    layer.addSystem(spriteSystem);
    P2D.World.pushLayer(layer);

    drawSystem.addEntity(player);
    inputSystem.addEntity(player);
    physicsSystem.addEntity(player);

    var grassEntity = P2D.World.createEntity();
    grassEntity.addComponent(new P2D.Components.GFX.Sprite({
        src: 'media/sprites/ground.png',
        position: {
            x: 0,
            y: 0
        }
    }));

    physicsSystem.addCollisionHandler(player, function(other) {
        var otherBody = other.getComponent('RectPhysicsBody');
        if (otherBody.y + 1 >= playerBody.y + playerBody.h) {
            playerBody.inContact = true;
        }
    });

    for (var i = 0; i < 5; i++) {
        var x = 530 + i * 93,
            y = 528 - i * 70,
            leftSide = Game.Factory.createGrassSide(x, y, true),
            mainPlatform = Game.Factory.createGrass(x + 34, y, 60, 70),
            dirt = Game.Factory.createDirt(x, y + 67, 95, 535 - y);
        physicsSystem.addEntity(leftSide);
        physicsSystem.addEntity(mainPlatform);
        spriteSystem.addEntity(leftSide);
        spriteSystem.addEntity(mainPlatform);
        spriteSystem.addEntity(dirt);
    }

    var grass = Game.Factory.createGrass(100, 100, 2000);
    physicsSystem.addEntity(grass);
    spriteSystem.addEntity(grass);

    var grassLeft = Game.Factory.createGrassSide(141, 275, true);
    physicsSystem.addEntity(grassLeft);
    spriteSystem.addEntity(grassLeft);

    var grassPlatform = Game.Factory.createGrass(175, 275, 265);
    physicsSystem.addEntity(grassPlatform);
    spriteSystem.addEntity(grassPlatform);

    var grassRight = Game.Factory.createGrassSide(438, 275, false);
    physicsSystem.addEntity(grassRight);
    spriteSystem.addEntity(grassRight);
})(Psykick2D);