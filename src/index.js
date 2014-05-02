module.exports = {
    BehaviorSystem: require('./behavior-system.js'),
    Camera: require('./camera.js'),
    Components: {
        GFX: {
            Animation: require('./components/gfx/animation.js'),
            Color: require('./components/gfx/color.js'),
            SpriteSheet: require('./components/gfx/sprite-sheet.js'),
            Sprite: require('./components/gfx/sprite.js'),
            Text: require('./components/gfx/text.js')
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
        CollisionGrid: require('./helpers/collision-grid.js'),
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
            Sprite: require('./systems/render/sprite.js'),
            Text: require('./systems/render/text.js')
        }
    },
    World: require('./world.js')
};