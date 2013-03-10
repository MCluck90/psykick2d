Psykick.BehaviorSystem = function(id) {
    Psykick.System.call(this, id);
    this.ActionOrder = [];
};

// Inherit from Psykick.System
Psykick.BehaviorSystem.prototype = new Psykick.System();
Psykick.BehaviorSystem.constructor = Psykick.BehaviorSystem;

/**
 * Updates all of the entities
 *
 * @param {Number} delta    Amount of time that's passed since the last update
 */
Psykick.BehaviorSystem.prototype.update = function(delta) {};