(function(P2D, Game) {
    var BehaviorSystem = P2D.BehaviorSystem,
        Helper = P2D.Helper,

        SPEED = 200;

    /**
     * This is a unique system because we only want two exact entities in it
     * @param options
     * @constructor
     */
    var EnemyAI = function(options) {
        BehaviorSystem.call(this);
        this.enemy = options.enemy;
        this.ball = options.ball;
    };

    Helper.inherit(EnemyAI, BehaviorSystem);

    EnemyAI.prototype.update = function() {
        var enemyRect = this.enemy.getComponent('RectPhysicsBody'),
            ballRect = this.ball.getComponent('RectPhysicsBody');

        if (ballRect.y < enemyRect.y + enemyRect.h / 4) {
            enemyRect.velocity.y = -SPEED;
        } else if (ballRect.y > enemyRect.y + (3 / 4) * enemyRect.h) {
            enemyRect.velocity.y = SPEED;
        } else {
            enemyRect.velocity.y = 0;
        }
    };

    Game.EnemyAI = EnemyAI;
})(Psykick2D, window.Game);