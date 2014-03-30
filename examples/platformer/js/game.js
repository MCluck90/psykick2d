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
        w: 200,
        h: 400
    }));
    box.addComponent(new P2D.Components.GFX.Color({
        colors: ['#F00']
    }));
    drawSystem.addEntity(box);
    layer.addSystem(drawSystem);

    var inputSystem = new Game.Systems.PlayerInput();
    inputSystem.addEntity(box);
    layer.addSystem(inputSystem);

})(Psykick2D);