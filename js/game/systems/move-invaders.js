Game.Systems.MoveInvaders = function() {
    this.Speed = 100;
    this.MoveRight = true;
    this.Margin = 80;
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
        cHeight = canvas.height,
        moveRightNext = !this.MoveRight;

    for (var i = 0, len = this.ActionOrder.length; i < len; i++) {
        var entity = this.ActionOrder[i],
            rect = entity.getComponent("Rectangle"),
            xChange = this.Speed * delta;

        if (!this.MoveRight) {
            xChange *= -1;
        }

        rect.x += xChange;
        if (rect.x + rect.w > cWidth - this.Margin) {
            rect.x = cWidth - this.Margin - rect.w;
            moveRightNext = true;
            rect.y += rect.h / 4;
        } else if (rect.x < this.Margin) {
            rect.x = this.Margin;
            moveRightNext = false;
            rect.y += rect.h / 4;
        }
    }

    this.MoveRight = !moveRightNext;
};