'use strict';

/**
 * Determines if two objects are colliding
 * @param {Rectangle} a
 * @param {Rectangle} b
 * @returns {boolean}
 */
function isColliding(a, b) {
    var topA = a.y,
        bottomA = a.y + Math.abs(a.height),
        leftA = a.x,
        rightA = a.x + Math.abs(a.width),

        topB = b.y,
        bottomB = b.y + Math.abs(b.height),
        leftB = b.x,
        rightB = b.x + Math.abs(b.width),

        verticalIntersect = (topA <= bottomB && bottomA >= bottomB) ||
            (topB <= bottomA && bottomB >= bottomA),
        horizontalIntersect = (leftA <= rightB && rightA >= rightB) ||
            (leftB <= rightA && rightB >= rightA);

    return (verticalIntersect && horizontalIntersect);
}

/**
 * A simple grid for finding any collisions
 * Best used for tiled game worlds with defined boundaries
 * @param {object} options
 * @param {number} options.width                        Width of the game world
 * @param {number} options.height                       Height of the game world
 * @param {number} options.cellWidth                    Width of a cell. May use cellSize instead
 * @param {number} options.cellHeight                   Height of a cell. May use cellSize instead
 * @param {number} [options.cellSize]                   Set this if you want width and height to be the same
 * @param {number} [options.componentType='Rectangle']  Type of component to treat as a rectangle
 * @constructor
 */
var CollisionGrid = function(options) {
    this.componentType = options.componentType || 'Rectangle';

    this.width = options.width;
    this.height = options.height;
    if (options.cellSize) {
        this.cellWidth = options.cellSize;
        this.cellHeight = options.cellSize;
    } else {
        this.cellWidth = options.cellWidth || 100;
        this.cellHeight = options.cellHeight || 100;
    }

    var maxX = ~~(this.width / this.cellWidth),
        maxY = ~~(this.height / this.cellHeight);
    this._grid = new Array(maxX);
    for (var x = 0; x < maxX; x++) {
        this._grid[x] = new Array(maxY);
        for (var y = 0; y < maxY; y++) {
            this._grid[x][y] = [];
        }
    }
};

/**
 * Adds an entity to the grid
 * Entity must have a Rectangle component
 * @param {Entity} entity
 */
CollisionGrid.prototype.addEntity = function(entity) {
    var rect = entity.getComponent(this.componentType),
        minX = ~~(rect.x / this.cellWidth),
        maxX = ~~( (rect.x + Math.abs(rect.width)) / this.cellWidth ),
        minY = ~~(rect.y / this.cellHeight),
        maxY = ~~( (rect.y + Math.abs(rect.height)) / this.cellHeight );
    for (var x = minX; x <= maxX; x++) {
        var column = this._grid[x];
        if (!column) {
            continue;
        }
        for (var y = minY; y <= maxY; y++) {
            if (!column[y]) {
                continue;
            }
            var collection = column[y];
            if (collection.indexOf(entity) === -1) {
                collection.push(entity);
            }
        }
    }
};

/**
 * Removes an entity from the grid
 * @param {Entity} entity
 */
CollisionGrid.prototype.removeEntity = function(entity) {
    var rect = entity.getComponent(this.componentType),
        minX = ~~(rect.x / this.cellWidth),
        maxX = ~~( (rect.x + Math.abs(rect.width)) / this.cellWidth ),
        minY = ~~(rect.y / this.cellHeight),
        maxY = ~~( (rect.y + Math.abs(rect.height)) / this.cellHeight );
    for (var x = minX; x <= maxX; x++) {
        var column = this._grid[x];
        if (!column) {
            continue;
        }
        for (var y = minY; y <= maxY; y++) {
            if (!column[y]) {
                continue;
            }

            var collection = column[y],
                entityIndex = collection.indexOf(entity);
            if (entityIndex !== -1) {
                collection.splice(entityIndex, 1);
            }
        }
    }
};

/**
 * Moves an Entity and updates it's position in the grid
 * @param {Entity} entity
 * @param {{ x: number, y: number }} deltaPosition
 */
CollisionGrid.prototype.moveEntity = function(entity, deltaPosition) {
    deltaPosition = deltaPosition || {};
    deltaPosition.x = deltaPosition.x || 0;
    deltaPosition.y = deltaPosition.y || 0;
    var rect = entity.getComponent(this.componentType),
        width = Math.abs(rect.width),   // Apparently we can't assume width is positive
        height = Math.abs(rect.height),
        newRect = {
            minX: rect.x + deltaPosition.x,
            maxX: rect.x + width + deltaPosition.x,
            minY: rect.y + deltaPosition.y,
            maxY: rect.y + height + deltaPosition.y
        },
        oldCells = {
            minX: ~~(rect.x / this.cellWidth),
            maxX: ~~( (rect.x + width) / this.cellWidth ),
            minY: ~~(rect.y / this.cellHeight),
            maxY: ~~( (rect.y + height) / this.cellHeight )
        },
        newCells = {
            minX: ~~(newRect.minX / this.cellWidth),
            maxX: ~~(newRect.maxX / this.cellWidth),
            minY: ~~(newRect.minY / this.cellHeight),
            maxY: ~~(newRect.maxY / this.cellHeight)
        };
    if (oldCells.minX !== newCells.minX ||
        oldCells.maxX !== newCells.maxX ||
        oldCells.minY !== newCells.minY ||
        oldCells.maxY !== newCells.maxY) {
        this.removeEntity(entity);
        rect.x += deltaPosition.x;
        rect.y += deltaPosition.y;
        this.addEntity(entity);
    } else {
        rect.x += deltaPosition.x;
        rect.y += deltaPosition.y;
    }
};

/**
 * Gets the collisions for a given Entity
 * @param {Entity} entity
 * @returns {Entity[]}
 */
CollisionGrid.prototype.getCollisions = function(entity) {
    var rect = entity.getComponent(this.componentType),
        minX = ~~(rect.x / this.cellWidth),
        maxX = ~~( (rect.x + rect.width) / this.cellWidth ),
        minY = ~~(rect.y / this.cellHeight),
        maxY = ~~( (rect.y + rect.height) / this.cellHeight ),
        results = [];

    for (var x = minX; x <= maxX; x++) {
        var column = this._grid[x];
        if (!column) {
            continue;
        }
        for (var y = minY; y <= maxY; y++) {
            if (!column[y]) {
                continue;
            }
            var collection = column[y];
            for (var i = 0, len = collection.length; i < len; i++) {
                var other = collection[i];
                if (other !== entity && isColliding(other.getComponent(this.componentType), rect)) {
                    if (results.indexOf(other) === -1) {
                        results.push(other);
                    }
                }
            }
        }
    }

    return results;
};

module.exports = CollisionGrid;