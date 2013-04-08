Psykick.Screen = function(options) {
    var defaults = {
        World: null,
        Name: "",
        init: function() {},
        onEnter: function() {},
        onExit: function() {},
        onDestroy: function() {}
    };
    options = Psykick.Helper.defaults(options, defaults);

    if (!(options.World instanceof Psykick.World)) {
        throw new Error("Must provide a World instance.");
    }

    if (options.Name.length === 0) {
        throw new Error("Screen must be given a valid name.");
    }

    this.World = options.World;
    this.Name = options.Name;
    this.onEnter = options.onEnter;
    this.onExit = options.onExit;
    this.onDestroy = options.onDestroy;
};