(function() {

    var world = new Psykick.World({
            canvasContainer: document.getElementById('canvas-container'),
            width: 800,
            height: 600
        });

    var rectComponent = new Psykick.Components.Rectangle({
            x: 80,
            y: 20,
            w: 100,
            h: 100
        }),
        colorComponent = new Psykick.Components.Color({
            colors: ["#FFF"]
        }),
        entity = world.createEntity(),
        layer = world.createLayer(),
        drawSystem = new Game.Systems.DrawRect();

    entity.addComponent(rectComponent);
    entity.addComponent(colorComponent);
    drawSystem.addEntity(entity);
    layer.addSystem(drawSystem);
    layer.addEntity(entity);
    world.pushLayer(layer);

    var moveSys = new Game.Systems.MoveInvaders();
    moveSys.addEntity(entity);
    layer.addSystem(moveSys);

})();