'use strict';

var World = require('psykick2d').World,
    Helper = require('psykick2d').Helper,
    BehaviorSystem = require('psykick2d').BehaviorSystem,
    QuadTree = require('psykick2d').DataStructures.QuadTree,
    RectPhysicsBody = require('psykick2d').Components.Physics.RectPhysicsBody,
    Factory = require('./factory.js'),
    CONSTANTS = require('./constants.js');

/**
 * Initializes and controls enemy behavior
 * @param {Entity} player   The player entity, used for launching enemies
 * @param {Layer}  layer    Layer that the enemies exist on
 * @constructor
 */
var Enemy = function(player, layer) {
    BehaviorSystem.call(this);
    this.requiredComponents = ['Enemy', 'RectPhysicsBody', 'Sprite'];

    // Save a reference to the player and body (we'll use both layer)
    this.player = player;
    this.playerRect = player.getComponent('RectPhysicsBody');

    // Need this for updating position in collision structure (see `update`)
    this.prevPlayerPosition = {
        x: this.playerRect.x,
        y: this.playerRect.y
    };
    this.mainLayer = layer;

    // Used to know when to activate enemies
    this.collisionStructure = new QuadTree({
        x: 0,
        y: 0,
        width: CONSTANTS.WORLD_WIDTH,
        height: CONSTANTS.WORLD_HEIGHT,
        componentType: 'RectPhysicsBody'
    });
    this.collisionStructure.addEntity(player);

    // Used to detect when an enemy is within range
    this.activeRegion = World.createEntity();
    this.regionRect = new RectPhysicsBody({
        x: 0,
        y: 0,
        width: CONSTANTS.SCREEN_WIDTH + CONSTANTS.ENEMY.REGION_MARGIN * 2,
        height: CONSTANTS.SCREEN_HEIGHT * 2
    });
    this.activeRegion.addComponent(this.regionRect);
    this.collisionStructure.addEntity(this.activeRegion);

    // Use this to separate the active enemies from the ones that are still inactive
    this.inactiveEnemies = [];
    this.activeEnemies = [];

    // Contains the flames for each enemy
    this._flames = {};
};

Helper.inherit(Enemy, BehaviorSystem);

/**
 * Adds a new enemy to the system
 * @param {Entity} entity
 * @returns {boolean}   True if the entity was added
 */
Enemy.prototype.addEntity = function(entity) {
    // Prevent accidentally putting in the same enemy twice
    if (this.entities[entity.id] === entity) {
        return true;
    }

    // If the entity has the required components
    if (BehaviorSystem.prototype.addEntity.call(this, entity)) {
        // Don't set it in motion just yet
        this.inactiveEnemies.push(entity);
        this.collisionStructure.addEntity(entity);

        // Create some flames and line it up with the jet in the back
        var body = entity.getComponent('RectPhysicsBody'),
            flames = Factory.createFlames(body.x, body.y),
            flameSprite = flames.getComponent('Sprite');
        flameSprite.x += body.width;
        flameSprite.y += flameSprite.height / 2;

        // Stash the flames so we can remove them when the enemy dies
        this._flames[entity.id] = flames;
        return true;
    }

    return false;
};

/**
 * Removes an enemy from the system
 * @param {Entity|number} entity    The enemy or it's ID
 * @returns {boolean}
 */
Enemy.prototype.removeEntity = function(entity) {
    if (typeof entity === 'number') {
        entity = this.entities[entity];
    }

    // If it was removed
    if (BehaviorSystem.prototype.removeEntity.call(this, entity)) {
        // Make sure it's not queued up for activation
        var index = this.inactiveEnemies.indexOf(entity);
        if (index !== -1) {
            this.inactiveEnemies.splice(index, 1);
        }

        // And remove it from the activated set
        index = this.activeEnemies.indexOf(entity);
        if (index !== -1) {
            this.activeEnemies.splice(index, 1);
        }
        this.collisionStructure.removeEntity(entity);

        // Remove the flames from the drawing system
        this.mainLayer.removeEntity(this._flames[entity.id]);
        delete this._flames[entity.id];
        return true;
    }

    return false;
};

/**
 * Activates new enemies can checks for collisions with activated enemies
 */
Enemy.prototype.update = function() {
    // Move the player back to it's previous known position
    // We have to do this because the player exists in two different collision structures
    var newPosition = {
        x: this.playerRect.x,
        y: this.playerRect.y
    };
    this.playerRect.x = this.prevPlayerPosition.x;
    this.playerRect.y = this.prevPlayerPosition.y;

    // Why not just share the structure? Because the Platformer system won't tell us about
    // collisions with non-solids. Enemies aren't solid (can pass through stuff)
    this.collisionStructure.moveEntity(this.player, {
        x: newPosition.x - this.playerRect.x,
        y: newPosition.y - this.playerRect.y
    });
    this.prevPlayerPosition = {
        x: this.playerRect.x,
        y: this.playerRect.y
    };

    // Move a special region which we use to check for when enemies can activate
    var playerCenter = {
        x: this.playerRect.x + this.playerRect.width / 2,
        y: this.playerRect.y + this.playerRect.height / 2
    };
    this.collisionStructure.moveEntity(this.activeRegion, {
        x: (playerCenter.x - CONSTANTS.SCREEN_WIDTH / 2 - CONSTANTS.ENEMY.REGION_MARGIN) - this.regionRect.x,
        y: (playerCenter.y - CONSTANTS.SCREEN_HEIGHT) - this.regionRect.y
    });

    // Copy the enemies collection so we can safely modify the real list
    var inactiveEnemies = this.inactiveEnemies.slice(0),
        collisions = [],
        enemy, i, len, body, sprite, flameBody;

    // Activate any inactive enemies that are close enough to the player
    for (i = 0, len = inactiveEnemies.length; i < len; i++) {
        enemy = inactiveEnemies[i];
        collisions = this.collisionStructure.getCollisions(enemy);

        // Did the enemy intersect the region check
        if (collisions.indexOf(this.activeRegion) !== -1) {
            this.inactiveEnemies.splice(this.inactiveEnemies.indexOf(enemy), 1);
            this.activeEnemies.push(enemy);

            // Make the sprite face left and send it on it's way
            body = enemy.getComponent('RectPhysicsBody');
            sprite = enemy.getComponent('Sprite');
            body.velocity.x = -CONSTANTS.ENEMY.SPEED;
            sprite.pivot.x = sprite.width;
            sprite.scale.x = -1;

            // Add the flames to the drawing system
            var flameSprite = this._flames[enemy.id].getComponent('Sprite');
            flameSprite.pivot.x = flameSprite.width;
            flameSprite.scale.x = -1;
            this.mainLayer.addEntity(this._flames[enemy.id]);
        }
    }

    // Check for collisions with activated enemies
    for (i = 0, len = this.activeEnemies.length; i < len; i++) {
        enemy = this.activeEnemies[i];
        body = enemy.getComponent('RectPhysicsBody');
        this.collisionStructure.moveEntity(enemy, body.velocity);

        // Move the flames with the matching enemy
        flameBody = this._flames[enemy.id].getComponent('RectPhysicsBody');
        flameBody.x += body.velocity.x;

        // Check if the enemy went off screen
        // The width is negative when a sprite is flipped
        if (body.x < -Math.abs(body.width)) {
            this.mainLayer.safeRemoveEntity(enemy);
            continue;
        }

        // If the enemy collided with the player, let someone know
        collisions = this.collisionStructure.getCollisions(enemy);
        if (collisions.indexOf(this.player) !== -1) {
            this.onPlayerCollision(enemy);
        }
    }
};

/**
 * Called when an enemy collides with the player
 * Should be overwritten by player system
 * @param {Entity} enemy
 */
Enemy.prototype.onPlayerCollision = function(enemy){};

module.exports = Enemy;