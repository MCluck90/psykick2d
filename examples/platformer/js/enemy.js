'use strict';

var World = require('psykick2d').World,
    Helper = require('psykick2d').Helper,
    BehaviorSystem = require('psykick2d').BehaviorSystem,
    QuadTree = require('psykick2d').DataStructures.QuadTree,
    RectPhysicsBody = require('psykick2d').Components.Physics.RectPhysicsBody,
    Factory = require('./factory.js'),

    ENEMY_SPEED = 10,
    SCREEN_WIDTH = 800,
    SCREEN_HEIGHT = 600,
    REGION_MARGIN = 50,
    WIDTH = 10000,
    HEIGHT = 10000;

var Enemy = function(player, layer) {
    BehaviorSystem.call(this);
    this.requiredComponents = ['Enemy', 'RectPhysicsBody', 'Sprite'];
    this.player = player;
    this.playerRect = player.getComponent('RectPhysicsBody');
    // Need this for updating position in collision structure
    this.prevPlayerPosition = {
        x: this.playerRect.x,
        y: this.playerRect.y
    };
    this.mainLayer = layer;
    this.collisionStructure = new QuadTree({
        x: 0,
        y: 0,
        width: WIDTH,
        height: HEIGHT,
        componentType: 'RectPhysicsBody'
    });
    this.collisionStructure.addEntity(player);

    // Used to detect when an enemy is within range
    this.activeRegion = World.createEntity();
    this.regionRect = new RectPhysicsBody({
        x: 0,
        y: 0,
        width: SCREEN_WIDTH + REGION_MARGIN * 2,
        height: SCREEN_HEIGHT * 2
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

Enemy.prototype.addEntity = function(entity) {
    if (this.entities[entity.id] === entity) {
        return false;
    }

    if (BehaviorSystem.prototype.addEntity.call(this, entity)) {
        this.inactiveEnemies.push(entity);
        this.collisionStructure.addEntity(entity);
        var body = entity.getComponent('RectPhysicsBody'),
            flames = Factory.createFlames(body.x, body.y),
            flameSprite = flames.getComponent('Sprite');
        flameSprite.x += body.width;
        flameSprite.y += flameSprite.height / 2;
        this._flames[entity.id] = flames;
    }
};

Enemy.prototype.removeEntity = function(entity) {
    if (typeof entity === 'number') {
        entity = this.entities[entity];
    }

    if (BehaviorSystem.prototype.removeEntity.call(this, entity)) {
        var index = this.inactiveEnemies.indexOf(entity);
        if (index !== -1) {
            this.inactiveEnemies.splice(index, 1);
        }
        index = this.activeEnemies.indexOf(entity);
        if (index !== -1) {
            this.activeEnemies.splice(index, 1);
        }
        this.collisionStructure.removeEntity(entity);
        this.mainLayer.removeEntity(this._flames[entity.id]);
        delete this._flames[entity.id];
    }
};

Enemy.prototype.update = function() {
    // Move the player
    // Have to do this because of separate collision structures
    var newPosition = {
        x: this.playerRect.x,
        y: this.playerRect.y
    };
    this.playerRect.x = this.prevPlayerPosition.x;
    this.playerRect.y = this.prevPlayerPosition.y;
    this.collisionStructure.moveEntity(this.player, {
        x: newPosition.x - this.playerRect.x,
        y: newPosition.y - this.playerRect.y
    });
    this.prevPlayerPosition = {
        x: this.playerRect.x,
        y: this.playerRect.y
    };

    // Update the region check
    var playerCenter = {
        x: this.playerRect.x + this.playerRect.width / 2,
        y: this.playerRect.y + this.playerRect.height / 2
    };
    this.collisionStructure.moveEntity(this.activeRegion, {
        x: (playerCenter.x - SCREEN_WIDTH / 2 - REGION_MARGIN) - this.regionRect.x,
        y: (playerCenter.y - SCREEN_HEIGHT) - this.regionRect.y
    });

    var inactiveEnemies = this.inactiveEnemies.slice(0),
        collisions = [],
        enemy, i, len, body, sprite, flameBody;

    // Activate any enemies now in the region
    for (i = 0, len = inactiveEnemies.length; i < len; i++) {
        enemy = inactiveEnemies[i];
        collisions = this.collisionStructure.getCollisions(enemy);
        // Enemy hit activation area
        if (collisions.indexOf(this.activeRegion) !== -1) {
            this.inactiveEnemies.splice(this.inactiveEnemies.indexOf(enemy), 1);
            this.activeEnemies.push(enemy);

            // Start moving
            body = enemy.getComponent('RectPhysicsBody');
            sprite = enemy.getComponent('Sprite');
            body.velocity.x = -ENEMY_SPEED;
            sprite.pivot.x = sprite.width;
            sprite.scale.x = -1;

            // Add in the flame
            var flameSprite = this._flames[enemy.id].getComponent('Sprite');
            flameSprite.pivot.x = flameSprite.width;
            flameSprite.scale.x = -1;
            this.mainLayer.addEntity(this._flames[enemy.id]);
        }
    }

    for (i = 0, len = this.activeEnemies.length; i < len; i++) {
        enemy = this.activeEnemies[i];
        body = enemy.getComponent('RectPhysicsBody');
        flameBody = this._flames[enemy.id].getComponent('RectPhysicsBody');
        flameBody.x += body.velocity.x;
        this.collisionStructure.moveEntity(enemy, body.velocity);

        // Width is negative since the sprite is flipped
        if (body.x < body.width) {
            this.mainLayer.safeRemoveEntity(enemy);
            continue;
        }
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