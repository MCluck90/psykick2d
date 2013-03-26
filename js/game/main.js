(function() {

    var world = new Psykick.World({
            canvasContainer: document.getElementById('canvas-container'),
            width: 800,
            height: 600,
            onUpdate: function(delta) { }
        });

    var layer = world.createLayer(),
        drawSys = new Game.Systems.DrawRect(),
        moveSys = new Game.Systems.MoveInvaders(),
        playerMoveSys = new Game.Systems.PlayerMovement(),
        playerShootingSys = new Game.Systems.PlayerShooting(),
        playerEntity = new world.createEntity();

    playerEntity.addComponent(new Psykick.Components.Rectangle({
        x: 370,
        y: 550,
        w: 60,
        h: 30
    }));
    playerEntity.addComponent(new Psykick.Components.Color({
        colors: ["#0F0"]
    }));
    playerEntity.addComponent(new Game.Components.Player());

    drawSys.addEntity(playerEntity);
    playerMoveSys.addEntity(playerEntity);
    playerShootingSys.addEntity(playerEntity);

    layer.addEntity(playerEntity);
    layer.addSystem(drawSys);
    layer.addSystem(moveSys);
    layer.addSystem(playerMoveSys);
    layer.addSystem(playerShootingSys);
    layer.addSystem(new Game.Systems.MoveBullet());

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
                }),
                invader = new Game.Components.Invader();

            entity.addComponent(rect);
            entity.addComponent(color);
            entity.addComponent(invader);
            drawSys.addEntity(entity);
            moveSys.addEntity(entity);
            layer.addEntity(entity);
        }
    }

    moveSys.Active = false;
    world.pushLayer(layer);

})();