/**
 * Draw rectangles
 * @constructor
 * @inherit Psykick.RenderSystem
 */
Game.Systems.DrawRect = function() {
    this.RequiredComponents = ["Rectangle", "Color"];
};

Psykick.Helper.extend(Game.Systems.DrawRect, Psykick.RenderSystem);

/**
 * Draws rectangles to the canvas
 * @param {CanvasRenderingContext2D} c
 */
Game.Systems.DrawRect.prototype.draw = function(c) {
    for (var i = 0, len = this.DrawOrder.length; i < len; i++) {
        var entity = this.DrawOrder[i],
            colorComponent = entity.getComponent("Color"),
            rectComponent = entity.getComponent("Rectangle");

        if (colorComponent.colors.length === 0) {
            continue;
        }

        c.fillStyle = colorComponent.colors[0];
        c.fillRect(rectComponent.x, rectComponent.y, rectComponent.w, rectComponent.h);
    }
};