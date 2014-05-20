'use strict';

var doc = (typeof document !== 'undefined') ? document : null,
    isClientSide = (doc !== null);

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

var AssetManager = {
    Audio: {
        get canPlayType() {
            return canPlayAudioType;
        }
    }
};

module.exports = AssetManager;