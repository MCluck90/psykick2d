/**
 * Define a rectangle (often used in collisions)
 * @constructor
 * @inherit Psykick.Component
 * @param   {Object}    options
 * @param   {Number}    [options.x=0]   X coordinate
 * @param   {Number}    [options.y=0]   Y coordinate
 * @param   {Number}    [options.w=0]   Width
 * @param   {Number}    [options.h=0]   Height
 */
Psykick.Components.Rectangle = function(options) {
    this.Name = "Rectangle";

    var defaults = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };

    options = Psykick.Helper.defaults(options, defaults);
    this.x = options.x;
    this.y = options.y;
    this.w = options.w;
    this.h = options.h;
};

Psykick.Helper.extend(Psykick.Components.Rectangle, Psykick.Component);

