module.exports = function(grunt){

    "use strict";
   require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        autoprefixer: {

            options: {
              // Task-specific options go here.
            },

            // prefix the specified file
            single_file: {
              options: {
                // Target-specific options go here.
              },
              src: 'css/style-min.css',
              dest: 'css/style-min.css'
            }
        },

        cssc: {
            build: {
                options: {
                    sortSelectors: true,
                    lineBreaks: true,
                    sortDeclarations:true,
                    consolidateViaDeclarations:false,
                    consolidateViaSelectors:false,
                    consolidateMediaQueries:false
                },
                files: {
                    'css/style-min.css': 'css/style-min.css'
                }
            }
        },

        cssmin: {
            build: {
                src: 'css/style-min.css',
                dest: 'css/style-min.css'
            }
        },

        sass: {
            build: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'library/css/style.css': 'library/scss/style.scss'
                }
            }
        },

        watch: {
        	options: {
                livereload: true,
            },
            js: {
                files: ['src/js/*.js'],
                tasks: ['concat:js','uglify']
            },
            css: {
                files: ['src/css/*.css'],
                tasks: ['buildcss']
            },
            livereload: {
                files: ['*.html', '*.php', 'assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}']
            }
        },

        concat: {
            options: {
                separator: ';',
            },
            js: {
                src: ['src/js/*.js'],
                dest: 'js/scripts-min.js',
            },
            css: {
                src: ['src/css/*.css'],
                dest: 'css/style-min.css',
            }
        },

        uglify: {
            build: {
                files: {
                    'js/scripts-min.js': ['js/scripts-min.js']
                }
            }
        }

        // connect: {
        //     server: {
        //         options: {
        //             open: 'http://localhost:8000/',
        //             livereload: 35729,
        //             hostname:'0.0.0.0',
        //             base: '../../../../olliebaker'
        //         }
        //     }
        // },

    });

    grunt.registerTask('default',   ['build', 'watch']);
    grunt.registerTask('build',     ['buildcss', 'concat:js', 'uglify' ]);
    grunt.registerTask('buildcss',  ['concat:css', 'autoprefixer','cssc', 'cssmin']);

};