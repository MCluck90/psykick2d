'use strict';

module.exports = function(grunt) {
    // Load in all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: ['node_modules/**/*.js', 'build/**/*']
            },
            all: {
                files: {
                    src: ['Gruntfile.js', 'src/**/*.js']
                }
            }
        },

        watch: {
            all: {
                files: ['Gruntfile.js', 'src/**/*.js'],
                tasks: ['jshint:all']
            },
            debug: {
                files: ['Gruntfile.js', 'src/**/*.js'],
                tasks: ['jshint:all', 'browserify:debug']
            },
            release: {
                files: ['Gruntfile.js', 'src/**/*.js'],
                tasks: ['jshint:all', 'browserify:release']
            }
        },

        browserify: {
            debug: {
                files: {
                    'build/psykick-debug.js': ['src/browser.js']
                },
                options: {
                    debug: true
                }
            },
            release: {
                files: {
                    'build/psykick.js': ['src/browser.js']
                },
                options: {
                    debug: false
                }
            }
        }
    });

    grunt.registerTask('default', 'jshint:all');
    grunt.registerTask('build', 'Builds Psykick for the browser', function(type) {
        grunt.task.run('jshint:all');

        if (type === undefined) {
            grunt.task.run('browserify:debug', 'browserify:release');
        } else {
            grunt.task.run('browserify:' + type);
        }
    });
};