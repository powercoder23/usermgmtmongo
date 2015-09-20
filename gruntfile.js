module.exports = function(grunt) {

    grunt.initConfig({

        nodemon: {
            dev: {
                script: 'bin/www'
            }
        },

        wiredep: {

            task: {

                // Point to the files that should be updated when
                // you run `grunt wiredep`
                src: [
                    'app/index.html'
                ],

                options: {
                    // See wiredep's configuration documentation for the options
                    // you may pass:

                    // https://github.com/taptapship/wiredep#configuration
                }
            }
        }

    });
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.registerTask('default');

    grunt.registerTask('serve', ['nodemon']);

};
