'use strict';

var World = require('psykick2d').World,
    Animation = require('psykick2d').Components.GFX.Animation,
    Sprite = require('psykick2d').Components.GFX.Sprite,
    TiledSprite = require('psykick2d').Components.GFX.TiledSprite;

/**
 * Generates different kinds of entities
 */
var Factory = {
    /**
     * Creates the player
     * @param {number} x
     * @param {number} y
     * @returns {Entity}
     */
    createPlayer: function(x, y) {
        var player = World.createEntity(),
            sprite = new Sprite({
                frameName: 'player-stand',
                x: x,
                y: y,
                width: 122,
                height: 56
            }),
            standAnimation = new Animation({
                maxFrame: 0,
                frames: ['player-stand']
            }),
            walkAnimation = new Animation({
                fps: 8,
                maxFrame: 3,
                frames: [
                    'player-walk1',
                    'player-walk2',
                    'player-walk3',
                    'player-walk4'
                ]
            }),
            attackAnimation = new Animation({
                fps: 24,
                maxFrame: 1,
                frames: [
                    'player-attack1',
                    'player-attack2'
                ]
            });
        // Use the sprite as the physics body
        sprite.velocity = { x: 0, y: 0 };
        sprite.mass = 1;
        sprite.solid = true;
        sprite.friction = 1;

        player.addComponent(sprite);
        player.addComponentAs(sprite, 'RectPhysicsBody');
        player.addComponent(standAnimation);

        // Save the animations under different names so we can access them later
        player.addComponentAs(standAnimation, 'StandAnimation');
        player.addComponentAs(walkAnimation, 'WalkAnimation');
        player.addComponentAs(attackAnimation, 'AttackAnimation');

        // Tag it as a player
        player.addComponentAs(true, 'Player');
        return player;
    },

    /**
     * Create some grass
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {Entity}
     */
    createGrass: function(x, y, width, height) {
        var grass = World.createEntity(),
            sprite = new TiledSprite({
                frameName: 'grass',
                x: x,
                y: y,
                width: width,
                height: height
            });

        // Make sure it's treated as a platform
        sprite.solid = true;
        sprite.immovable = true;
        sprite.friction = 30;

        grass.addComponentAs(sprite, 'Sprite');
        grass.addComponentAs(sprite, 'RectPhysicsBody');

        return grass;
    },

    /**
     * Creates a block of steel
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {Entity}
     */
    createSteel: function(x, y, width, height) {
        var steel = World.createEntity(),
            sprite = new TiledSprite({
                frameName: 'steel',
                x: x,
                y: y,
                width: width,
                height: height
            });

        // Treat it as a platform
        sprite.solid = true;
        sprite.immovable = true;

        // Give it just a tiny bit of slide
        sprite.friction = 25;

        steel.addComponentAs(sprite, 'Sprite');
        steel.addComponentAs(sprite, 'RectPhysicsBody');

        return steel;
    },

    /**
     * Creates a platform with warning tape
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {Entity}
     */
    createTape: function(x, y, width, height) {
        var tape = World.createEntity(),
            sprite = new TiledSprite({
                frameName: 'tape',
                x: x,
                y: y,
                width: width,
                height: height
            });

        // Treat it as a platform
        sprite.solid = true;
        sprite.immovable = true;
        sprite.friction = 25;

        tape.addComponentAs(sprite, 'Sprite');
        tape.addComponentAs(sprite, 'RectPhysicsBody');

        return tape;
    },

    /**
     * Creates a concrete roll
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {Entity}
     */
    createRoll: function(x, y, width, height) {
        var roll = World.createEntity(),
            sprite = new TiledSprite({
                frameName: 'roll',
                x: x,
                y: y,
                width: width,
                height: height
            });

        // Make it a platform
        sprite.solid = true;
        sprite.immovable = true;
        sprite.friction = 20;

        roll.addComponentAs(sprite, 'Sprite');
        roll.addComponentAs(sprite, 'RectPhysicsBody');

        return roll;
    },

    /**
     * Creates a new enemy
     * @param {number} x
     * @param {number} y
     * @returns {Entity}
     */
    createEnemy: function(x, y) {
        var enemy = World.createEntity(),
            sprite = new Sprite({
                frameName: 'flyingEnemy',
                x: x,
                y: y,
                width: 91,
                height: 42
            });
        // Use velocity to move it
        sprite.velocity = { x: 0, y: 0 };

        enemy.addComponent(sprite);
        enemy.addComponentAs(sprite, 'RectPhysicsBody');

        // Tag it as a an enemy
        enemy.addComponentAs(true, 'Enemy');

        return enemy;
    },

    /**
     * Creates some flames
     * @param {number} x
     * @param {number} y
     * @returns {Entity}
     */
    createFlames: function(x, y) {
        // Start on a random frame so everything doesn't look synchronized
        var flameIndex = Math.floor(Math.random() * 4),
            flame = World.createEntity(),
            sprite = new Sprite({
                frameName: 'flames' + flameIndex,
                x: x,
                y: y,
                width: 32,
                height: 16
            }),
            animation = new Animation({
                fps: 12,
                maxFrame: 3,
                currentFrame: flameIndex,
                frames: [
                    'flames0',
                    'flames1',
                    'flames2',
                    'flames3'
                ]
            });

        // Make sure it doesn't fall and doesn't collide with anything
        sprite.mass = 0;
        sprite.solid = false;
        sprite.velocity = { x: 0, y: 0 };

        flame.addComponent(sprite);
        flame.addComponentAs(sprite, 'RectPhysicsBody');
        flame.addComponent(animation);
        return flame;
    }
};

module.exports = Factory;