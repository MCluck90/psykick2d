'use strict';

var Helper = require('./helper.js'),
    Box2D = require('box2dweb');

var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2World = Box2D.Dynamics.b2World,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

/**
 * Creates a new instance of the Physics world
 * @param {Object} options
 * @constructor
 */
var Physics = function(options) {
    var defaults = {
        gravity: { x: 0, y: 9.8 },
        ignoreInactiveBodies: true,
        scale: 30,
        fps: 40,
        velocityIterations: 8,
        positionIterations: 3,
        enableDebugDraw: false,
        debugDrawContext: null
    };
    options = Helper.defaults(options, defaults);

    var gravity = new b2Vec2(options.gravity.x, options.gravity.y);

    this.world = new b2World(gravity, options.ignoreInactiveBodies);
    this.scale = options.scale;
    this.fps = options.fps;
    this.velocityIterations = options.velocityIterations;
    this.positionIterations = options.positionIterations;
    this.enableDebugDraw = options.enableDebugDraw;
    this.debugDraw = null;
    this.debugDrawContext = options.debugDrawContext;
    this.deltaRemaining = 0;
    this.bodyRemovalQueue = [];

    if (this.enableDebugDraw) {
        this.debugDraw = new b2DebugDraw();
        this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    }
};

/**
 * Updates the world
 * @param {number} delta    Amount of time since last update
 */
Physics.prototype.update = function(delta) {
    var bodiesToRemove = this.bodyRemovalQueue.length,
        stepAmount = 1 / this.fps;

    // Clear out any additional bodies before updating
    if (bodiesToRemove > 0) {
        for (var i = 0; i < bodiesToRemove; i++) {
            this.world.RemoveBody(this.bodyRemovalQueue[i]);
        }
    }

    this.deltaRemaining += delta;

    while (this.deltaRemaining > stepAmount) {
        this.deltaRemaining -= stepAmount;

        this.world.Step(stepAmount, this.velocityIterations, this.positionIterations);
    }
};

/**
 * Draws the world if debug mode is enabled
 */
Physics.prototype.draw = function() {
    if (!this.enableDebugDraw || this.debugDrawContext === null) {
        return;
    }

    if (this.debugDraw === null) {
        this.debugDraw = new b2DebugDraw();
        this.debugDraw.SetFillAlpha(0.3);
        this.debugDraw.SetLineThickness(1);
        this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    }

    this.debugDraw.SetSprite(this.debugDrawContext);
    this.debugDraw.SetDrawScale(this.scale);
    this.world.SetDebugDraw(this.debugDraw);
    this.world.DrawDebugData();
};

/**
 * Generates a new body and adds it to the world
 * @param {Object}                     [options={}]
 * @param {String}                     [options.shape='block']
 * @param {number}                     [options.width=5]
 * @param {number}                     [options.height=5]
 * @param {number}                     [options.radius=2.5]
 * @param {String}                     [options.type='static']
 * @param {number}                     [options.position.x=0]
 * @param {number}                     [options.position.y=0]
 * @param {number}                     [options.velocity.x=0]
 * @param {number}                     [options.velocity.y=0]
 * @param {number}                     [options.fixture.density=2]
 * @param {number}                     [options.fixture.friction=1]
 * @param {number}                     [options.fixture.restitution=0.2]
 * @param {Box2D.Common.Math.b2Vec2[]} [options.fixture.points=[]}
 * @param {boolean}                    [options.definition.active=true]
 * @param {boolean}                    [options.definition.allowSleep=true]
 * @param {number}                     [options.angle=0]
 * @param {number}                     [options.angularVelocity=0]
 * @param {boolean}                    [options.awake=true]
 * @param {boolean}                    [options.bullet=false]
 * @param {boolean}                    [options.fixedRotation=false]
 * @return {{
 *  definition: Box2D.Dynamics.b2BodyDef,
 *  fixtureDef: Box2D.Dynamics.b2FixtureDef,
 *  body: Box2D.Dynamics.b2Body
 * }}
 */
Physics.prototype.createBody = function(options) {
    var defaults = {
            shape: 'block',
            width: 10,
            height: 10,
            radius: 5,
            type: 'dynamic',
            position: { x: 0, y: 0 },
            velocity: { x: 0, y: 0 }
        },
        fixtureDefaults = {
            density: 2,
            friction: 1,
            restitution: 0.2,
            points: []
        },
        definitionDefaults = {
            active: true,
            allowSleep: true,
            angle: 0,
            angularVelocity: 0,
            awake: true,
            bullet: false,
            fixedRotation: false
        },
        newBody = {},
        key;
    options = Helper.defaults(options, defaults);
    options.fixture = Helper.defaults(options.fixture, fixtureDefaults);
    options.definition = Helper.defaults(options.definition, definitionDefaults);

    newBody.definition = new b2BodyDef();

    for (key in definitionDefaults) {
        newBody.definition[key] = options.definition[key] || definitionDefaults[key];
    }
    newBody.definition.position = new b2Vec2(options.position.x / this.scale, options.position.y / this.scale);
    newBody.definition.linearVelocity = new b2Vec2(options.velocity.x, options.velocity.y);
    newBody.definition.userData = newBody;
    newBody.definition.type = (options.type === 'static') ? b2Body.b2_staticBody :
                           (options.type === 'dynamic')   ? b2Body.b2_dynamicBody : b2Body.b2_kinematicBody;

    newBody.body = this.world.CreateBody(newBody.definition);

    newBody.fixtureDef = new b2FixtureDef();
    for (key in fixtureDefaults) {
        newBody.fixtureDef[key] = options.fixture[key] || fixtureDefaults[key];
    }

    switch (options.shape) {
        case 'circle':
            newBody.fixtureDef.shape = new b2CircleShape(options.radius / this.scale);
            break;

        case 'polygon':
            // Convert the points to match our scale
            for (var i = 0, len = options.points.length; i < len; i++) {
                var point = options.points[i];
                point.x /= this.scale;
                point.y /= this.scale;
                options.points[i] = point;
            }
            newBody.fixtureDef.shape = new b2PolygonShape();
            newBody.fixtureDef.shape.SetAsArray(options.points, options.points.length);
            break;

        case 'block':
            newBody.fixtureDef.shape = new b2PolygonShape();
            newBody.fixtureDef.shape.SetAsBox(options.width / 2 / this.scale, options.height / 2 / this.scale);
            break;

        default:
            throw new Error('Invalid fixture type given');
    }

    newBody.body.CreateFixture(newBody.fixtureDef);

    return newBody;
};

/**
 * Flags a body for removal on next update
 * @param {Box2D.Dynamics.b2Body} body
 */
Physics.prototype.removeBody = function(body) {
    if (this.bodyRemovalQueue.indexOf(body) === -1) {
        this.bodyRemovalQueue.push(body);
    }
};