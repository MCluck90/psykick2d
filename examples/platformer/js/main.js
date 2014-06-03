'use strict';

var World = require('psykick2d').World,
    SpriteComponent = require('psykick2d').Components.GFX.Sprite,
    Rectangle = require('psykick2d').Components.Shapes.Rectangle,
    RenderRectSystem = require('psykick2d').Systems.Render.Rectangle,
    SpriteSystem = require('psykick2d').Systems.Render.Sprite,
    PlatformerSystem = require('psykick2d').Systems.Behavior.Physics.Platformer;

World.init({
    width: 800,
    height: 600,
    backgroundColor: '#000'
});

var layer = World.createLayer(),
    entity = World.createEntity(),
    floor = World.createEntity(),
    rectSystem = new RenderRectSystem(),
    spriteSystem = new SpriteSystem(),
    platformerSystem = new PlatformerSystem(),
    spriteComponent = new SpriteComponent({
        src: 'img/stand.png',
        x: 300,
        y: 200,
        width: 128,
        height: 64
    });
spriteComponent.mass = 1;
spriteComponent.velocity = {
    x: 0,
    y: 10
};
spriteComponent.solid = true;
entity.addComponent(spriteComponent);
entity.addComponentAs(spriteComponent, 'Rectangle');
entity.addComponentAs(spriteComponent, 'RectPhysicsBody');

var floorRect = new Rectangle({
    x: 0,
    y: 550,
    width: 800,
    height: 50,
    color: 0xFF0000
});
floorRect.solid = true;
floorRect.mass = 0;
floorRect.velocity = { x: 0, y: 0 };
floor.addComponent(floorRect);
floor.addComponentAs(floorRect, 'RectPhysicsBody');

rectSystem.addEntity(floor);
platformerSystem.addEntity(floor);

spriteSystem.addEntity(entity);
platformerSystem.addEntity(entity);

layer.addSystem(rectSystem);
layer.addSystem(spriteSystem);
layer.addSystem(platformerSystem);

World.pushLayer(layer);