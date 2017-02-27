module.exports = function (grunt) {
    grunt.initConfig({

        watch: {
            all: {
                files: ['src/index.html', 'src/*.js'],
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                livereload: 35729,
                open: true
            },
            livereload: {
                options: {
                    open: true
                }
            }
        },
        uglify: {
            options: {
                wrap: true,
                screwIE8: true,
                mangle: true
            },
            dist: {
                files: {
                    'dist/ap22.min.js': 'src/ap22.js'
                }
            }
        },
        'closure-compiler': {
            frontend: {
                closurePath: 'closure',
                js: 'src/ap22.js',
                jsOutputFile: 'dist/ap22.min.js',
                maxBuffer: 500,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    // language_in: 'ECMASCRIPT6',
                    // language_out: 'ECMASCRIPT6_TYPED',
                    rewrite_polyfills: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('serve', ['connect:livereload', 'watch']);
    grunt.registerTask('default', 'serve');

    // useful for initial development but no longer used due to lack of ES6 support
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-closure-compiler');
    // grunt.registerTask('build', 'closure-compiler');

};
