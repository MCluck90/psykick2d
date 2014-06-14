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
    floor = Factory.createPlatform(-500, 550, 2000, 50),
    platform = Factory.createPlatform(500, 500, 200, 20),
    rectSystem = new RenderRectSystem(),
    animationSystem = new AnimationSystem(),
    spriteSystem = new SpriteSystem(),
    platformerSystem = new PlatformerSystem({
        x: -500,
        y: -500,
        width: 2000,
        height: 200,
        gravity: 30,
        friction: 30
    }),
    movementSystem = new PlayerMovement(player);

platformerSystem.addCollisionListener(function(a, b) {
    var p = (a.hasComponent('Player')) ? a :
            (b.hasComponent('Player')) ? b : null;
    if (!p) {
        return;
    }

    p.onGround = true;
});

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