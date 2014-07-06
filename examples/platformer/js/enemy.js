'use strict';

var World = require('psykick2d').World,
    Helper = require('psykick2d').Helper,
    BehaviorSystem = require('psykick2d').BehaviorSystem,
    QuadTree = require('psykick2d').DataStructures.QuadTree,
    RectPhysicsBody = require('psykick2d').Components.Physics.RectPhysicsBody,

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
        height: SCREEN_HEIGHT + REGION_MARGIN * 2
    });
    this.activeRegion.addComponent(this.regionRect);
    this.collisionStructure.addEntity(this.activeRegion);

    // Use this to separate the active enemies from the ones that are still inactive
    this.inactiveEnemies = [];
    this.activeEnemies = [];
};

Helper.inherit(Enemy, BehaviorSystem);

Enemy.prototype.addEntity = function(entity) {
    if (BehaviorSystem.prototype.addEntity.call(this, entity)) {
        this.inactiveEnemies.push(entity);
        this.collisionStructure.addEntity(entity);
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
        } else {
            index = this.activeEnemies.indexOf(entity);
            this.activeEnemies.splice(index, 1);
        }
        this.collisionStructure.removeEntity(entity);
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
        y: (playerCenter.y - SCREEN_HEIGHT / 2 - REGION_MARGIN) - this.regionRect.y
    });

    var inactiveEnemies = this.inactiveEnemies.slice(0),
        collisions = [],
        enemy, i, len, body, sprite;

    // Activate any enemies now in the region
    for (i = 0, len = inactiveEnemies.length; i < len; i++) {
        enemy = inactiveEnemies[i];
        collisions = this.collisionStructure.getCollisions(enemy);
        // Enemy hit activation area
        if (collisions.indexOf(this.activeRegion) !== -1) {
            this.inactiveEnemies.splice(i, 1);
            this.activeEnemies.push(enemy);

            // Start moving
            body = enemy.getComponent('RectPhysicsBody');
            sprite = enemy.getComponent('Sprite');
            body.velocity.x = -ENEMY_SPEED;
            sprite.scale.x = -1;
            sprite.pivot.x = 128;
        }
    }

    for (i = 0, len = this.activeEnemies.length; i < len; i++) {
        enemy = this.activeEnemies[i];
        body = enemy.getComponent('RectPhysicsBody');
        this.collisionStructure.moveEntity(enemy, body.velocity);

        if (body.x + body.width < -REGION_MARGIN) {
            this._removeEnemy(enemy);
        }
        collisions = this.collisionStructure.getCollisions(enemy);
        if (collisions.indexOf(this.player) !== -1) {
            this.onPlayerCollision(enemy);
        }
    }
};

/**
 * Remove an enemy from all systems
 * @param {Enemy} enemy
 * @private
 */
Enemy.prototype._removeEnemy = function(enemy) {
    var behaviorSystems = this.mainLayer.behaviorSystems,
        renderSystems = this.mainLayer.renderSystems,
        numOfBehaviorSystems = behaviorSystems.length,
        numOfRenderSystems = renderSystems.length,
        len = Math.max(numOfBehaviorSystems, numOfRenderSystems);

    for (var i = 0; i < len; i++) {
        if (i < numOfBehaviorSystems && behaviorSystems[i] !== this) {
            behaviorSystems[i].removeEntity(enemy);
        }
        if (i < numOfRenderSystems) {
            renderSystems[i].removeEntity(enemy);
        }
    }
    this.safeRemoveEntity(enemy);
};

/**
 * Called when an enemy collides with the player
 * Should be overwritten by player system
 * @param {Entity} enemy
 */
Enemy.prototype.onPlayerCollision = function(enemy){};

module.exports = Enemy;