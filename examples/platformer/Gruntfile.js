'use strict';

module.exports = function(grunt) {
    grunt.loadNpmTasks('../../../node_modules/grunt-browserify');

    grunt.initConfig({
        browserify: {
            debug: {
                files: {
                    'build/game-debug.js': ['js/main.js']
                },
                options: {
                    alias: [
                        '../../../src/index.js:psykick2d'
                    ],
                    bundleOptions: {
                        debug: true
                    }
                }
            },
            release: {
                files: {
                    'build/game.js': ['js/main.js']
                },
                options: {
                    alias: [
                        '../../../src/index.js:psykick2d'
                    ],
                    bundleOptions: {
                        debug: false
                    }
                }
            }
        }
    });

    grunt.registerTask('default', 'browserify');
};