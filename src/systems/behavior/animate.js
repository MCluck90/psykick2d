'use strict';

var Helper = require('../../helper.js'),
    BehaviorSystem = require('../../behavior-system.js');

/**
 * Updates animations
 *
 * @extends {BehaviorSystem}
 * @constructor
 */
var Animate = function() {
    BehaviorSystem.call(this);
    this.requiredComponents = ['Animation'];
};

Helper.inherit(Animate, BehaviorSystem);

/**
 * Updates the animations
 * @param {number} delta
 */
Animate.prototype.update = function(delta) {
    for (var i = 0, len = this.actionOrder.length; i < len; i++) {
        var entity = this.actionOrder[i],
            animation = entity.getComponent('Animation'),
            frameTime = 1 / animation.fps;
        animation.lastFrameTime += delta;
        if (animation.lastFrameTime > frameTime) {
            animation.lastFrameTime = 0;
            animation.currentFrame += 1;
            if (animation.currentFrame > animation.maxFrame) {
                animation.currentFrame = animation.minFrame;
            }
        }
    }
};

module.exports = Animate;