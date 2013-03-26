Game.Components.Player = function(options) {
    this.Name = "Player";

    var defaults = {
        weaponLevel: 0,
        score: 0
    };

    options = Psykick.Helper.defaults(options, defaults);
    this.weaponLevel = options.weaponLevel;
    this.score = options.score;
};

Psykick.Helper.extend(Game.Components.Player, Psykick.Component);