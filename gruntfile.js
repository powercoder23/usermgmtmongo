module.exports = function(grunt) {

    grunt.initConfig({

        nodemon: {
            dev: {
                script: 'bin/www',
                options: {
                    watch: ['server.js', 'routes'],
                    ignore: ['node_modules/**'],
                    ext: 'js, coffee',
                    delay: 1000
                }
            }
        },

        wiredep: {
            task: {
                src: [
                    'app/index.html'
                ]
            }
        }

    });

    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.registerTask('default');

    grunt.registerTask('serve', ['nodemon']);

};
