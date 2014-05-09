module.exports = {
    BehaviorSystem: require('./behavior-system.js'),
    Camera: require('./camera.js'),
    Components: {
        GFX: {
            Animation: require('./components/gfx/animation.js'),
            Color: require('./components/gfx/color.js'),
            Sprite: require('./components/gfx/sprite.js'),
            TiledSprite: require('./components/gfx/tiled-sprite.js')
        },
        Physics: {
            RectPhysicsBody: require('./components/physics/rect-physics-body.js')
        },
        Shape: require('./components/shape.js'),
        Shapes: {
            Circle: require('./components/shapes/circle.js'),
            Rectangle: require('./components/shapes/rectangle.js')
        }
    },
    Entity: require('./entity.js'),
    Helper: require('./helper.js'),
    Helpers: {
        CollisionGrid: require('./helpers/collision-grid.js'),
        QuadTree: require('./helpers/quad-tree.js')
    },
    Input: require('./input.js'),
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
            Rectangle: require('./systems/render/rectangle.js'),
            Shape: require('./systems/render/shape.js'),
            Sprite: require('./systems/render/sprite.js')
        }
    },
    World: require('./world.js')
};