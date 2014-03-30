module.exports = {
    BehaviorSystem: require('./behavior-system.js'),
    Component: require('./component.js'),
    Components: {
        GFX: {
            Animation: require('./components/gfx/animation.js'),
            Color: require('./components/gfx/color.js'),
            SpriteSheet: require('./components/gfx/sprite-sheet.js')
        },
        Shape: {
            Rectangle: require('./components/shape/rectangle.js')
        }
    },
    Entity: require('./entity.js'),
    Helper: require('./helper.js'),
    Keys: require('./keys.js'),
    Layer: require('./layer.js'),
    RenderSystem: require('./render-system.js'),
    System: require('./system.js'),
    Systems: {
        Render: {
            ColoredRect: require('./systems/render/colored-rect.js'),
            Sprite: require('./systems/render/sprite.js')
        }
    },
    World: require('./world.js')
}