module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-karma');
    
    grunt.initConfig({
        clean: ['dist'],
        
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
                tasks: ['dist']
            }
        }
    });

    grunt.registerTask('dist', [
        'clean',
        'browserify'
    ]);

    grunt.registerTask('test', [
        'karma:local'
    ]);

    grunt.registerTask('default', [
        'test',
        'dist',
        'watch'
    ]);

    grunt.registerTask('travis', [
        'dist',
        'karma:travis'
    ]);
};
