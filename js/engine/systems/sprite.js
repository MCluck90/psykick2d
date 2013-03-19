/**
 * Renders an animated sprite
 *
 * @inherit Psykick.RenderSystem
 * @constructor
 */
Psykick.Systems.Sprite = function() {
    Psykick.RenderSystem.call(this);
    this.RequiredComponents = ["SpriteSheet", "Animation"];
};

Psykick.Systems.Sprite.prototype = new Psykick.RenderSystem();
Psykick.Systems.Sprite.constructor = Psykick.Systems.Sprite;