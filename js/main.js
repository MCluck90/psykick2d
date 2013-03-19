(function() {
    "use strict";

    var world = new Psykick.World({
        canvasContainer: document.getElementById('canvas-container'),
        backgroundColor: "#000",
        width: 640,
        height: 480
    });

    var entity = world.createEntity();
    entity.addComponent(new Psykick.Components.SpriteSheet());
    entity.addComponent(new Psykick.Components.Animation());
    var layer = world.createLayer();
    layer.addEntity(entity);
    var system = new Psykick.Systems.Sprite();
    system.addEntity(entity);
    layer.addSystem(system);

    console.log(layer);

})();