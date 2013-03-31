(function() {
    var b2Vec2 = Box2D.Common.Math.b2Vec2,
        b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2Fixture = Box2D.Dynamics.b2Fixture,
        b2World = Box2D.Dynamics.b2World,
        b2MassData = Box2D.Collision.Shapes.b2MassData,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
        b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

    Psykick.Physics = function(options) {
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
        options = Psykick.Helper.defaults(options, defaults);

        var gravity = new b2Vec2(options.gravity.x, options.gravity.y);

        this.World = new b2World(gravity, options.ignoreInactiveBodies);
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
            this.debugDraw.SetFillAlpha(0.3);
            this.debugDraw.SetLineThickness(1);
            this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        }
    };

    Psykick.Physics.prototype.update = function(delta) {
        var bodiesToRemove = this.bodyRemovalQueue.length,
            stepAmount = 1 / this.fps;

        // Clear out any additional bodies before updating
        if (bodiesToRemove > 0) {
            for (var i = 0; i < bodiesToRemove; i++) {
                this.World.RemoveBody(this.bodyRemovalQueue[i]);
            }
        }

        this.deltaRemaining += delta;

        while (this.deltaRemaining > stepAmount) {
            this.deltaRemaining -= stepAmount;

            this.World.Step(stepAmount, this.velocityIterations, this.positionIterations);
        }
    };

    Psykick.Physics.prototype.draw = function() {
        if (!this.enableDebugDraw) {
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
        this.World.SetDebugDraw(this.debugDraw);
    };

    /**
     * Generates a new body and adds it to the world
     * @param {Object}                     [options={}]
     * @param {String}                     [options.shape="block"]
     * @param {Number}                     [options.width=5]
     * @param {Number}                     [options.height=5]
     * @param {Number}                     [options.radius=2.5]
     * @param {String}                     [options.type="static"]
     * @param {Number}                     [options.position.x=0]
     * @param {Number}                     [options.position.y=0]
     * @param {Number}                     [options.velocity.x=0]
     * @param {Number}                     [options.velocity.y=0]
     * @param {Number}                     [options.fixture.density=2]
     * @param {Number}                     [options.fixture.friction=1]
     * @param {Number}                     [options.fixture.restitution=0.2]
     * @param {Box2D.Common.Math.b2Vec2[]} [options.fixture.points=[]}
     * @param {Boolean}                    [options.definition.active=true]
     * @param {Boolean}                    [options.definition.allowSleep=true]
     * @param {Number}                     [options.angle=0]
     * @param {Number}                     [options.angularVelocity=0]
     * @param {Boolean}                    [options.awake=true]
     * @param {Boolean}                    [options.bullet=false]
     * @param {Boolean}                    [options.fixedRotation=false]
     * @return {{
     *  definition: Box2D.Dynamics.b2BodyDef,
     *  fixtureDef: Box2D.Dynamics.b2FixtureDef,
     *  body: Box2D.Dynamics.b2Body
     * }}
     */
    Psykick.Physics.prototype.createBody = function(options) {
        var defaults = {
                shape: "block",
                width: 5,
                height: 5,
                radius: 2.5,
                type: "static",
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
            newBody = {};
        options = Psykick.Helper.defaults(options, defaults);
        options.fixture = Psykick.Helper.defaults(options.fixture, fixtureDefaults);
        options.definition = Psykick.Helper.defaults(options.definition, definitionDefaults);

        newBody.definition = new b2BodyDef();

        for (var key in definitionDefaults) {
            newBody.definition[key] = options.definition[key] || definitionDefaults[key];
        }
        newBody.definition.position = new b2Vec2(options.position.x, options.position.y);
        newBody.definition.linearVelocity = new b2Vec2(options.velocity.x, options.velocity.y);
        newBody.definition.userData = newBody;
        newBody.definition.type = (options.type === "static") ? b2Body.b2_staticBody :
                               (options.type === "dynamic")   ? b2Body.b2_dynamicBody : b2Body.b2_kinematicBody;

        newBody.body = this.World.CreateBody(newBody.definition);

        newBody.fixtureDef = new b2FixtureDef();
        for (var key in fixtureDefaults) {
            newBody.fixtureDef[key] = options.fixture[key] || fixtureDefaults[key];
        }

        switch (options.shape) {
            case "circle":
                newBody.fixtureDef.shape = new b2CircleShape(options.radius);
                break;

            case "polygon":
                newBody.fixtureDef.shape = new b2PolygonShape();
                newBody.fixtureDef.shape.SetAsArray(options.points, options.points.length);
                break;

            case "block":
            default:
                newBody.fixtureDef.shape = new b2PolygonShape();
                newBody.fixtureDef.shape.SetAsBox(options.width / 2, options.height / 2);
                break;
        }

        newBody.body.CreateFixture(newBody.fixtureDef);

        return newBody;
    };

    /**
     * Flags a body for removal on next update
     * @param {Box2D.Dynamics.b2Body} body
     */
    Psykick.Physics.prototype.removeBody = function(body) {
        if (this.bodyRemovalQueue.indexOf(body) === -1) {
            this.bodyRemovalQueue.push(body);
        }
    };

})();