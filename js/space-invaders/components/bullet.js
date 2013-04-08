Game.Components.Bullet = function(options) {
    this.Name = "Bullet";
    var defaults = {
        speed: 600
    };

    options = Psykick.Helper.defaults(options, defaults);
    this.speed = options.speed;
};

Psykick.Helper.extend(Game.Components.Bullet, Psykick.Component);