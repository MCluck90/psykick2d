'use strict';

var World = require('psykick2d').World,
    Rectangle = require('psykick2d').Components.Shapes.Rectangle,
    RenderRectSystem = require('psykick2d').Systems.Render.Rectangle,
    AnimationSystem = require('psykick2d').Systems.Behavior.Animate,
    SpriteSystem = require('psykick2d').Systems.Render.Sprite,
    PlatformerSystem = require('psykick2d').Systems.Behavior.Physics.Platformer,

    Factory = require('./factory.js'),
    PlayerMovement = require('./player-movement.js');

World.init({
    width: 800,
    height: 600,
    backgroundColor: '#000',
    preload: {
        spriteSheets: ['sprites/player.json']
    }
});

var layer = World.createLayer(),
    player = Factory.createPlayer(),
    floor = World.createEntity(),
    platform = World.createEntity(),
    rectSystem = new RenderRectSystem(),
    animationSystem = new AnimationSystem(),
    spriteSystem = new SpriteSystem(),
    platformerSystem = new PlatformerSystem({
        x: -500,
        y: -500,
        width: 2000,
        height: 200
    }),
    movementSystem = new PlayerMovement(player);

var floorRect = new Rectangle({
    x: -500,
    y: 550,
    width: 2000,
    height: 50,
    color: 0xFF0000
});
floorRect.solid = true;
floorRect.immovable = true;
floor.addComponent(floorRect);
floor.addComponentAs(floorRect, 'RectPhysicsBody');

var platformRect = new Rectangle({
    x: 300,
    y: 500,
    width: 400,
    height: 50,
    color: 0x00FF00
});
platformRect.solid = true;
platformRect.immovable = true;
platform.addComponent(platformRect);
platform.addComponentAs(platformRect, 'RectPhysicsBody');

rectSystem.addEntity(floor);
rectSystem.addEntity(platform);
platformerSystem.addEntity(floor);
platformerSystem.addEntity(platform);

movementSystem.addEntity(player);
spriteSystem.addEntity(player);
platformerSystem.addEntity(player);
animationSystem.addEntity(player);

layer.addSystem(animationSystem);
layer.addSystem(platformerSystem);
layer.addSystem(movementSystem);
layer.addSystem(rectSystem);
layer.addSystem(spriteSystem);

World.pushLayer(layer);