(function(P2D, Game) {
    var Factory = {
        /**
         * Creates the player entity
         * @returns {Entity}
         */
        createPlayer: function() {
            var player = P2D.World.createEntity();
            player.addComponent(new P2D.Components.Shape.Rectangle({
                x: 100,
                y: 10,
                w: 64,
                h: 128
            }));
            player.addComponent(new P2D.Components.GFX.Color({
                colors: ['#F00']
            }));
            player.addComponent(new P2D.Components.Physics.RectPhysicsBody({
                x: 100,
                y: 10,
                w: 64,
                h: 128,
                mass: 3
            }));
            return player;
        },

        createGrass: function(x, y, width, height) {
            height = height || 70;
            var grass = P2D.World.createEntity();
            grass.addComponent(new P2D.Components.Physics.RectPhysicsBody({
                x: x,
                y: y,
                w: width,
                h: height
            }));
            grass.addComponent(new P2D.Components.Shape.Rectangle({
                x: x,
                y: y,
                w: width,
                h: height
            }));
            grass.addComponent(new P2D.Components.GFX.SpriteSheet({
                src: 'media/sprites/ground.png',
                xOffset: 6,
                yOffset: 0,
                frameWidth: 59,
                frameHeight: height,
                repeat: 'repeat-x'
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
            grass.addComponent(new P2D.Components.Shape.Rectangle({
                x: x,
                y: y,
                w: width,
                h: height
            }));
            grass.addComponent(new P2D.Components.GFX.SpriteSheet({
                src: 'media/sprites/ground.png',
                xOffset: xOffset,
                yOffset: 0,
                frameWidth: width,
                frameHeight: height,
                repeat: 'repeat-x'
            }));
            return grass;
        },

        createDirt: function(x, y, width, height) {
            var dirt = P2D.World.createEntity();
            dirt.addComponent(new P2D.Components.Shape.Rectangle({
                x: x,
                y: y,
                w: width,
                h: height
            }));
            dirt.addComponent(new P2D.Components.GFX.SpriteSheet({
                src: 'media/sprites/ground_dirt.png',
                xOffset: 6,
                yOffset: 5,
                frameWidth: 59,
                frameHeight: 60,
                repeat: 'repeat'
            }));
            return dirt;
        }
    };

    Game.Factory = Factory;
})(Psykick2D, window.Game = window.Game || {});