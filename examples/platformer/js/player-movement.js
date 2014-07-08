'use strict';

var Helper = require('psykick2d').Helper,
    Keyboard = require('psykick2d').Input.Keyboard,
    Keys = require('psykick2d').Keys,
    BehaviorSystem = require('psykick2d').BehaviorSystem,
    AssetManager = require('psykick2d').AssetManager,
    Factory = require('./factory.js'),
    CONSTANTS = require('./constants.js'),

    /**
     * Each of the players' states
     * @enum {number}
     */
    STATES = {
        STAND: 'stand',
        WALK: 'walk',
        JUMP: 'jump',
        FALL: 'fall',
        ATTACK: 'attack',
        DIE: 'die'
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
    // Track which state the player is in (standing, walking, etc.)
    this._prevState = this._states.stand;
    this._state = this._states.stand;

    // Used for determining when the player can attack and how long it will last
    this._attackTimeout = 0;
    this._attackCooldown = 0;

    // Create a flame for when the player attacks
    this._flame = Factory.createFlames(0, 0);

    // Initialize the standing state
    this._states.stand.enter.call(this);
};

Helper.inherit(PlayerMovement, BehaviorSystem);

/**
 * Changes the players' state
 * @param {STATES} state
 * @private
 */
PlayerMovement.prototype._changeState = function(state) {
    this._prevState = this._state;
    this._state = this._states[state];
};

/**
 * Update the player based on their state
 * @param {number} delta
 */
PlayerMovement.prototype.update = function(delta) {
    // Reduce the time needed before the player can attack again
    this._attackCooldown -= delta;

    // If they changed state, exit the previous one and enter the current one
    if (this._state !== this._prevState) {
        this._prevState.exit.call(this);
        this._state.enter.call(this);
        this._prevState = this._state;
    }

    // Update the player
    this._state.update.call(this, delta);

    // See if the player died
    var body = this.player.getComponent('RectPhysicsBody');
    if (this._prevState !== this._states.die && body.y > 600) {
        this._changeState(STATES.DIE);
    }
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
         * Change to the walking state
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

            // Change to the walking animation
            this.player.addComponent(this.player.getComponent('WalkAnimation'));

            // Flip the sprite depending on if the player is pressing left or right
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

                // Increase the running speed to the left
                body.velocity.x -= CONSTANTS.PLAYER.RUN_SPEED * delta;

                // Cap it at the maximum running speed
                if (body.velocity.x < -CONSTANTS.PLAYER.RUN_SPEED) {
                    body.velocity.x = -CONSTANTS.PLAYER.RUN_SPEED;
                }
            } else if (Keyboard.isKeyDown(Keys.Right)) {
                // Add a slide and flip the sprite to the right
                if (body.velocity.x < 0) {
                    body.friction = 1.2;
                    sprite.pivot.x = 0;
                    sprite.scale.x = 1;
                } else {
                    body.friction = 0;
                }

                // Increase the speed to the right
                body.velocity.x += CONSTANTS.PLAYER.RUN_SPEED * delta;

                // Cap it at the maximum running speed
                if (body.velocity.x > CONSTANTS.PLAYER.RUN_SPEED) {
                    body.velocity.x = CONSTANTS.PLAYER.RUN_SPEED;
                }
            } else if (Math.abs(body.velocity.x) <= CONSTANTS.PLAYER.RUN_SPEED * delta) {
                // If we slowed down enough from friction, come to a stop
                this._changeState(STATES.STAND);
            } else {
                // Apply friction so the player slows down when they're not pressing anything
                body.friction = 1;
            }

            // If the player is falling, then transition to falling
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
            // Move to the frame where the players' legs are extended
            sprite.setTexture(AssetManager.SpriteSheet.getFrame('player-walk3'));
            body.velocity.y = -CONSTANTS.PLAYER.JUMP_SPEED;
            body.friction = 0;
        },

        /**
         * Allow the player to stay in control in the air
         * @param {number} delta
         */
        update: function(delta) {
            var body = this.player.getComponent('RectPhysicsBody'),
                sprite = this.player.getComponent('Sprite');

            // Start falling if the player releases up
            if (!Keyboard.isKeyDown(Keys.Up)) {
                body.velocity.y = 0;
            }

            // Allow the player to attack
            if (Keyboard.isKeyDown(Keys.Space) && this._attackCooldown <= 0) {
                this._changeState(STATES.ATTACK);
                return;
            }

            // Move in mid-air
            if (Keyboard.isKeyDown(Keys.Left)) {
                // Flip the sprite to the left
                if (body.velocity.x > 0) {
                    sprite.pivot.x = 128;
                    sprite.scale.x = -1;
                }

                // Don't accelerate as quickly in the air
                body.velocity.x -= CONSTANTS.PLAYER.RUN_SPEED * 0.8 * delta;
                if (body.velocity.x < -CONSTANTS.PLAYER.RUN_SPEED) {
                    body.velocity.x = -CONSTANTS.PLAYER.RUN_SPEED;
                }
            } else if (Keyboard.isKeyDown(Keys.Right)) {
                // Flip the sprite to the right
                if (body.velocity.x < 0) {
                    sprite.pivot.x = 0;
                    sprite.scale.x = 1;
                }

                // Accelerate the player
                body.velocity.x += CONSTANTS.PLAYER.RUN_SPEED * 0.8 * delta;
                if (body.velocity.x > CONSTANTS.PLAYER.RUN_SPEED) {
                    body.velocity.x = CONSTANTS.PLAYER.RUN_SPEED;
                }
            }

            // If the player isn't going up anymore, they must be falling
            if (body.velocity.y >= 0) {
                this._changeState(STATES.FALL);
            }
        },
        exit: function(){}
    },

    fall: {
        enter: function() {},

        /**
         * Control the player when they're falling
         * @param {number} delta
         */
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

                body.velocity.x -= CONSTANTS.PLAYER.RUN_SPEED * 0.8 * delta;
                if (body.velocity.x < -CONSTANTS.PLAYER.RUN_SPEED) {
                    body.velocity.x = -CONSTANTS.PLAYER.RUN_SPEED;
                }
            } else if (Keyboard.isKeyDown(Keys.Right)) {
                if (body.velocity.x < 0) {
                    sprite.pivot.x = 0;
                    sprite.scale.x = 1;
                }

                body.velocity.x += CONSTANTS.PLAYER.RUN_SPEED * 0.8 * delta;
                if (body.velocity.x > CONSTANTS.PLAYER.RUN_SPEED) {
                    body.velocity.x = CONSTANTS.PLAYER.RUN_SPEED;
                }
            }
        },
        exit: function() {}
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

            // Remove gravity so the player doesn't fall
            body.mass = 0;

            // Which way are we going?
            var movingLeft = (Keyboard.isKeyDown(Keys.Left)),
                movingRight = (Keyboard.isKeyDown(Keys.Right));

            if (!movingLeft && !movingRight) {
                movingLeft = (sprite.scale.x === -1);
            }

            if (movingLeft) {
                // Move to the left and make sure the sprite is pointing left
                body.velocity.x = -CONSTANTS.PLAYER.ATTACK_SPEED;
                sprite.scale.x = -1;
                sprite.pivot.x = 128;
            } else {
                // Go to the right
                body.velocity.x = CONSTANTS.PLAYER.ATTACK_SPEED;
                sprite.scale.x = 1;
                sprite.pivot.x = 0;
            }

            // Setup how long the attack will last
            this._attackTimeout = CONSTANTS.PLAYER.ATTACK_TIMEOUT;

            // Add the flame effect
            var flameSprite = this._flame.getComponent('Sprite'),
                flameWidth = Math.abs(flameSprite.width);
            flameSprite.y = body.y + body.height / 2 - flameSprite.height / 4;

            if (sprite.scale.x === 1) {
                // "Attach" the flames to the left end
                flameSprite.pivot.x = 0;
                flameSprite.scale.x = 1;
                flameSprite.x = body.x - flameWidth;
            } else {
                // "Attach" the flames to the right end
                flameSprite.pivot.x = flameWidth;
                flameSprite.scale.x = -1;
                flameSprite.x = body.x + Math.abs(body.width) + flameWidth / 4;
            }

            // Set the flames in motion and add them to the systems
            this._flame.getComponent('RectPhysicsBody').velocity = body.velocity;
            this.mainLayer.addEntity(this._flame);
        },

        /**
         * Keep attacking!
         * @param {number} delta
         */
        update: function(delta) {
            // Keep attacking until the timeout is over
            this._attackCooldown = CONSTANTS.PLAYER.ATTACK_COOLDOWN;
            this._attackTimeout -= delta;
            if (this._attackTimeout <= 0) {
                this._attackTimeout = 0;
                this._changeState(STATES.FALL);
            }
        },

        /**
         * Clean up the flames and transition out of attacking
         */
        exit: function() {
            // Remove the flames
            this.mainLayer.removeEntity(this._flame);

            // Change to a falling sprite and apply gravity
            var body = this.player.getComponent('RectPhysicsBody'),
                animation = this.player.getComponent('WalkAnimation'),
                sprite = this.player.getComponent('Sprite');
            animation.fps = 0;

            // Set it to the falling frame
            sprite.setTexture(AssetManager.SpriteSheet.getFrame('player-walk3'));
            this.player.addComponent(animation);
            body.mass = 1;

            // Allow the player to keep momentum
            if (Keyboard.isKeyDown(Keys.Left)) {
                body.velocity.x = -CONSTANTS.PLAYER.RUN_SPEED;
            } else if (Keyboard.isKeyDown(Keys.Right)) {
                body.velocity.x = CONSTANTS.PLAYER.RUN_SPEED;
            } else {
                // Or come to a complete stop
                body.velocity.x = 0;
            }

        }
    },

    die: {
        /**
         * Apply a dying animation of sorts
         */
        enter: function() {
            var body = this.player.getComponent('RectPhysicsBody'),
                sprite = this.player.getComponent('Sprite'),
                animation = this.player.getComponent('Animation');

            // Flip the player upside down,
            sprite.scale.y = -1;
            body.velocity.x = 0;
            // launch them up,
            body.velocity.y = -CONSTANTS.PLAYER.JUMP_SPEED * 2;

            // and drag them down
            body.mass = 5;

            // Make sure the player falls through platforms
            body.solid = false;
            animation.fps = 0;
        },

        /**
         * Keep falling until the player falls below the bottom of the screen
         */
        update: function() {
            var body = this.player.getComponent('RectPhysicsBody');
            if (body.y > CONSTANTS.SCREEN_HEIGHT * 1.5) {
                this._changeState(STATES.FALL);
            }
        },

        /**
         * Return to the beginning of the game
         */
        exit: function() {
            var body = this.player.getComponent('RectPhysicsBody'),
                sprite = this.player.getComponent('Sprite');
            sprite.scale.y = 1;
            sprite.scale.x = 1;
            sprite.pivot.x = 0;
            body.mass = 1;
            body.solid = true;
            // Do this to avoid going to a "stand" state
            body.velocity.y = 1e-7;
            body.x = 400;
            body.y = 450;
        }
    }
};

/**
 * Called whenever the player collides with an enemy
 * @param {Entity} enemy
 */
PlayerMovement.prototype.onEnemyCollision = function(enemy) {
    if (this._state === this._states.attack) {
        // If the player is attacking, kill the enemy
        this.mainLayer.safeRemoveEntity(enemy);
    } else if (this._state !== this._states.die) {
        // If the player wasn't attacking, kill them
        this._changeState(STATES.DIE);
    }
};

module.exports = PlayerMovement;