(function() {
    "use strict";

    /**
     * Defines a sprite sheet
     *
     * @param {Object} options
     * @param {String} [options.src=null]       Path to the image
     * @param {Number} [options.width=0]        Width of the sprite sheet
     * @param {Number} [options.height=0]       Height of the sprite sheet
     * @param {Number} [options.frameWidth=0]   Width of the individual frames
     * @param {Number} [options.frameHeight=0]  Height of the individual frames
     * @param {Number} [options.xOffset=0]      Initial x offset
     * @param {Number} [options.yOffset=0]      Initial y offset
     * @constructor
     */
    Psykick.Components.SpriteSheet = function(options) {
        // Unique name for reference in Entities
        this.Name = "SpriteSheet";

        var self = this,
            defaults = {
                src: null,
                width: 0,
                height: 0,
                frameWidth: 0,
                frameHeight: 0,
                xOffset: 0,
                yOffset: 0
            };

        options = Psykick.Helper.defaults(options, defaults);
        this.img = new Image();
        this.img.src = options.src;
        this.img.width = options.width;
        this.img.height = options.height;
        this.frameWidth = options.frameWidth;
        this.frameHeight = options.frameHeight;
        this.xOffset = options.xOffset;
        this.yOffset = options.yOffset;

        // Flag when the image has been loaded
        this.loaded = false;
        this.img.onload = function() {
            self.loaded = true;
        };
    };

    // Inherit from Psykick.Component
    Psykick.Components.SpriteSheet.prototype = new Psykick.Component();
    Psykick.Components.SpriteSheet.constructor = Psykick.Components.SpriteSheet;

    /**
     * Returns the width of the sheet
     *
     * @return {Number}
     */
    Psykick.Components.SpriteSheet.prototype.getWidth = function() {
        return this.img.width;
    };

    /**
     * Returns the height of the sheet
     *
     * @return {Number}
     */
    Psykick.Components.SpriteSheet.prototype.getHeight = function() {
        return this.img.height;
    };

    /**
     * Sets the width of the sheet
     *
     * @param {Number} width
     */
    Psykick.Components.SpriteSheet.prototype.setWidth = function(width) {
        this.img.width = width;
    };

    /**
     * Sets the height of the sheet
     *
     * @param {Number} height
     */
    Psykick.Components.SpriteSheet.prototype.setHeight = function(height) {
        this.img.height = height;
    };

    /**
     * Changes the sheet image
     *
     * @param {String} path
     */
    Psykick.Components.SpriteSheet.prototype.changeImage = function(path) {
        this.img.src = path;
    };

    /**
     * Returns the offset for a given frame
     *
     * @param {Number}  [frameX=0]
     * @param {Number}  [frameY=0]
     * @return {{x:Number, y:Number}}
     */
    Psykick.Components.SpriteSheet.prototype.getOffset = function(frameX, frameY) {
        if (this.img.src === null) {
            return null;
        }

        frameX = frameX || 0;
        frameY = frameY || 0;

        var offsetX = (this.frameWidth * frameX) + this.xOffset,
            offsetY = (this.frameHeight * frameY) + this.yOffset;

        if (offsetX > this.img.width || offsetY > this.img.height) {
            return null;
        } else {
            return {
                x: offsetX,
                y: offsetY
            };
        }
    };

})();