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
                    debug: true,
                    alias: [
                        '../../../src/index.js:psykick2d'
                    ]
                }
            },
            release: {
                files: {
                    'build/game.js': ['js/main.js']
                },
                options: {
                    debug: false,
                    alias: [
                        '../../../src/index.js:psykick2d'
                    ]
                }
            }
        }
    });

    grunt.registerTask('default', 'browserify');
};