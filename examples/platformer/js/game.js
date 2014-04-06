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
    box.addComponent(new Game.Components.PhysicsBody({
        x: 100,
        y: 10,
        w: 64,
        h: 128,
        mass: 3
    }));
    drawSystem.addEntity(box);
    layer.addSystem(drawSystem);

    var inputSystem = new Game.Systems.PlayerInput();
    inputSystem.addEntity(box);
    layer.addSystem(inputSystem);

    var physicsSystem = new Game.Systems.Physics();
    physicsSystem.addEntity(box);
    layer.addSystem(physicsSystem);

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
        floorPiece.addComponent(new Game.Components.PhysicsBody({
            x: x,
            y: 860 - x,
            w: 100,
            h: 50
        }));
        drawSystem.addEntity(floorPiece);
        physicsSystem.addEntity(floorPiece);
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
    platform.addComponent(new Game.Components.PhysicsBody(platformOptions));
    drawSystem.addEntity(platform);
    physicsSystem.addEntity(platform);
})(Psykick2D);