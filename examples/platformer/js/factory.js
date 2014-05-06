(function(P2D, Game) {
    var Factory = {
        /**
         * Creates the player entity
         * @returns {Entity}
         */
        createPlayer: function() {
            var player = P2D.World.createEntity(),
                rect = new P2D.Components.Shapes.Rectangle({
                    color: 0xFF0000,
                    x: 100,
                    y: 10,
                    width: 64,
                    height: 128
                });
            rect.mass = 3;
            rect.velocity = { x: 0, y: 0 };
            player.addComponent(rect);
            player.addComponentAs(rect, 'RectPhysicsBody');
            return player;
        },

        createGrass: function(x, y, width, height) {
            height = height || 70;
            var grass = P2D.World.createEntity(),
                bodyComponent = new P2D.Components.Physics.RectPhysicsBody({
                    x: x,
                    y: y,
                    w: width,
                    h: height
                });
            grass.addComponent(bodyComponent);
            grass.addComponent(new P2D.Components.GFX.Sprite({
                src: 'media/sprites/ground.png',
                position: {
                    x: x,
                    y: y
                }
            }));
            return grass;
        },

        createGrassSide: function(x, y, left) {
            var xOffset = (left) ? 0 : 35,
                width = 35,
                height = 70;
            var grass = P2D.World.createEntity();
            grass.addComponent(new P2D.Components.Physics.RectPhysicsBody({
                x: x,
                y: y,
                w: width,
                h: height
            }));
            grass.addComponent(new P2D.Components.Shapes.Rectangle({
                x: x,
                y: y,
                w: width,
                h: height
            }));
            grass.addComponent(new P2D.Components.GFX.Sprite({
                src: 'media/sprites/ground.png'
            }));
            return grass;
        },

        createDirt: function(x, y, width, height) {
            var dirt = P2D.World.createEntity();
            dirt.addComponent(new P2D.Components.Shapes.Rectangle({
                x: x,
                y: y,
                w: width,
                h: height
            }));
            dirt.addComponent(new P2D.Components.GFX.Sprite({
                src: 'media/sprites/ground_dirt.png',
                position: {
                    x: x,
                    y: y
                }
            }));
            return dirt;
        }
    };

    Game.Factory = Factory;
})(Psykick2D, window.Game = window.Game || {});