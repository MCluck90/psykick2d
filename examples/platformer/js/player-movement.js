'use strict';

var Helper = require('psykick2d').Helper,
    Keyboard = require('psykick2d').Input.Keyboard,
    Keys = require('psykick2d').Keys,
    BehaviorSystem = require('psykick2d').BehaviorSystem,
    AssetManager = require('psykick2d').AssetManager,

    RUN_SPEED = 8,
    JUMP_SPEED = 15,

    STATES = {
        STAND: 0,
        WALK: 1,
        JUMP: 2,
        FALL: 3,
        ATTACK: 4
    };

var PlayerMovement = function(player) {
    BehaviorSystem.call(this);
    this.player = player;
    this._prevState = this._states.stand;
    this._state = this._states.stand;

    // Initialize the standing state
    this._state.enter.call(this);
};

Helper.inherit(PlayerMovement, BehaviorSystem);

PlayerMovement.prototype._changeState = function(state, delta) {
    this._state.exit.call(this, delta);
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
    }
    this._state.enter.call(this, delta);
};

PlayerMovement.prototype.update = function(delta) {
    this._state.update.call(this, delta);
};

PlayerMovement.prototype._states = {
    stand: {
        enter: function() {
            var body = this.player.getComponent('RectPhysicsBody'),
                animation = this.player.getComponent('Animation');
            body.velocity.x = body.velocity.y = 0;
            // Make sure that the animation goes to the correct frame
            animation.fps = Number.MAX_VALUE;
            this.player.addComponent(this.player.getComponent('StandAnimation'));
        },
        update: function(delta) {
            var body = this.player.getComponent('RectPhysicsBody');
            if (Keyboard.isKeyDown(Keys.Left) || Keyboard.isKeyDown(Keys.Right)) {
                this._changeState(STATES.WALK, delta);
            } else if (Keyboard.isKeyDown(Keys.Up)) {
                this._changeState(STATES.JUMP, delta);
            } else if (Keyboard.isKeyDown(Keys.Space)) {
                this._changeState(STATES.ATTACK, delta);
            } else if (body.velocity.y > 0) {
                this._changeState(STATES.FALL, delta);
            }
        },
        exit: function() {}
    },
    walk: {
        enter: function() {
            var body = this.player.getComponent('RectPhysicsBody'),
                sprite = this.player.getComponent('Sprite');
            if (body.velocity.x > 0) {
                body.friction = 1.2;
            } else {
                body.friction = 0;
            }
            this.player.addComponent(this.player.getComponent('WalkAnimation'));

            if (Keyboard.isKeyDown(Keys.Left)) {
                sprite.pivot.x = 128;
                sprite.scale.x = -1;
            } else {
                sprite.pivot.x = 0;
                sprite.scale.x = 1;
            }
        },
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
                this._changeState(STATES.STAND, delta);
                return;
            } else {
                body.friction = 1;
            }

            if (Keyboard.isKeyDown(Keys.Up)) {
                this._changeState(STATES.JUMP, delta);
                return;
            }

            animation.fps = Math.abs(body.velocity.x) / 1.25;
        },
        exit: function(){}
    },
    jump: {
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
        update: function(delta) {
            var body = this.player.getComponent('RectPhysicsBody'),
                sprite = this.player.getComponent('Sprite');

            if (!Keyboard.isKeyDown(Keys.Up)) {
                body.velocity.y = 0;
            }
            if (Keyboard.isKeyDown(Keys.Left)) {
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
            }

            if (body.velocity.y >= 0) {
                this._changeState(STATES.FALL, delta);
            }
        },
        exit: function(){}
    },
    fall: {
        enter: function(){},
        update: function(delta) {
            var body = this.player.getComponent('RectPhysicsBody');
            if (body.velocity.y === 0) {
                if (body.velocity.x === 0) {
                    this._changeState(STATES.STAND, delta);
                } else {
                    this._changeState(STATES.WALK, delta);
                }
            }
        },
        exit: function() {
            this.player.getComponent('Animation').currentFrame = 0;
        }
    },
    attack: {
        enter: function(){},
        update: function(){},
        exit: function(){}
    }
};

/*
PlayerMovement.prototype.update = function(delta) {
    var body = this.player.getComponent('RectPhysicsBody'),
        sprite = this.player.getComponent('Sprite'),
        animation = this.player.getComponent('Animation'),

        upPressed = Keyboard.isKeyDown(Keys.Up),
        leftPressed = Keyboard.isKeyDown(Keys.Left),
        rightPressed = Keyboard.isKeyDown(Keys.Right),
        spacePressed = Keyboard.isKeyDown(Keys.Space);

    if (spacePressed) {
        this.player.addComponent(this.player.getComponent('AttackAnimation'));
    } else if (leftPressed) {
        if (body.velocity.x > 0) {
            body.friction = 1.2;
        } else {
            body.friction = 0;
        }
        this.player.addComponent(this.player.getComponent('WalkAnimation'));
        body.velocity.x -= RUN_SPEED * delta;
        if (body.velocity.x < -RUN_SPEED) {
            body.velocity.x = -RUN_SPEED;
        }
        sprite.pivot.x = 128;
        sprite.scale.x = -1;
    } else if (rightPressed) {
        if (body.velocity.x < 0) {
            body.friction = 1.2;
        } else {
            body.friction = 0;
        }
        this.player.addComponent(this.player.getComponent('WalkAnimation'));
        body.velocity.x += RUN_SPEED * delta;
        if (body.velocity.x > RUN_SPEED) {
            body.velocity.x = RUN_SPEED;
        }
        sprite.pivot.x = 0;
        sprite.scale.x = 1;
    } else {
        body.friction = 1;
    }

    if (spacePressed) {
        body.mass = 0;
        animation.fps = 24;
    } else {
        body.mass = 1;
        animation.fps = Math.abs(body.velocity.x) / 1.25;
    }

    if (upPressed && body.velocity.y === 0 && this.player.onGround && !this.player.jumped) {
        this.player.onGround = false;
        body.velocity.y = -JUMP_SPEED;
        this.player.jumped = true;
        this.player.addComponent(this.player.getComponent('WalkAnimation'));

    } else if (!upPressed && this.player.jumped) {
        this.player.jumped = false;
        if (body.velocity.y < 0) {
            body.velocity.y = 0;
        }
    }

    // If the player is against a wall, stop animating them
    if (Math.abs(body.velocity.x) <= RUN_SPEED * delta) {
        // Make sure that the animation goes to the correct frame
        animation.fps = Number.MAX_VALUE;
        this.player.addComponent(this.player.getComponent('StandAnimation'));
    }
    if (body.velocity.x === 0) {
        body.velocity.x = 0;
    }
};
*/

module.exports = PlayerMovement;