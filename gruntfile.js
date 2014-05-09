'use strict';

module.exports = function (grunt) {

	// load all grunt tasks
	require('load-grunt-tasks')(grunt);

	// grunt config
	grunt.initConfig({
		// sass files
		sass: {
			dev: {
				options: {
					// debugInfo: true,
					style: 'expanded'
				},
				files: {
					'css/styles.css': 'src/sass/styles.scss'
				}
			}
		},

		// uglify
		uglify: {
			dev: {
				options: {
					mangle: false,
					compress: false,
					beautify: true,
					preserveComments: 'all'
				},
				files: {
					'js/application.js': [
						'src/js/Main.js'
					]
				}
			}
		},

		// watch
		watch: {
			css: {
				files: 'src/sass/*.scss',
				tasks: ['sass:dev']
			},
			js: {
				files: 'src/js/**/*.js',
				tasks: ['uglify:dev']
			}
		}

	});


	// tasks
	grunt.registerTask('default', ['watch']);
};