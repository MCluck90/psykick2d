/**
 * A generic container for color information
 * @constructor
 * @param {Object}      options
 * @param {String[]}    [options.colors=[]] CSS-compatible color codes
 */
Psykick.Components.Color = function(options) {
    this.Name = "Color";

    var defaults = {
        colors: []
    };

    options = Psykick.Helper.defaults(options, defaults);
    this.colors = options.colors;
};

Psykick.Helper.extend(Psykick.Components.Color, Psykick.Component);