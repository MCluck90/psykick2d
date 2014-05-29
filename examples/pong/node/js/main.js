'use strict';

var World = require('../../../../src/index.js').World,
    RectRenderSystem = require('../../../../src/index.js').Systems.Render.Rectangle,
    Rectangle = require('../../../../src/index.js').Components.Shapes.Rectangle,
    Text = require('../../../../src/index.js').Components.GFX.Text,
    TextSystem = require('../../../../src/index.js').Systems.Render.Text,

    CONSTANTS = require('./constants.js'),
    PlayerInputSystem = require('./player-input.js'),
    EnemyAISystem = require('./enemy-ai.js'),
    BallMovementSystem = require('./ball-movement.js'),
    Physics = require('./physics.js'),
    Score = require('./score.js');

/**
 * Returns a new paddle at a given position
 * @param {number} x    X position
 * @param {number} y    Y position
 * @returns {Entity}
 */
function createPaddle(x, y) {
    var halfGameWidth = CONSTANTS.GAME_WIDTH / 2,
        paddle = World.createEntity(),
        rect = new Rectangle({
            x: x,
            y: y,
            w: 30,
            h: 100,
            color: CONSTANTS.PADDLE_COLOR
        }),
        score = new Text({
            x: (x < halfGameWidth) ? halfGameWidth - 50 : halfGameWidth + 50,
            y: 10,
            text: 0,
            style: {
                font: CONSTANTS.SCORE_FONT,
                fill: CONSTANTS.SCORE_COLOR
            }
        });
    rect.velocity = {
        x: 0,
        y: 0
    };
    paddle.addComponent(rect);
    paddle.addComponentAs(rect, 'RectPhysicsBody');
    paddle.addComponent(score);
    return paddle;
}

/**
 * Creates a ball
 * @param {number} x    X position
 * @param {number} y    Y position
 * @returns {Entity}
 */
function createBall(x, y) {
    var xVelocity = Math.random(),
        yVelocity = 1 - xVelocity,
        ball = World.createEntity(),
        rect = new Rectangle({
            x: x,
            y: y,
            w: 10,
            h: 10,
            color: CONSTANTS.BALL_COLOR
        });
    rect.velocity = {
        x: xVelocity * CONSTANTS.BALL_SPEED,
        y: yVelocity * CONSTANTS.BALL_SPEED
    };
    ball.addComponent(rect);
    ball.addComponentAs(rect, 'RectPhysicsBody');
    return ball;
}

// Initialize the world
World.init({
    width: CONSTANTS.GAME_WIDTH,
    height: CONSTANTS.GAME_HEIGHT,
    backgroundColor: '#000'
});

// Generate the layer and main game objects
var layer = World.createLayer(),
    player = createPaddle(25, 50),
    enemy = createPaddle(745, 50),
    ball = createBall(CONSTANTS.GAME_WIDTH / 2 - 5, CONSTANTS.GAME_HEIGHT / 2 - 5),

    // Prepare the systems
    renderSystem = new RectRenderSystem(),
    textSystem = new TextSystem(),
    playerInputSystem = new PlayerInputSystem(player),
    enemyAISystem = new EnemyAISystem(enemy, ball),
    ballMovementSystem = new BallMovementSystem(ball),
    physicsSystem = new Physics(ball),
    scoreSystem = new Score(ball, player, enemy);

// Add main objects to the rendering system
renderSystem.addEntity(player);
renderSystem.addEntity(enemy);
renderSystem.addEntity(ball);

// Add the players' scores to a text rendering system
textSystem.addEntity(player);
textSystem.addEntity(enemy);

// Add additional physics bodies
physicsSystem.addEntity(player);
physicsSystem.addEntity(enemy);

// Add all the systems to the layer
layer.addSystem(renderSystem);
layer.addSystem(textSystem);
layer.addSystem(playerInputSystem);
layer.addSystem(enemyAISystem);
layer.addSystem(ballMovementSystem);
layer.addSystem(physicsSystem);
layer.addSystem(scoreSystem);

World.pushLayer(layer);