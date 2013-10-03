'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

/**
 * @desc        Used for keeping track of an animation cycle
 * @param       {Object}    options
 * @param       {Number}    [options.fps=24]             Frame per second
 * @param       {Number}    [options.minFrame=0]         First frame in the animation
 * @param       {Number}    [options.maxFrame=0]         Final frame in the animation
 * @param       {Number}    [options.currentFrame=0]     Current frame
 * @param       {Number}    [options.lastFrameTime]      Time since last frame
 * @constructor
 * @inherit     Component
 */
var Animation = function(options) {
    // Unique name for identifying in Entities
    this.NAME = 'Animation';

    var defaults = {
        fps: 24,
        minFrame: 0,
        maxFrame: 0,
        currentFrame: 0,
        lastFrameTime: 0
    };
    options = Helper.defaults(options, defaults);

    this.fps = options.fps;
    this.minFrame = options.minFrame;
    this.maxFrame = options.maxFrame;
    this.currentFrame = options.currentFrame;
    this.lastFrameTime = options.lastFrameTime;
};

Helper.inherit(Animation, Component);

/**
 * @desc    Updates and returns the current frame
 * @param   {Number} delta    Time since last update
 * @return  {Number}
 */
Animation.prototype.getFrame = function(delta) {
    this.lastFrameTime += delta;

    if (this.lastFrameTime > 1000 / this.fps) {
        this.lastFrameTime = 0;
        if (++this.currentFrame > this.maxFrame && this.maxFrame > -1) {
            this.currentFrame = this.minFrame;
        }
    }

    return this.currentFrame;
};

module.exports = Animation;