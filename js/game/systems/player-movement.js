/**
 * Controls the player movement
 * @constructor
 * @inherit Psykick.BehaviorSystem
 */
Game.Systems.PlayerMovement = function() {
    this.RequiredComponents = ["Rectangle", "Player"];
    this.Speed = 300;
};

Psykick.Helper.extend(Game.Systems.PlayerMovement, Psykick.BehaviorSystem);

Game.Systems.PlayerMovement.prototype.update = function(delta) {
    if (this.ActionOrder.length === 0) {
        return;
    }

    var entity = this.ActionOrder[0],
        rect = entity.getComponent("Rectangle"),
        xChange = this.Speed * delta;
    if (Psykick.Helper.isKeyDown(Psykick.Keys.Left)) {
        rect.x -= xChange;

        if (rect.x < 0) {
            rect.x = 0;
        }
    } else if (Psykick.Helper.isKeyDown(Psykick.Keys.Right)) {
        rect.x += xChange;

        if (rect.x + rect.w > this.Parent.c.canvas.width) {
            rect.x = this.Parent.c.canvas.width - rect.w;
        }
    }
};