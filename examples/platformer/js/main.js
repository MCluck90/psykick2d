'use strict';

var World = require('psykick2d').World,
    SpriteComponent = require('psykick2d').Components.GFX.Sprite,
    SpriteSystem = require('psykick2d').Systems.Render.Sprite;

World.init({
    width: 800,
    height: 600,
    backgroundColor: '#000'
});

var layer = World.createLayer(),
    entity = World.createEntity(),
    spriteSystem = new SpriteSystem();
entity.addComponent(new SpriteComponent({
    src: 'img/stand.png',
    x: 300,
    y: 200,
    width: 128,
    height: 64
}));

spriteSystem.addEntity(entity);

layer.addSystem(spriteSystem);

World.pushLayer(layer);