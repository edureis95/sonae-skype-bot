module.exports = function(grunt) {
    grunt.initConfig({
        mutationTest: {
            options: { testFramework: 'mocha' },
            target: {
                options:{
                    code: ['*.js'],
                    specs: '/test/test.js',
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-mutation-testing');
    grunt.registerTask('default', ['mutationTest']);
};