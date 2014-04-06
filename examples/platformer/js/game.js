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
        y: 100,
        w: 64,
        h: 128
    }));
    box.addComponent(new P2D.Components.GFX.Color({
        colors: ['#F00']
    }));
    box.addComponent(new Game.Components.Physics({
        x: 100,
        y: 100,
        w: 64,
        h: 128,
        mass: 1
    }));
    drawSystem.addEntity(box);
    layer.addSystem(drawSystem);

    var inputSystem = new Game.Systems.PlayerInput();
    inputSystem.addEntity(box);
    layer.addSystem(inputSystem);

    var physicsSystem = new Game.Systems.Physics();
    physicsSystem.addEntity(box);
    layer.addSystem(physicsSystem);

    var box2 = P2D.World.createEntity();
    box2.addComponent(new P2D.Components.Shape.Rectangle({
        x: 290,
        y: 400,
        w: 128,
        h: 128
    }));
    box2.addComponent(new P2D.Components.GFX.Color({
        colors: ['#0F0']
    }));
    box2.addComponent(new Game.Components.Physics({
        x: 290,
        y: 400,
        w: 128,
        h: 128,
        mass: 0
    }));
    drawSystem.addEntity(box2);
    physicsSystem.addEntity(box2);

    box2 = P2D.World.createEntity();
    box2.addComponent(new P2D.Components.Shape.Rectangle({
        x: 600,
        y: 50,
        w: 50,
        h: 50
    }));
    box2.addComponent(new P2D.Components.GFX.Color({
        colors: ['#00F']
    }));
    box2.addComponent(new Game.Components.Physics({
        x: 600,
        y: 50,
        w: 50,
        h: 50,
        mass: 0.5,
        bounciness: 0.5
    }));
    drawSystem.addEntity(box2);
    physicsSystem.addEntity(box2);
})(Psykick2D);