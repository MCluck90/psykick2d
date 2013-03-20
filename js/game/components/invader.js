Game.Components.Invader = function(options) {
    this.Name = "Invader";

    var defaults = {
            type: 1
        },
        types = {
            1: {
                score: 10
            },
            2: {
                score: 20
            },
            3: {
                score: 40
            }
        };

    options = Psykick.Helper.defaults(options, defaults);
    this.score = types[options.type];
};