'use strict';

module.exports = {
    World: require('./world.js'),
    Component: require('./component.js'),
    Entity: require('./entity.js'),
    Layer: require('./layer.js'),
    System: require('./system.js'),
    RenderSystem: require('./render-system.js'),
    BehaviorSystem: require('./behavior-system.js'),

    Helper: require('./helper.js'),
    Keys: require('./keys.js'),

    Components: {
        GFX: {
            Animation: require('./components/gfx/animation.js'),
            Color: require('./components/gfx/color.js'),
            SpriteSheet: require('./components/gfx/sprite-sheet.js')
        }
    },

    Systems: {
        Sprite: require('./systems/sprite.js')
    }
};