/**
 * Defines a single point
 * @constructor
 * @inherit Psykick.Component
 * @param   {Object}    options
 * @param   {Number}    [options.x=0]   X coordinate
 * @param   {Number}    [options.y=0]   Y coordinate
 */
Psykick.Components.Point = function(options) {
    this.Name = "Point";

    var defaults = {
        x: 0,
        y: 0
    };

    options = Psykick.Helper.defaults(options, defaults);
    this.x = options.x;
    this.y = options.y;
};

Psykick.Helper.extend(Psykick.Components.Point, Psykick.Component);