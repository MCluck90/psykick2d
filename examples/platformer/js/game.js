(function(P2D) {
    P2D.World.init({
        canvasContainer: 'game',
        width: 800,
        height: 600,
        backgroundColor: '#FFF'
    });

    var layer = P2D.World.createLayer(),
        box = P2D.World.createEntity(),
        drawSystem = new P2D.Systems.Render.ColoredRect();

    P2D.World.pushLayer(layer);
    box.addComponent(new P2D.Components.Shape.Rectangle({
        x: 100,
        y: 10,
        w: 64,
        h: 128
    }));
    box.addComponent(new P2D.Components.GFX.Color({
        colors: ['#F00']
    }));
    var playerBody = new P2D.Components.Physics.RectPhysicsBody({
        x: 100,
        y: 10,
        w: 64,
        h: 128,
        mass: 3
    });
    box.addComponent(playerBody);
    drawSystem.addEntity(box);
    layer.addSystem(drawSystem);

    var playerCam = new Game.PlayerCam(playerBody);
    layer.camera = playerCam;

    var inputSystem = new Game.Systems.PlayerInput();
    inputSystem.addEntity(box);
    layer.addSystem(inputSystem);

    var physicsSystem = new P2D.Systems.Behavior.Physics.Platformer();
    physicsSystem.addEntity(box);
    layer.addSystem(physicsSystem);

    var syncSystem = new Game.Systems.SyncRect();
    syncSystem.addEntity(box);
    layer.addSystem(syncSystem);

    for (var x = 310; x < 720; x += 50) {
        var floorPiece = P2D.World.createEntity();
        floorPiece.addComponent(new P2D.Components.Shape.Rectangle({
            x: x,
            y: 860 - x,
            w: 100,
            h: 50
        }));
        floorPiece.addComponent(new P2D.Components.GFX.Color({
            colors: ['#0F0']
        }));
        floorPiece.addComponent(new P2D.Components.Physics.RectPhysicsBody({
            x: x,
            y: 860 - x,
            w: 100,
            h: 50
        }));
        drawSystem.addEntity(floorPiece);
        physicsSystem.addEntity(floorPiece);
        syncSystem.addEntity(floorPiece);
    }

    var platform = P2D.World.createEntity(),
        platformOptions = {
            x: 140,
            y: 150,
            w: 300,
            h: 80
        };
    platform.addComponent(new P2D.Components.GFX.Color({
        colors: ['#0F0']
    }));
    platform.addComponent(new P2D.Components.Shape.Rectangle(platformOptions));
    platform.addComponent(new P2D.Components.Physics.RectPhysicsBody(platformOptions));
    drawSystem.addEntity(platform);
    physicsSystem.addEntity(platform);
    syncSystem.addEntity(platform);

    var baseFloor = P2D.World.createEntity(),
        floorOptions = {
            x: -10000,
            y: 600,
            w: 20000,
            h: 800
        };
    baseFloor.addComponent(new P2D.Components.Physics.RectPhysicsBody(floorOptions));
    baseFloor.addComponent(new P2D.Components.Shape.Rectangle(floorOptions));
    baseFloor.addComponent(new P2D.Components.GFX.Color({
        colors: ['#0F0']
    }));
    drawSystem.addEntity(baseFloor);
    physicsSystem.addEntity(baseFloor);
})(Psykick2D);