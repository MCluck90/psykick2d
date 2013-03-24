(function() {

    var world = new Psykick.World({
            canvasContainer: document.getElementById('canvas-container'),
            width: 800,
            height: 600,
            onUpdate: function(delta) {
                var invaders = layer.getEntities();
                for (var id in invaders) {
                    var invader = invaders[id],
                        rect = invader.getComponent("Rectangle");

                    if (rect.y + rect.h > 300) {
                        world.removeEntity(invader);
                    }
                }
            }
        });

    var layer = world.createLayer(),
        drawSys = new Game.Systems.DrawRect(),
        moveSys = new Game.Systems.MoveInvaders();

    layer.addSystem(drawSys);
    layer.addSystem(moveSys);

    // Generate "invaders"
    for (var i = 0; i < 11; i++) {
        for (var j = 0; j < 6; j++) {
            var color = (j % 3 === 0) ? "#F00" :
                        (j % 3 === 1) ? "#0F0" : "#00F",
                entity = world.createEntity(),
                rect = new Psykick.Components.Rectangle({
                    x: 80 + (40 * i),
                    y: 20 + (36 * j),
                    w: 30,
                    h: 30
                }),
                color = new Psykick.Components.Color({
                    colors: [color]
                });

            entity.addComponent(rect);
            entity.addComponent(color);
            drawSys.addEntity(entity);
            moveSys.addEntity(entity);
            layer.addEntity(entity);
        }
    }

    console.log(layer);

    world.pushLayer(layer);

})();