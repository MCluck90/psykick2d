'use strict';

var Helper = require('./helper.js');

var Screen = function(options) {
    var defaults = {
        name: '',
        init: function() {},
        onEnter: function() {},
        onExit: function() {},
        onDestroy: function() {}
    };
    options = Helper.defaults(options, defaults);

    if (options.name.length === 0) {
        throw new Error('Screen must be given a valid name.');
    }

    this.name = options.name;
    this.onEnter = options.onEnter;
    this.onExit = options.onExit;
    this.onDestroy = options.onDestroy;
};

module.exports = Screen;