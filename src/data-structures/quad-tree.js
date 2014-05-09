'use strict';

/**
 * Determines if two objects are colliding
 * @param {RectPhysicsBody} a
 * @param {RectPhysicsBody} b
 * @returns {boolean}
 */
function isColliding(a, b) {
    var topA = a.y,
        bottomA = a.y + a.h,
        leftA = a.x,
        rightA = a.x + a.w,

        topB = b.y,
        bottomB = b.y + b.h,
        leftB = b.x,
        rightB = b.x + b.w,

        verticalIntersect = (topA <= bottomB && bottomA >= bottomB) ||
            (topB <= bottomA && bottomB >= bottomA),
        horizontalIntersect = (leftA <= rightB && rightA >= rightB) ||
            (leftB <= rightA && rightB >= rightA);

    return (verticalIntersect && horizontalIntersect);
}

/**
 * Keeps track of all the physical objects in space
 * @param {object} options
 * @param {number} options.x        X position
 * @param {number} options.y        Y position
 * @param {number} options.w        Width
 * @param {number} options.h        Height
 * @param {number} options.cellSize Size of a cell
 * @constructor
 */
var QuadTree = function(options) {
    this.x = options.x;
    this.y = options.y;
    this.w = options.w;
    this.h = options.h;
    this.cellSize = options.cellSize || 100;
    this.children = new Array(4);
    this.entities = [];
};

/**
 * Adds an entity to the tree
 * @param {Entity} entity
 * @param {RectPhysicsBody} [body]
 */
QuadTree.prototype.addEntity = function(entity, body) {
    if (this.entities.indexOf(entity) !== -1) {
        return;
    }
    if (this.w <= this.cellSize || this.h <= this.cellSize) {
        this.entities.push(entity);
    } else {
        body = body || entity.getComponent('RectPhysicsBody');
        var top    = body.y,
            bottom = body.y + body.h,
            left   = body.x,
            right  = body.x + body.w,
            inUpper = (top <= this.y + this.h / 2),
            inLower = (bottom >= this.y + this.h / 2),
            inLeft = (left <= this.x + this.w / 2),
            inRight = (right >= this.x + this.w / 2),
            nodeOptions = {
                w: this.w / 2,
                h: this.h / 2,
                cellSize: this.cellSize
            };

        if (inUpper && inLeft) {
            if (!this.children[0]) {
                nodeOptions.x = this.x;
                nodeOptions.y = this.y;
                this.children[0] = new QuadTree(nodeOptions);
            }
            this.children[0].addEntity(entity, body);
        }
        if (inUpper && inRight) {
            if (!this.children[1]) {
                nodeOptions.x = this.x + this.w / 2;
                nodeOptions.y = this.y;
                this.children[1] = new QuadTree(nodeOptions);
            }
            this.children[1].addEntity(entity, body);
        }
        if (inLower && inRight) {
            if (!this.children[2]) {
                nodeOptions.x = this.x + this.w / 2;
                nodeOptions.y = this.y + this.h / 2;
                this.children[2] = new QuadTree(nodeOptions);
            }
            this.children[2].addEntity(entity, body);
        }
        if (inLower && inLeft) {
            if (!this.children[3]) {
                nodeOptions.x = this.x;
                nodeOptions.y = this.y + this.h / 2;
                this.children[3] = new QuadTree(nodeOptions);
            }
            this.children[3].addEntity(entity, body);
        }
    }
};

/**
 * Removes an Entity from the tree
 * @param {Entity} entity
 * @param {RectPhysicsBody} [body]
 */
QuadTree.prototype.removeEntity = function(entity, body) {
    var entityIndex = this.entities.indexOf(entity);
    if (entityIndex !== -1) {
        this.entities.splice(entityIndex, 1);
        return;
    }

    body = body || entity.getComponent('RectPhysicsBody');
    var top    = body.y,
        bottom = body.y + body.h,
        left   = body.x,
        right  = body.x + body.w,
        inUpper = (top <= this.y + this.h / 2),
        inLower = (bottom >= this.y + this.h / 2),
        inLeft = (left <= this.x + this.w / 2),
        inRight = (right >= this.x + this.w / 2);

    if (inUpper && inLeft && this.children[0]) {
        this.children[0].removeEntity(entity, body);
    }
    if (inUpper && inRight && this.children[1]) {
        this.children[1].removeEntity(entity, body);
    }
    if (inLower && inRight && this.children[2]) {
        this.children[2].removeEntity(entity, body);
    }
    if (inLower && inLeft && this.children[3]) {
        this.children[3].removeEntity(entity, body);
    }
};

/**
 * Moves an Entity and updates it's position in the tree
 * @param {Entity} entity
 * @param {{ x: number, y: number }} deltaPosition
 */
QuadTree.prototype.moveEntity = function(entity, deltaPosition) {
    var body = entity.getComponent('RectPhysicsBody'),
        hasMoved = (Math.abs(deltaPosition.x) + Math.abs(deltaPosition.y)) > 0;

    // TODO: Do a smart check to see if it's changed cells
    if (hasMoved) {
        this.removeEntity(entity, body);
        body.x += deltaPosition.x;
        body.y += deltaPosition.y;
        this.addEntity(entity, body);
    }
};

/**
 * Returns all entities the given entity is colliding with
 * @param {Entity} entity
 * @param {RectPhysicsBody} [body]
 * @returns {Entity[]}
 */
QuadTree.prototype.getCollisions = function(entity, body) {
    var result = [];
    if (this.entities.indexOf(entity) === -1) {
        body = body || entity.getComponent('RectPhysicsBody');
        var top    = body.y,
            bottom = body.y + body.h,
            left   = body.x,
            right  = body.x + body.w,
            inUpper = (top <= this.y + this.h / 2),
            inLower = (bottom >= this.y + this.h / 2),
            inLeft = (left <= this.x + this.w / 2),
            inRight = (right >= this.x + this.w / 2);

        if (inUpper && inLeft && this.children[0]) {
            result = result.concat(this.children[0].getCollisions(entity, body));
        }
        if (inUpper && inRight && this.children[1]) {
            result = result.concat(this.children[1].getCollisions(entity, body));
        }
        if (inLower && inRight && this.children[2]) {
            result = result.concat(this.children[2].getCollisions(entity, body));
        }
        if (inLower && inLeft && this.children[3]) {
            result = result.concat(this.children[3].getCollisions(entity, body));
        }
    } else {
        for (var i = 0, len = this.entities.length; i < len; i++) {
            var other = this.entities[i];
            if (other === entity) {
                continue;
            }
            if (isColliding(body, other.getComponent('RectPhysicsBody'))) {
                result.push(other);
            }
        }
    }

    return result.filter(function(elem, pos) {
        return result.indexOf(elem) === pos;
    });
};

module.exports = QuadTree;