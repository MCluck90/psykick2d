Game.Systems.PlayerShooting = function() {
    this.RequiredComponents = ["Player", "Rectangle"];
	
	this.SecondsBetweenShots = 1;
	this.timeUntilShot = 0;
};

Psykick.Helper.extend(Game.Systems.PlayerShooting, Psykick.BehaviorSystem);

Game.Systems.PlayerShooting.prototype.update = function(delta) {
    if (this.ActionOrder.length === 0) {
        return;
    }
	
	this.timeUntilShot -= delta;
	
	if (this.timeUntilShot > 0) {
		return;
	}

    var entity = this.ActionOrder[0],
        rect = entity.getComponent("Rectangle");

    if (Psykick.Helper.isKeyDown(Psykick.Keys.Space)) {
        var parent = entity.Parent,
            world = parent.World,
            bullet = world.createEntity();

        bullet.addComponent(new Psykick.Components.Rectangle({
            x: rect.x + rect.w / 2 - 5,
            y: rect.y,
            w: 10,
            h: 20
        }));
        bullet.addComponent(new Psykick.Components.Color({
            colors: ["#FFF"]
        }));
        bullet.addComponent(new Game.Components.Bullet());

        parent.addEntity(bullet, true);
		
		this.timeUntilShot = this.SecondsBetweenShots;
    }
};