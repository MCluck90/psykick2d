'use strict';

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-browserify');

    grunt.initConfig({
        browserify: {
            debug: {
                files: {
                    'build/game-debug.js': ['js/main.js']
                },
                options: {
                    debug: true
                }
            },
            release: {
                files: {
                    'build/game.js': ['js/main.js']
                },
                options: {
                    debug: false
                }
            }
        }
    });

    grunt.registerTask('default', 'browserify');
};