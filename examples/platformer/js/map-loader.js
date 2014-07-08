'use strict';

var World = require('psykick2d').World,
    AnimationSystem = require('psykick2d').Systems.Behavior.Animate,
    SpriteSystem = require('psykick2d').Systems.Render.Sprite,
    PlatformerSystem = require('psykick2d').Systems.Behavior.Physics.Platformer,
    Rectangle = require('psykick2d').Components.Shapes.Rectangle,

    Factory = require('./factory.js'),
    PlayerCam = require('./player-cam.js'),
    PlayerMovement = require('./player-movement.js'),
    Enemy = require('./enemy.js'),
    CONSTANTS = require('./constants.js');

/**
 * Used for loading maps
 */
var MapLoader = {
    /**
     * Loads a map. See ../maps for map data
     * @param {object} mapData
     */
    load: function(mapData) {
        // Remove all previous layers
        var layer = World.popLayer();
        while (layer) {
            layer = World.popLayer();
        }

        // Initialize the layer and systems
        var mainLayer = World.createLayer(),
            animationSystem = new AnimationSystem(),
            spriteSystem = new SpriteSystem(),
            platformerSystem = new PlatformerSystem({
                x: 0,
                y: 0,
                width: CONSTANTS.WORLD_WIDTH,
                height: CONSTANTS.WORLD_HEIGHT,
                gravity: 30
            }),
            enemySystem,
            movementSystem;

        // Create a wall on the left side of the map to prevent the player
        // from walking off the edge of the world
        var leftWall = World.createEntity(),
            leftWallRect = new Rectangle({
                x: 0,
                y: 0,
                width: 1,
                height: CONSTANTS.WORLD_HEIGHT
            });
        leftWallRect.solid = true;
        leftWallRect.immovable = true;
        leftWallRect.friction = 1;
        leftWall.addComponent(leftWallRect);
        leftWall.addComponentAs(leftWallRect, 'RectPhysicsBody');
        platformerSystem.addEntity(leftWall);

        // Create different types of entities
        var entityData,
            entity,
            player;
        for (var entityType in mapData) {
            var entityCollection = mapData[entityType],
                createEntity;

            // If we're making the player
            if (entityType === 'player') {
                entity = Factory.createPlayer(entityCollection.x, entityCollection.y);
                player = entity;

                // Initialize the camera, player, and enemy systems
                mainLayer.camera = new PlayerCam(entity);
                movementSystem = new PlayerMovement(entity, mainLayer);
                enemySystem = new Enemy(entity, mainLayer);

                // Tell the movement system to handle when the player collides with an enemy
                enemySystem.onPlayerCollision = movementSystem.onEnemyCollision.bind(movementSystem);

                // Add the player to all of the systems it belongs to
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

                case 'enemy':
                    createEntity = Factory.createEnemy;
                    break;

                default:
                    throw new Error('Unknown entity type "' + entityType + '"');
            }

            // For each entity in the collection
            for (var i = 0, len = entityCollection.length; i < len; i++) {
                // Generate the new entity
                entityData = entityCollection[i];
                entity = createEntity(entityData.x, entityData.y, entityData.width, entityData.height);

                // Add it to the correct systems
                spriteSystem.addEntity(entity);
                if (entity.hasComponent('Enemy')) {
                    enemySystem.addEntity(entity);
                } else {
                    platformerSystem.addEntity(entity);
                }
                // Don't bother adding to animation since enemies and platforms
                // don't use animation
            }
        }

        // Move the player to the top of the drawing system
        spriteSystem.removeEntity(player);
        spriteSystem.addEntity(player);

        // Add all of the systems to the layer
        mainLayer.addSystem(movementSystem);
        mainLayer.addSystem(enemySystem);
        mainLayer.addSystem(animationSystem);
        mainLayer.addSystem(spriteSystem);
        mainLayer.addSystem(platformerSystem);

        // Put the layer on the top of the update/draw stack
        World.pushLayer(mainLayer);
    }
};

module.exports = MapLoader;