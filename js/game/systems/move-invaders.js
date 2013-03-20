/**
 * Moves invaders in a row
 * @constructor
 * @inherit Psykick.BehaviorSystem
 */
Game.Systems.MoveInvaders = function() {
    this.Speed = 100;
    this.MoveRight = true;
    this.Margin = 48;
    this.RequiredComponents = ["Rectangle"];
};

Psykick.Helper.extend(Game.Systems.MoveInvaders, Psykick.BehaviorSystem);

/**
 * Move around the invaders
 * @param {Number} delta
 */
Game.Systems.MoveInvaders.prototype.update = function(delta) {
    var canvas = this.Parent.c.canvas,
        cWidth = canvas.width,
        moveRightNext = !this.MoveRight,
        rowContainer = {},
        rowKeys = [],
        xChange = this.Speed * delta;

    // Organize by row
    for (var i = 0, len = this.ActionOrder.length; i < len; i++) {
        var entity = this.ActionOrder[i],
            rect = entity.getComponent("Rectangle");

        if (typeof rowContainer[rect.y] === 'undefined') {
            var rowBucket = [];
            rowBucket.min = rect.x;
            rowBucket.max = rect.x + rect.w;
            rowContainer[rect.y] = rowBucket;
            rowKeys.push(rect.y);
        }

        rowContainer[rect.y].push(rect);

        if (rect.x < rowContainer[rect.y].min) {
            rowContainer[rect.y].min = rect.x;
        } else if (rect.x + rect.w > rowContainer[rect.y].max) {
            rowContainer[rect.y].max = rect.x + rect.w;
        }
    }

    rowKeys.sort();

    for (var i = 0, numOfKeys = rowKeys.length; i < numOfKeys; i++) {
        var key = rowKeys[i],
            row = rowContainer[key],
            rowChange = xChange;

        if (this.MoveRight) {
            if (row.max + rowChange > cWidth - this.Margin) {
                rowChange = cWidth - this.Margin - row.max;
                moveRightNext = true;
            }
        } else {
            rowChange *= -1;

            if (row.min + rowChange < this.Margin) {
                rowChange = this.Margin - row.min;
                moveRightNext = false;
            }
        }

        for (var j = 0, len = row.length; j < len; j++) {
            row[j].x += rowChange;
        }
    }

    this.MoveRight = !moveRightNext;
};