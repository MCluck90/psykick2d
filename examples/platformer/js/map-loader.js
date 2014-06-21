'use strict';

var World = require('psykick2d').World,
    AnimationSystem = require('psykick2d').Systems.Behavior.Animate,
    SpriteSystem = require('psykick2d').Systems.Render.Sprite,
    PlatformerSystem = require('psykick2d').Systems.Behavior.Physics.Platformer,
    Rectangle = require('psykick2d').Components.Shapes.Rectangle,

    Factory = require('./factory.js'),
    PlayerCam = require('./player-cam.js'),
    PlayerMovement = require('./player-movement.js'),

    WIDTH = 10000,
    HEIGHT = 10000;

var MapLoader = {
    load: function(mapData) {
        // Remove all previous layers
        var layer = World.popLayer();
        while (layer) {
            layer = World.popLayer();
        }

        var mainLayer = World.createLayer(),
            animationSystem = new AnimationSystem(),
            spriteSystem = new SpriteSystem(),
            platformerSystem = new PlatformerSystem({
                x: 0,
                y: 0,
                width: WIDTH,
                height: HEIGHT,
                gravity: 30
            }),
            movementSystem;

        platformerSystem.addCollisionListener(function(a, b) {
            var player = (a.hasComponent('Player')) ? a :
                (b.hasComponent('Player')) ? b : null;
            if (!player) {
                return;
            }

            player.onGround = true;
        });

        // Create a wall on the left side of the map to prevent the player
        // from walking off the edge of the world
        var leftWall = World.createEntity(),
            leftWallRect = new Rectangle({
                x: 0,
                y: 0,
                width: 1,
                height: HEIGHT
            });
        leftWallRect.solid = true;
        leftWallRect.immovable = true;
        leftWallRect.friction = 1;
        leftWall.addComponent(leftWallRect);
        leftWall.addComponentAs(leftWallRect, 'RectPhysicsBody');
        platformerSystem.addEntity(leftWall);

        var entityData,
            entity,
            player;
        for (var entityType in mapData) {
            var entityCollection = mapData[entityType],
                createEntity;
            if (entityType === 'player') {
                entity = Factory.createPlayer(entityCollection.x, entityCollection.y);
                player = entity;
                mainLayer.camera = new PlayerCam(entity, 800, 600);
                movementSystem = new PlayerMovement(entity);

                movementSystem.addEntity(entity);
                spriteSystem.addEntity(entity);
                platformerSystem.addEntity(entity);
                animationSystem.addEntity(entity);
                continue;
            }

            switch (entityType) {
                case 'grass':
                    createEntity = Factory.createGrass;
                    break;

                case 'steel':
                    createEntity = Factory.createSteel;
                    break;

                case 'tape':
                    createEntity = Factory.createTape;
                    break;

                case 'roll':
                    createEntity = Factory.createRoll;
                    break;

                default:
                    throw new Error('Unknown entity type "' + entityType + '"');
            }

            for (var i = 0, len = entityCollection.length; i < len; i++) {
                entityData = entityCollection[i];
                entity = createEntity(entityData.x, entityData.y, entityData.width, entityData.height);
                spriteSystem.addEntity(entity);
                platformerSystem.addEntity(entity);
            }
        }

        // Move the player to the top of the drawing system
        spriteSystem.removeEntity(player);
        spriteSystem.addEntity(player);

        mainLayer.addSystem(movementSystem);
        mainLayer.addSystem(animationSystem);
        mainLayer.addSystem(spriteSystem);
        mainLayer.addSystem(platformerSystem);

        World.pushLayer(mainLayer);
    }
};

module.exports = MapLoader;