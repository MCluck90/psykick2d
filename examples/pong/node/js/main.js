'use strict';

var World = require('../../../../src/index.js').World,
    RectRenderSystem = require('../../../../src/index.js').Systems.Render.Rectangle,
    Rectangle = require('../../../../src/index.js').Components.Shapes.Rectangle,

    PlayerInputSystem = require('./player-input.js'),
    EnemyAISystem = require('./enemy-ai.js'),
    BallMovementSystem = require('./ball-movement.js'),
    Physics = require('./physics.js');

/**
 * Returns a new paddle at a given position
 * @param {number} x    X position
 * @param {number} y    Y position
 * @returns {Entity}
 */
function createPaddle(x, y) {
    var paddle = World.createEntity(),
        rect = new Rectangle({
            x: x,
            y: y,
            w: 30,
            h: 100,
            color: 0xFFFFFF
        });
    rect.velocity = {
        x: 0,
        y: 0
    };
    paddle.addComponent(rect);
    paddle.addComponentAs(rect, 'RectPhysicsBody');
    return paddle;
}

function createBall(x, y) {
    var ball = World.createEntity(),
        rect = new Rectangle({
            x: x,
            y: y,
            w: 10,
            h: 10,
            color: 0xFFFFFF
        });
    rect.velocity = {
        x: 125,
        y: 75
    };
    ball.addComponent(rect);
    ball.addComponentAs(rect, 'RectPhysicsBody');
    return ball;
}

// Initialize the world
World.init({
    width: 800,
    height: 600,
    backgroundColor: '#000'
});

var layer = World.createLayer(),
    player = createPaddle(25, 50),
    enemy = createPaddle(745, 50),
    ball = createBall(395, 295),

    renderSystem = new RectRenderSystem(),
    playerInputSystem = new PlayerInputSystem(player),
    enemyAISystem = new EnemyAISystem(enemy, ball),
    ballMovementSystem = new BallMovementSystem(ball),
    physicsSystem = new Physics(ball);

renderSystem.addEntity(player);
renderSystem.addEntity(enemy);
renderSystem.addEntity(ball);

physicsSystem.addEntity(player);
physicsSystem.addEntity(enemy);

layer.addSystem(renderSystem);
layer.addSystem(playerInputSystem);
layer.addSystem(enemyAISystem);
layer.addSystem(ballMovementSystem);
layer.addSystem(physicsSystem);

World.pushLayer(layer);