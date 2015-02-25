'use strict';
//var logger = require('log4js').getLogger('Gruntfile');

module.exports = function (grunt) {
    require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'src/**/*.js'
            ]
        },
        mochaTest: {
            sanity: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['src/suites/sanity/index.spec.js']
            }
        }
    });

    grunt.registerTask('test', [ 'mochaSelenium:all' ]);

    grunt.registerTask('build', [ 'jshint' ]);

    grunt.registerTask('default', [ 'jshint', 'test' ]);
};