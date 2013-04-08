Game.Systems.MoveBullet = function() {
    this.RequiredComponents = ["Bullet", "Rectangle"];
};

Psykick.Helper.extend(Game.Systems.MoveBullet, Psykick.BehaviorSystem);

Game.Systems.MoveBullet.prototype.update = function(delta) {
    if (this.ActionOrder.length === 0) {
        return;
    }

    for (var i = 0, len = this.ActionOrder.length; i < len; i++) {
        var entity = this.ActionOrder[i],
            rect = entity.getComponent("Rectangle"),
            bullet = entity.getComponent("Bullet");

        rect.y -= bullet.speed * delta;
        if (rect.y + rect.h < 0) {
            entity.Parent.World.removeEntity(entity);
        }
    }
};