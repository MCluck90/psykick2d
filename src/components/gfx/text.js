'use strict';

var Helper = require('../../helper.js'),
    PIXI = require('pixi.js');

/**
 * Use for containing text information
 * @param {object}          options
 * @param {number}          [options.x=0]                           X position
 * @param {number}          [options.y=0]                           Y position
 * @param {string}          [options.text='']                       Text
 * @param {string}          [options.style.font='bold 24px Arial']  Font style
 * @param {string}          [options.style.fill='black']            Fill style
 * @param {string}          [options.style.align='left']            Alignment
 * @param {string|number}   [options.style.stroke]                  Fill style for the stroke
 * @param {number}          [options.style.strokeThickness=0]       Thickness of the stroke
 * @param {boolean}         [options.style.wordWrap=false]          If true, words will wrap around
 * @param {number}          [options.style.wordWrapWidth=100]       The width at which the text will wrap
 * @constructor
 * @extends {PIXI.Text}
 */
var Text = function(options) {
    this.NAME = 'Text';

    var defaults = {
        text: '',
        x: 0,
        y: 0,
        style: {}
    };
    options = Helper.defaults(options, defaults);
    this._text = options.text;
    PIXI.Text.call(this, options.text, options.style);
    this.x = options.x;
    this.y = options.y;
};

Helper.inherit(Text, PIXI.Text);

// Allow users to set text via property instead of PIXI.Text.setText
Object.defineProperty(Text.prototype, 'text', {
    get: function() {
        return this._text;
    },
    set: function(text) {
        this._text = text.toString() || ' ';
        this.dirty = true;
    }
});

module.exports = Text;