(function(P2D, Game) {
    var SyncRect = function() {
        P2D.BehaviorSystem.call(this);
        this.requiredComponents = ['RectPhysicsBody', 'Rectangle'];
    };

    P2D.Helper.inherit(SyncRect, P2D.BehaviorSystem);

    SyncRect.prototype.update = function() {
        for (var i = 0, len = this.actionOrder.length; i < len; i++) {
            var entity = this.actionOrder[i],
                physicsBody = entity.getComponent('RectPhysicsBody'),
                rect = entity.getComponent('Rectangle');
            rect.x = physicsBody.x;
            rect.y = physicsBody.y;
        }
    };

    Game.Systems = Game.Systems || {};
    Game.Systems.SyncRect = SyncRect;
})(Psykick2D, Game = window.Game || {});