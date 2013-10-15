module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
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
            lib: {
                configFile: 'karma.conf.js'
            }
        }
    });

    grunt.registerTask('dist', [
        'clean',
        'browserify'
    ]);

    grunt.registerTask('test', [
        'dist',
        'karma'
    ]);
};