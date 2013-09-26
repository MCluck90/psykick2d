/**
 * Renders an animated sprite
 *
 * @inherit Psykick.RenderSystem
 * @constructor
 */
Psykick.Systems.Sprite = function() {
    Psykick.RenderSystem.call(this);
    this.RequiredComponents = ["SpriteSheet", "Position"];
};

Psykick.Systems.Sprite.prototype = new Psykick.RenderSystem();
Psykick.Systems.Sprite.constructor = Psykick.Systems.Sprite;

/**
 * Draw all the sprites
 * @param {CanvasRenderingContext2D} c
 */
Psykick.Systems.Sprite.prototype.draw = function(c) {
    for (var i = 0, len = this.DrawOrder.length; i < len; i++) {
        var entity = this.DrawOrder[i],
            spriteSheet = entity.getComponent("SpriteSheet"),
            position = entity.getComponent("Position");

        c.save();
        c.translate(position.x, position.y);
        c.rotate(position.rotation);
        c.drawImage(
            spriteSheet.img,
            spriteSheet.xOffset,
            spriteSheet.yOffset,
            spriteSheet.frameWidth,
            spriteSheet.frameHeight,
            -spriteSheet.frameWidth / 2,
            -spriteSheet.frameHeight / 2,
            spriteSheet.frameWidth,
            spriteSheet.frameHeight
        );
        c.restore();
    }
};