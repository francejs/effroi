module.exports = function(grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    
    grunt.initConfig({
        clean: ['dist'],

        jshint: {
          all: {
            src: ['Gruntfile.js', 'src/**/*.js'],
            options: {
  /*            curly: true,
              eqeqeq: true,
              eqnull: true,
              browser: true,
              globals: {
                jQuery: true
              },*/
              '-W014': true
            }
          }
        },
        
        browserify: {
            lib: {
                src: 'src/effroi.js',
                dest: 'dist/effroi.js',
                options: {
                    standalone: 'effroi'
                }
            }
        },

        karma: {
            local: {
                configFile: 'karma.conf.js'
            },
            travis: {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers: ['Firefox', 'PhantomJS']
            }
        },

        watch: {
            code: {
                files: ['src/**/*.js'],
                tasks: ['jshint', 'dist']
            }
        },

        parallel: {
            testing: {
                options: {
                  stream: true
                },
                tasks: [{
                  grunt: true,
                  args: ['karma:local']
                },{
                  grunt: true,
                  args: ['watch']
                }]
            }
        }
    });

    grunt.registerTask('dist', [
        'clean',
        'browserify'
    ]);

    grunt.registerTask('test', [
        'dist',
        'parallel:testing'
    ]);

    grunt.registerTask('hint', [
        'jshint'
    ]);

    grunt.registerTask('default', [
        'test'
    ]);

    grunt.registerTask('travis', [
        'dist',
        'karma:travis'
    ]);
};
