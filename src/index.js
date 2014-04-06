module.exports = {
    BehaviorSystem: require('./behavior-system.js'),
    Component: require('./component.js'),
    Components: {
        GFX: {
            Animation: require('./components/gfx/animation.js'),
            Color: require('./components/gfx/color.js'),
            SpriteSheet: require('./components/gfx/sprite-sheet.js')
        },
        Physics: {
            RectPhysicsBody: require('./components/physics/rect-physics-body.js')
        },
        Shape: {
            Rectangle: require('./components/shape/rectangle.js')
        }
    },
    Entity: require('./entity.js'),
    Helper: require('./helper.js'),
    Helpers: {
        QuadTree: require('./helpers/quad-tree.js')
    },
    Keys: require('./keys.js'),
    Layer: require('./layer.js'),
    RenderSystem: require('./render-system.js'),
    System: require('./system.js'),
    Systems: {
        Behavior: {
            Animate: require('./systems/behavior/animate.js'),
            Physics: {
                Platformer: require('./systems/behavior/physics/platformer.js')
            }
        },
        Render: {
            ColoredRect: require('./systems/render/colored-rect.js'),
            Sprite: require('./systems/render/sprite.js')
        }
    },
    World: require('./world.js')
};