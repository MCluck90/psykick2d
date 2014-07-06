'use strict';

var Helper = require('psykick2d').Helper,
    Keyboard = require('psykick2d').Input.Keyboard,
    Keys = require('psykick2d').Keys,
    BehaviorSystem = require('psykick2d').BehaviorSystem,
    AssetManager = require('psykick2d').AssetManager,
    Factory = require('./factory.js'),

    RUN_SPEED = 8,
    JUMP_SPEED = 15,
    ATTACK_SPEED = 25,
    ATTACK_TIMEOUT = 1 / 4,
    ATTACK_COOLDOWN = 1,

    /**
     * Each of the players' states
     * @enum {number}
     */
    STATES = {
        STAND: 0,
        WALK: 1,
        JUMP: 2,
        FALL: 3,
        ATTACK: 4,
        DIE: 5
    };

/**
 * Controls the player and player interactions
 * @param {Entity} player
 * @param {Layer} layer
 * @constructor
 */
var PlayerMovement = function(player, layer) {
    BehaviorSystem.call(this);
    this.player = player;
    this.mainLayer = layer;
    this._prevState = this._states.stand;
    this._state = this._states.stand;
    this._attackTimeout = 0;
    this._attackCooldown = 0;
    this._flame = Factory.createFlames(0, 0);

    // Initialize the standing state
    this._state.enter.call(this);
};

Helper.inherit(PlayerMovement, BehaviorSystem);

/**
 * Changes the players' state
 * @param {STATES} state
 * @param {number} delta
 * @private
 */
PlayerMovement.prototype._changeState = function(state) {
    this._prevState = this._state;
    switch (state) {
        case STATES.STAND:
            this._state = this._states.stand;
            break;

        case STATES.WALK:
            this._state = this._states.walk;
            break;

        case STATES.JUMP:
            this._state = this._states.jump;
            break;

        case STATES.FALL:
            this._state = this._states.fall;
            break;

        case STATES.ATTACK:
            this._state = this._states.attack;
            break;

        case STATES.DIE:
            this._state = this._states.die;
            break;
    }
};

/**
 * Update the player
 * @param {number} delta
 */
PlayerMovement.prototype.update = function(delta) {
    this._attackCooldown -= delta;
    if (this._state !== this._prevState) {
        this._prevState.exit.call(this);
        this._state.enter.call(this);
        this._prevState = this._state;
    }
    this._state.update.call(this, delta);
};

/**
 * Set of all state handlers
 * Each state has an enter, update, and exit function
 * Enter is called when transitioning TO a state
 * Update is called DURING a state
 * Exit is called when transition OUT OF a state
 * @private
 */
PlayerMovement.prototype._states = {
    /**
     * The player is standing
     */
    stand: {
        /**
         * Set the standing animation and stop the player
         */
        enter: function() {
            var body = this.player.getComponent('RectPhysicsBody'),
                animation = this.player.getComponent('Animation');
            body.velocity.x = body.velocity.y = 0;
            // Make sure that the animation goes to the correct frame
            animation.fps = Number.MAX_VALUE;
            this.player.addComponent(this.player.getComponent('StandAnimation'));
        },

        /**
         * Transition to walking, jumping, attacking or falling
         */
        update: function() {
            var body = this.player.getComponent('RectPhysicsBody');
            if (Keyboard.isKeyDown(Keys.Left) || Keyboard.isKeyDown(Keys.Right)) {
                this._changeState(STATES.WALK);
            } else if (Keyboard.isKeyDown(Keys.Up)) {
                this._changeState(STATES.JUMP);
            } else if (Keyboard.isKeyDown(Keys.Space) && this._attackCooldown <= 0) {
                this._changeState(STATES.ATTACK);
            } else if (body.velocity.y > 0) {
                this._changeState(STATES.FALL);
            }
        },
        exit: function() {}
    },
    walk: {
        /**
         * Change to the walking sprite
         */
        enter: function() {
            var body = this.player.getComponent('RectPhysicsBody'),
                sprite = this.player.getComponent('Sprite');

            // Apply a sliding effect
            if (body.velocity.x > 0) {
                body.friction = 1.2;
            } else {
                body.friction = 0;
            }
            this.player.addComponent(this.player.getComponent('WalkAnimation'));

            if (Keyboard.isKeyDown(Keys.Left)) {
                sprite.pivot.x = 128;
                sprite.scale.x = -1;
            } else if (Keyboard.isKeyDown(Keys.Right)) {
                sprite.pivot.x = 0;
                sprite.scale.x = 1;
            }
        },
        /**
         * Move the player to the left or right
         * @param {number} delta
         */
        update: function(delta) {
            var body = this.player.getComponent('RectPhysicsBody'),
                sprite = this.player.getComponent('Sprite'),
                animation = this.player.getComponent('Animation');
            if (Keyboard.isKeyDown(Keys.Left)) {
                // Add a slide and flip the sprite
                if (body.velocity.x > 0) {
                    body.friction = 1.2;
                    sprite.pivot.x = 128;
                    sprite.scale.x = -1;
                } else {
                    body.friction = 0;
                }
                body.velocity.x -= RUN_SPEED * delta;
                if (body.velocity.x < -RUN_SPEED) {
                    body.velocity.x = -RUN_SPEED;
                }
            } else if (Keyboard.isKeyDown(Keys.Right)) {
                if (body.velocity.x < 0) {
                    body.friction = 1.2;
                    sprite.pivot.x = 0;
                    sprite.scale.x = 1;
                } else {
                    body.friction = 0;
                }
                body.velocity.x += RUN_SPEED * delta;
                if (body.velocity.x > RUN_SPEED) {
                    body.velocity.x = RUN_SPEED;
                }
            } else if (Math.abs(body.velocity.x) <= RUN_SPEED * delta) {
                // If we slowed down enough from friction, come to a stop
                this._changeState(STATES.STAND);
                return;
            } else {
                body.friction = 1;
            }

            if (body.velocity.y > 0) {
                this._changeState(STATES.FALL);
                return;
            }

            // Allow the player to attack or jump
            if (Keyboard.isKeyDown(Keys.Up)) {
                this._changeState(STATES.JUMP);
                return;
            } else if (Keyboard.isKeyDown(Keys.Space) && this._attackCooldown <= 0) {
                this._changeState(STATES.ATTACK);
                return;
            }

            // Animate the sprite faster as we move faster
            animation.fps = Math.abs(body.velocity.x) / 1.25;
        },
        exit: function(){}
    },
    jump: {
        /**
         * Change to the "jumping animation"
         * and start the jump
         */
        enter: function() {
            this.player.addComponent(this.player.getComponent('WalkAnimation'));
            var animation = this.player.getComponent('Animation'),
                sprite = this.player.getComponent('Sprite'),
                body = this.player.getComponent('RectPhysicsBody');
            animation.fps = 0;
            sprite.setTexture(AssetManager.SpriteSheet.getFrame('player-walk3'));
            body.velocity.y = -JUMP_SPEED;
            body.friction = 0;
        },

        /**
         *
         * @param {number} delta
         */
        update: function(delta) {
            var body = this.player.getComponent('RectPhysicsBody'),
                sprite = this.player.getComponent('Sprite');

            // Start falling if the player releases up
            if (!Keyboard.isKeyDown(Keys.Up)) {
                body.velocity.y = 0;
            }

            // Allow us to attack
            if (Keyboard.isKeyDown(Keys.Space) && this._attackCooldown <= 0) {
                this._changeState(STATES.ATTACK);
                return;
            }

            // Enable in air movement
            if (Keyboard.isKeyDown(Keys.Left)) {
                if (body.velocity.x > 0) {
                    sprite.pivot.x = 128;
                    sprite.scale.x = -1;
                }

                // Don't accelerate as quickly as normal
                body.velocity.x -= RUN_SPEED * 0.8 * delta;
                if (body.velocity.x < -RUN_SPEED) {
                    body.velocity.x = -RUN_SPEED;
                }
            } else if (Keyboard.isKeyDown(Keys.Right)) {
                if (body.velocity.x < 0) {
                    sprite.pivot.x = 0;
                    sprite.scale.x = 1;
                }

                body.velocity.x += RUN_SPEED * 0.8 * delta;
                if (body.velocity.x > RUN_SPEED) {
                    body.velocity.x = RUN_SPEED;
                }
            }

            if (body.velocity.y >= 0) {
                this._changeState(STATES.FALL);
            }
        },
        exit: function(){}
    },
    fall: {
        enter: function() {},
        update: function(delta) {
            var body = this.player.getComponent('RectPhysicsBody'),
                sprite = this.player.getComponent('Sprite');

            // Landed, change to standing or walking
            if (body.velocity.y === 0) {
                if (body.velocity.x === 0) {
                    this._changeState(STATES.STAND);
                } else {
                    this._changeState(STATES.WALK);
                }
            } else if (this._attackCooldown <= 0 && Keyboard.isKeyDown(Keys.Space)) {
                // Attack in mid-fall
                this._changeState(STATES.ATTACK);
            } else if (Keyboard.isKeyDown(Keys.Left)) {
                // Do aerial movement like when jumping
                if (body.velocity.x > 0) {
                    sprite.pivot.x = 128;
                    sprite.scale.x = -1;
                }

                body.velocity.x -= RUN_SPEED * 0.8 * delta;
                if (body.velocity.x < -RUN_SPEED) {
                    body.velocity.x = -RUN_SPEED;
                }
            } else if (Keyboard.isKeyDown(Keys.Right)) {
                if (body.velocity.x < 0) {
                    sprite.pivot.x = 0;
                    sprite.scale.x = 1;
                }

                body.velocity.x += RUN_SPEED * 0.8 * delta;
                if (body.velocity.x > RUN_SPEED) {
                    body.velocity.x = RUN_SPEED;
                }
            } else if (body.y > 600) {
                this._changeState(STATES.DIE);
            }
        },
        exit: function() {
            // Reset to the correct animation frame
            //this.player.getComponent('Animation').currentFrame = 0;
        }
    },
    attack: {
        /**
         * Change to the attack animation and rocket forward
         */
        enter: function() {
            var animation = this.player.getComponent('AttackAnimation'),
                body = this.player.getComponent('RectPhysicsBody'),
                sprite = this.player.getComponent('Sprite');
            animation.fps = 24;
            this.player.addComponent(animation);
            body.velocity.y = 0;
            body.friction = 0;
            // Remove gravity
            body.mass = 0;

            // Which way are we going?
            var movingLeft = (Keyboard.isKeyDown(Keys.Left)),
                movingRight = (Keyboard.isKeyDown(Keys.Right));

            if (!movingLeft && !movingRight) {
                movingLeft = (sprite.scale.x === -1);
            }

            if (movingLeft) {
                body.velocity.x = -ATTACK_SPEED;
                sprite.scale.x = -1;
                sprite.pivot.x = 128;
            } else {
                body.velocity.x = ATTACK_SPEED;
                sprite.scale.x = 1;
                sprite.pivot.x = 0;
            }

            // Setup the timeout
            this._attackTimeout = ATTACK_TIMEOUT;

            // Add the flame effect
            var flameSprite = this._flame.getComponent('Sprite'),
                flameWidth = Math.abs(flameSprite.width);
            flameSprite.y = body.y + body.height / 2 - flameSprite.height / 4;
            if (sprite.scale.x === 1) {
                flameSprite.pivot.x = 0;
                flameSprite.scale.x = 1;
                flameSprite.x = body.x - flameWidth;
            } else {
                flameSprite.pivot.x = flameWidth;
                flameSprite.scale.x = -1;
                flameSprite.x = body.x + Math.abs(body.width) + flameWidth / 4;
            }

            this._flame.getComponent('RectPhysicsBody').velocity = body.velocity;
            this.mainLayer.addEntity(this._flame);
        },
        update: function(delta) {
            // Make sure we keep pace after hitting an enemy
            var sprite = this.player.getComponent('Sprite'),
                body = this.player.getComponent('RectPhysicsBody');
            if (sprite.scale.x === 1) {
                body.velocity.x = ATTACK_SPEED;
            } else {
                body.velocity.x = -ATTACK_SPEED;
            }

            // Keep attacking until the timeout is over
            this._attackCooldown = ATTACK_COOLDOWN;
            this._attackTimeout -= delta;
            if (this._attackTimeout <= 0) {
                this._attackTimeout = 0;
                this._changeState(STATES.FALL);
            }
        },
        exit: function() {
            // Remove the flames
            this.mainLayer.removeEntity(this._flame);

            // Change to a falling sprite and apply gravity
            var body = this.player.getComponent('RectPhysicsBody'),
                animation = this.player.getComponent('WalkAnimation'),
                sprite = this.player.getComponent('Sprite');
            animation.fps = 0;
            sprite.setTexture(AssetManager.SpriteSheet.getFrame('player-walk3'));
            this.player.addComponent(animation);
            body.mass = 1;

            // Allow the player to keep momentum
            if (Keyboard.isKeyDown(Keys.Left)) {
                body.velocity.x = -RUN_SPEED;
            } else if (Keyboard.isKeyDown(Keys.Right)) {
                body.velocity.x = RUN_SPEED;
            } else {
                // Or come to a complete stop
                body.velocity.x = 0;
            }

        }
    },
    die: {
        enter: function() {
            var body = this.player.getComponent('RectPhysicsBody'),
                sprite = this.player.getComponent('Sprite'),
                animation = this.player.getComponent('Animation');
            sprite.scale.y = -1;
            body.velocity.x = 0;
            body.velocity.y = -JUMP_SPEED * 2;
            body.mass = 5;
            body.solid = false;
            animation.fps = 0;
        },
        update: function() {
            var body = this.player.getComponent('RectPhysicsBody');
            if (body.y > 800) {
                this._changeState(STATES.FALL);
            }
        },
        exit: function() {
            var body = this.player.getComponent('RectPhysicsBody'),
                sprite = this.player.getComponent('Sprite');
            sprite.scale.y = 1;
            sprite.scale.x = 1;
            sprite.pivot.x = 0;
            body.mass = 1;
            body.solid = true;
            body.velocity.y = 0;
            body.x = 400;
            body.y = 450;
        }
    }
};

PlayerMovement.prototype.onEnemyCollision = function(enemy) {
    if (this._state === this._states.attack) {
        var renderSystems = this.mainLayer.renderSystems,
            behaviorSystems = this.mainLayer.behaviorSystems,
            numOfRenderSystems = renderSystems.length,
            numOfBehaviorSystems = behaviorSystems.length,
            len = Math.max(numOfBehaviorSystems, numOfRenderSystems);

        for (var i = 0; i < len; i++) {
            if (i < numOfBehaviorSystems) {
                behaviorSystems[i].safeRemoveEntity(enemy);
            }
            if (i < numOfRenderSystems) {
                renderSystems[i].safeRemoveEntity(enemy);
            }
        }

        // "Fix" the stoppage caused by the physics system
        var body = this.player.getComponent('RectPhysicsBody');
        body.velocity.x = ATTACK_SPEED;
        if (this.player.getComponent('Sprite').scale.x === -1) {
            body.velocity.x *= -1;
        }
    } else if (this._state !== this._states.die) {
        this._changeState(STATES.DIE);
    }
};

module.exports = PlayerMovement;