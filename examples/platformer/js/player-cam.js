'use strict';

var Camera = require('psykick2d').Camera,
    Helper = require('psykick2d').Helper;

var PlayerCam = function(player, width, height) {
    this.playerBody = player.getComponent('Rectangle');
    this._cacheX = this.playerBody.x;
    this._cacheY = this.playerBody.y;
    this.halfWidth = width / 2;
    this.halfHeight = height / 2;
    this.halfPlayerWidth = this.playerBody.width / 2;
    this.halfPlayerHeight = this.playerBody.height / 2;
};

Helper.inherit(PlayerCam, Camera);

PlayerCam.prototype.render = function(stage, delta) {
    var x = this.playerBody.x - this.halfWidth + this.halfPlayerWidth,
        y = this.playerBody.y - this.halfHeight + this.halfPlayerHeight;
    if (x !== this._cacheX || y !== this._cacheY) {
        stage.x = -x;
        stage.y = -y;
        this._cacheX = x;
        this._cacheY = y;
    }
};

module.exports = PlayerCam;