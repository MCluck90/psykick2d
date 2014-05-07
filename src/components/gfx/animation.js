'use strict';

var Helper = require('../../helper.js');

/**
 * Used for keeping track of an animation cycle
 * @param       {object}    [options]
 * @param       {number}    [options.fps=24]             Frame per second
 * @param       {number}    [options.minFrame=0]         First frame in the animation
 * @param       {number}    [options.maxFrame=0]         Final frame in the animation
 * @param       {number}    [options.currentFrame=0]     Current frame
 * @param       {number}    [options.lastFrameTime]      Time since last frame
 * @constructor
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

module.exports = Animation;