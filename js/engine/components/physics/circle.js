/**
 * Defines a simple circle
 * @constructor
 * @inherit Psykick.Component
 * @param   {Object}    options
 * @param   {Number}    [options.x=0]   Center x coordinate
 * @param   {Number}    [options.y=0]   Center y coordinate
 * @param   {Number}    [options.r=0]   Radius
 */
Psykick.Components.Circle = function(options) {
    this.Name = "Circle";

    var defaults = {
        x: 0,
        y: 0,
        r: 0
    };

    options = Psykick.Helper.defaults(options, defaults);
    this.x = options.x;
    this.y = options.y;
    this.r = options.r;
};

Psykick.Helper.extend(Psykick.Components.Circle, Psykick.Component);