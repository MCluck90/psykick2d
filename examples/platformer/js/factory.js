'use strict';

var World = require('psykick2d').World,
    Animation = require('psykick2d').Components.GFX.Animation,
    Sprite = require('psykick2d').Components.GFX.Sprite,
    TiledSprite = require('psykick2d').Components.GFX.TiledSprite;

var Factory = {
    /**
     * Creates the player entity
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
        player.addComponentAs(sprite, 'Rectangle');
        player.addComponentAs(sprite, 'RectPhysicsBody');
        player.addComponent(standAnimation);
        player.addComponentAs(standAnimation, 'StandAnimation');
        player.addComponentAs(walkAnimation, 'WalkAnimation');
        player.addComponentAs(attackAnimation, 'AttackAnimation');

        // Identify the player
        player.addComponentAs(true, 'Player');
        return player;
    },

    /**
     * Create a platform
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {Entity}
     */
    createPlatform: function(x, y, width, height) {
        var platform = World.createEntity(),
            sprite = new TiledSprite({
                frameName: 'grass',
                x: x,
                y: y,
                width: width,
                height: height
            });
        sprite.solid = true;
        sprite.immovable = true;
        sprite.friction = 30;

        platform.addComponentAs(sprite, 'Sprite');
        platform.addComponentAs(sprite, 'Rectangle');
        platform.addComponentAs(sprite, 'RectPhysicsBody');

        return platform;
    }
};

module.exports = Factory;