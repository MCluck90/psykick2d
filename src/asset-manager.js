'use strict';

var Helper = require('./helper.js'),
    PIXI = require('pixi.js'),

    doc = (typeof document !== 'undefined') ? document : null,
    isClientSide = (doc !== null),

    // Local shortcuts
    audioManager = null,
    gfxManager = null,
    spriteSheetManager = null;

// Detect audio support
var audioEl = null,
    canPlayAudioType = {
        ogg: false,
        mp3: false,
        opus: false,
        wav: false,
        m4a: false
    };

if (isClientSide) {
    audioEl = doc.createElement('audio');

    // Logic here taken from Modernizr
    try {
        var noRegEx = /^no$/,
            m4aType = audioEl.canPlayType('audio/x-m4a;') || audioEl.canPlayType('audio/aac;');
        canPlayAudioType = {
            ogg:  audioEl.canPlayType('audio/ogg; codecs="vorbis"').replace(noRegEx, ''),
            mp3:  audioEl.canPlayType('audio/mpeg;')               .replace(noRegEx, ''),
            opus: audioEl.canPlayType('audio/ogg; codecs="opus"')  .replace(noRegEx, ''),
            wav:  audioEl.canPlayType('audio/wav; codes="1"')      .replace(noRegEx, ''),
            m4a:  m4aType                                          .replace(noRegEx, '')
        };
    } catch(e) {}
}

/**
 * Loads up an audio source
 * @param {string}      src
 * @param {Function}    cb  Callback for when it's ready
 * @private
 */
function _loadAudioSource(src, cb) {
    cb = cb || function(){};
    var audio = new Audio(src);
    audio.addEventListener('canplaythrough', function() {
        audio.loaded = true;
        cb(audio);
    });
    audioManager._cache[src] = audio;
}

/**
 * Loads up an image
 * @param {string}      src
 * @param {Function}    cb  Callback for when it's ready
 * @private
 */
function _loadGFXSource(src, cb) {
    cb = cb || function(){};
    var img = new Image();
    img.src = src;
    img.onload = function() {
        img.loaded = true;
        cb(img);
    };
    gfxManager._cache[src] = img;
}

var AssetManager = {
    Audio: {
        _cache: {},

        /**
         * Tells the user if they can play different types of audio
         * @returns {object}
         */
        get canPlayType() {
            return canPlayAudioType;
        },

        /**
         * Starts loading one or more audio sources
         * @param {string|string[]} sources Sources to load
         * @param {Function}        [cb]    Callback for when each source is loaded
         */
        load: function(sources, cb) {
            if (!Helper.isArray(sources)) {
                sources = [sources];
            }

            for (var i = 0, len = sources.length; i < len; i++) {
                _loadAudioSource(sources[i], cb);
            }
        },

        /**
         * Tells if an audio source has been loaded
         * @param {string} src
         * @returns {boolean}
         */
        isLoaded: function(src) {
            return (audioManager._cache[src]) ? audioManager._cache[src].loaded : false;
        },

        /**
         * Returns an audio element
         * @param {string} src
         * @returns {Audio|null}
         */
        getAudio: function(src) {
            return audioManager._cache[src] || null;
        }
    },
    GFX: {
        _cache: {},

        /**
         * Loads up one or more images
         * @param {string|string[]} sources Sources to load
         * @param {Function}        cb      Callback one each image as they're loaded
         */
        load: function(sources, cb) {
            if (!Helper.isArray(sources)) {
                sources = [sources];
            }

            for (var i = 0, len = sources.length; i < len; i++) {
                _loadGFXSource(sources[i], cb);
            }
        },

        /**
         * Determines if the given image is loaded
         * @param {string} src
         * @returns {boolean}
         */
        isLoaded: function(src) {
            return (gfxManager._cache[src]) ? gfxManager._cache[src].loaded : false;
        },

        /**
         * Gets an image
         * @param {string} src
         * @returns {Image|null}
         */
        getImage: function(src) {
            return gfxManager._cache[src] || null;
        }
    },
    SpriteSheet: {
        _listeners: [],

        /**
         * Loads one or more sprite sheets from JSON format
         * @param {string|string[]} spriteSheets
         */
        load: function(spriteSheets) {
            if (typeof spriteSheets === 'string') {
                spriteSheets = [spriteSheets];
            }

            var loader = new PIXI.AssetLoader(spriteSheets);
            loader.onComplete = function() {
                var listeners = spriteSheetManager._listeners;
                for (var i = 0, len = listeners.length; i < len; i++) {
                    listeners[i](spriteSheets);
                }
            };
            loader.load();
        },

        /**
         * Adds a listener for when sprite sheets finish loading
         * @param {function(string[])} callback  Passes back the sheets that were just loaded
         */
        addLoadListener: function(callback) {
            if (spriteSheetManager._listeners.indexOf(callback) === -1) {
                spriteSheetManager._listeners.push(callback);
            }
        },

        /**
         * Removes a listener
         * @param {function(string[])} callback
         */
        removeLoadListener: function(callback) {
            var index = spriteSheetManager._listeners.indexOf(callback);
            if (index !== -1) {
                spriteSheetManager._listeners.splice(index, 1);
            }
        },

        /**
         * Removes all load listeners
         */
        clearListeners: function() {
            spriteSheetManager._listeners = [];
        },

        /**
         * Returns a frame based on name
         * @param {string} name
         * @returns {Texture}
         */
        getFrame: function(name) {
            return PIXI.Texture.fromFrame(name);
        }
    }
};

// Assign our local shortcuts
audioManager = AssetManager.Audio;
gfxManager = AssetManager.GFX;
spriteSheetManager = AssetManager.SpriteSheet;

module.exports = AssetManager;