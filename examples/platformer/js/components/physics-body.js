(function(P2D, Game) {
    var PhysicsBody = function(options) {
        this.NAME = 'PhysicsBody';

        var defaults = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            velocity: {
                x: 0,
                y: 0
            },
            mass: 0,
            bounciness: 0,
            solid: true
        };

        options = P2D.Helper.defaults(options, defaults);
        this.x = options.x;
        this.y = options.y;
        this.w = options.w;
        this.h = options.h;
        this.velocity = options.velocity;
        this.mass = options.mass;
        this.bounciness = options.bounciness;
        this.solid = options.solid;
    };

    P2D.Helper.inherit(PhysicsBody, P2D.Component);

    Game.Components = Game.Components || {};
    Game.Components.PhysicsBody = PhysicsBody;
})(Psykick2D, Game = window.Game || {});