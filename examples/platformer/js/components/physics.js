(function(P2D, Game) {
    var Physics = function(options) {
        this.NAME = 'Physics';

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
            bounciness: 0
        };

        options = P2D.Helper.defaults(options, defaults);
        this.x = options.x;
        this.y = options.y;
        this.w = options.w;
        this.h = options.h;
        this.velocity = options.velocity;
        this.mass = options.mass;
        this.bounciness = options.bounciness;
    };

    P2D.Helper.inherit(Physics, P2D.Component);

    Game.Components = Game.Components || {};
    Game.Components.Physics = Physics;
})(Psykick2D, Game = window.Game || {});