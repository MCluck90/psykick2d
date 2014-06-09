'use strict';

var Helper = require('../../helper.js');

/**
 * Used for keeping track of an animation cycle
 * @param       {object}                [options]
 * @param       {number}                [options.fps=24]            Frames per second
 * @param       {number}                [options.minFrame=0]        First frame in the animation
 * @param       {number}                [options.maxFrame=0]        Final frame in the animation
 * @param       {number}                [options.currentFrame=0]    Current frame
 * @param       {number}                [options.lastFrameTime]     Time since last frame
 * @param       {string[]|PIXI.Texture} [options.frames]            Frames used by sprite
 * @constructor
 */
var Animation = function(options) {
    this.NAME = 'Animation';

    var defaults = {
        fps: 24,
        minFrame: 0,
        maxFrame: 0,
        currentFrame: 0,
        lastFrameTime: 0,
        frames: []
    };
    options = Helper.defaults(options, defaults);

    this.fps = options.fps;
    this.minFrame = options.minFrame;
    this.maxFrame = options.maxFrame;
    this.currentFrame = options.currentFrame;
    this.lastFrameTime = options.lastFrameTime;
    this.frames = options.frames;
};

Object.defineProperty(Animation.prototype, 'frame', {
    get: function() {
        return this.frames[this.currentFrame];
    },
    set: function(name) {
        var index = this.frames.indexOf(name);
        if (index !== -1) {
            this.currentFrame = index;
        }
    }
});

module.exports = Animation;