/***
 * Define a position (of an object)
 * @constructor
 * @inherit Psykick.Component
 * @param   {Object}    coords
 * @param   {Number}    [coords.x]          X coordinate
 * @param   {number}    [coords.y]          Y coordinate
 * @param   {number}    [coords.rotation]   Rotation
 */

Psykick.Components.Position = function(coords){
    this.Name = "Position";

    var defaults = {
        x: 0,
        y: 0,
        rotation: 0
    };

    coords = Psykick.Helper.defaults(coords, defaults);
    this.x = coords.x;
    this.y = coords.y;
    this.rotation = coords.rotation;
};

Psykick.Helper.extend(Psykick.Components.Position, Psykick.Component);