(function() {
    "use strict";

    /**
     * Controls the behavior of entities.
     * Called during the "update" stage of a frame
     * @constructor
     * @inherit Psykick.System
     * @property    {Psykick.Entity[]}  ActionOrder Order in which the entites will be acted upon
     */
    Psykick.BehaviorSystem = function() {
        Psykick.System.call(this);
        this.ActionOrder = [];
    };

    // Inherit from Psykick.System
    Psykick.BehaviorSystem.prototype = new Psykick.System();
    Psykick.BehaviorSystem.constructor = Psykick.BehaviorSystem;

    /**
     * Add a new Entity to the collection and make it the last one to be updated
     * @param {Psykick.Entity} entity
     */
    Psykick.BehaviorSystem.prototype.addEntity = function(entity) {
        Psykick.System.prototype.addEntity.call(this, entity);

        if (this.ActionOrder.indexOf(entity) === -1) {
            this.ActionOrder.push(entity);
        }
    };

    Psykick.BehaviorSystem.prototype.removeEntity = function(entity) {
        if (Psykick.System.prototype.removeEntity.call(this, entity)) {
            if (entity instanceof Psykick.Entity) {
                var index = this.ActionOrder.indexOf(entity);
                if (index !== -1) {
                    this.ActionOrder.splice(index, 1);
                }
            } else {
                for (var i = 0, len = this.ActionOrder.length; i < len; i++) {
                    if (this.ActionOrder[i].ID === entity) {
                        this.ActionOrder.splice(i, 1);
                        break;
                    }
                }
            }

            return true;
        } else {
            return false;
        }


    };

    /**
     * Updates all of the entities.
     * Should be redefined in each new instance of a BehaviorSystem
     * @param {Number} delta    Amount of time that's passed since the last update
     */
    Psykick.BehaviorSystem.prototype.update = function(delta) {};

})();