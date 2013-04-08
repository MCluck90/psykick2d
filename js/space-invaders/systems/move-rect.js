/**
 * Moves rectangles around pseudo-randomly
 * @constructor
 * @inherit Psykick.BehaviorSystem
 */
Game.Systems.MoveRect = function() {
    this.RequiredComponents = ["Rectangle"];
};

Psykick.Helper.extend(Game.Systems.MoveRect, Psykick.BehaviorSystem);

Game.Systems.MoveRect.prototype.update = function(delta) {
    for (var i = 0, len = this.ActionOrder.length; i < len; i++) {
        var entity = this.ActionOrder[i],
            rectComponent = entity.getComponent("Rectangle"),
            xChange = Math.random() * 250 * delta,
            yChange = Math.random() * 250 * delta;

        rectComponent.x += xChange;
        rectComponent.y += yChange;

        if (rectComponent.x > this.Parent.c.canvas.width) {
            rectComponent.x = -rectComponent.w;
        }
        if (rectComponent.y > this.Parent.c.canvas.height) {
            rectComponent.y = -rectComponent.h;
        }
    }
};