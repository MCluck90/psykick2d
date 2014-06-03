'use strict';

/**
 * Determines if two objects are colliding
 * @param {Rectangle} a
 * @param {Rectangle} b
 * @returns {boolean}
 */
function isColliding(a, b) {
    var topA = a.y,
        bottomA = a.y + a.height,
        leftA = a.x,
        rightA = a.x + a.width,

        topB = b.y,
        bottomB = b.y + b.height,
        leftB = b.x,
        rightB = b.x + b.width,

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
 * @param {number} options.width    Width
 * @param {number} options.height   Height
 * @param {number} options.cellSize Size of a cell
 * @constructor
 */
var QuadTree = function(options) {
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.cellSize = options.cellSize || 100;
    this.children = new Array(4);
    this.entities = [];
};

/**
 * Adds an entity to the tree
 * @param {Entity} entity
 * @param {Rectangle} [rect]
 */
QuadTree.prototype.addEntity = function(entity, rect) {
    if (this.entities.indexOf(entity) !== -1) {
        return;
    }
    if (this.width <= this.cellSize || this.height <= this.cellSize) {
        this.entities.push(entity);
    } else {
        rect = rect || entity.getComponent('Rectangle');
        var top    = rect.y,
            bottom = rect.y + rect.height,
            left   = rect.x,
            right  = rect.x + rect.width,
            inUpper = (top <= this.y + this.height / 2),
            inLower = (bottom >= this.y + this.height / 2),
            inLeft = (left <= this.x + this.width / 2),
            inRight = (right >= this.x + this.width / 2),
            nodeOptions = {
                width: this.width / 2,
                height: this.height / 2,
                cellSize: this.cellSize
            };

        if (inUpper && inLeft) {
            if (!this.children[0]) {
                nodeOptions.x = this.x;
                nodeOptions.y = this.y;
                this.children[0] = new QuadTree(nodeOptions);
            }
            this.children[0].addEntity(entity, rect);
        }
        if (inUpper && inRight) {
            if (!this.children[1]) {
                nodeOptions.x = this.x + this.width / 2;
                nodeOptions.y = this.y;
                this.children[1] = new QuadTree(nodeOptions);
            }
            this.children[1].addEntity(entity, rect);
        }
        if (inLower && inRight) {
            if (!this.children[2]) {
                nodeOptions.x = this.x + this.width / 2;
                nodeOptions.y = this.y + this.height / 2;
                this.children[2] = new QuadTree(nodeOptions);
            }
            this.children[2].addEntity(entity, rect);
        }
        if (inLower && inLeft) {
            if (!this.children[3]) {
                nodeOptions.x = this.x;
                nodeOptions.y = this.y + this.height / 2;
                this.children[3] = new QuadTree(nodeOptions);
            }
            this.children[3].addEntity(entity, rect);
        }
    }
};

/**
 * Removes an Entity from the tree
 * @param {Entity} entity
 * @param {Rectangle} [rect]
 */
QuadTree.prototype.removeEntity = function(entity, rect) {
    var entityIndex = this.entities.indexOf(entity);
    if (entityIndex !== -1) {
        this.entities.splice(entityIndex, 1);
        return;
    }

    rect = rect || entity.getComponent('Rectangle');
    var top    = rect.y,
        bottom = rect.y + rect.height,
        left   = rect.x,
        right  = rect.x + rect.width,
        inUpper = (top <= this.y + this.height / 2),
        inLower = (bottom >= this.y + this.height / 2),
        inLeft = (left <= this.x + this.width / 2),
        inRight = (right >= this.x + this.width / 2);

    if (inUpper && inLeft && this.children[0]) {
        this.children[0].removeEntity(entity, rect);
    }
    if (inUpper && inRight && this.children[1]) {
        this.children[1].removeEntity(entity, rect);
    }
    if (inLower && inRight && this.children[2]) {
        this.children[2].removeEntity(entity, rect);
    }
    if (inLower && inLeft && this.children[3]) {
        this.children[3].removeEntity(entity, rect);
    }
};

/**
 * Moves an Entity and updates it's position in the tree
 * @param {Entity} entity
 * @param {{ x: number, y: number }} deltaPosition
 */
QuadTree.prototype.moveEntity = function(entity, deltaPosition) {
    var rect = entity.getComponent('Rectangle'),
        hasMoved = (Math.abs(deltaPosition.x) + Math.abs(deltaPosition.y)) > 0;

    // TODO: Do a smart check to see if it's changed cells
    if (hasMoved) {
        this.removeEntity(entity, rect);
        rect.x += deltaPosition.x;
        rect.y += deltaPosition.y;
        this.addEntity(entity, rect);
    }
};

/**
 * Returns all entities the given entity is colliding with
 * @param {Entity} entity
 * @param {Rectangle} [rect]
 * @returns {Entity[]}
 */
QuadTree.prototype.getCollisions = function(entity, rect) {
    var result = [];
    if (this.entities.indexOf(entity) === -1) {
        rect = rect || entity.getComponent('Rectangle');
        var top    = rect.y,
            bottom = rect.y + rect.height,
            left   = rect.x,
            right  = rect.x + rect.width,
            inUpper = (top <= this.y + this.height / 2),
            inLower = (bottom >= this.y + this.height / 2),
            inLeft = (left <= this.x + this.width / 2),
            inRight = (right >= this.x + this.width / 2);

        if (inUpper && inLeft && this.children[0]) {
            result = result.concat(this.children[0].getCollisions(entity, rect));
        }
        if (inUpper && inRight && this.children[1]) {
            result = result.concat(this.children[1].getCollisions(entity, rect));
        }
        if (inLower && inRight && this.children[2]) {
            result = result.concat(this.children[2].getCollisions(entity, rect));
        }
        if (inLower && inLeft && this.children[3]) {
            result = result.concat(this.children[3].getCollisions(entity, rect));
        }
    } else {
        for (var i = 0, len = this.entities.length; i < len; i++) {
            var other = this.entities[i];
            if (other === entity) {
                continue;
            }
            if (isColliding(rect, other.getComponent('Rectangle'))) {
                result.push(other);
            }
        }
    }

    return result.filter(function(elem, pos) {
        return result.indexOf(elem) === pos;
    });
};

module.exports = QuadTree;