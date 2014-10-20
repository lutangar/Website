module.exports = function(grunt) {

    // Delete after first run
    if(!grunt.file.exists('vendor/bootstrap')) {
        grunt.fail.fatal('>> Please run "bower install" before continuing.');
    }

    var prettify = function(src) {
        return require('js-prettify').html(src, {
                indent_size: 2,
                indent_inner_html: true
            }).replace(/(\r\n|\n\r|\n|\r){2,}/g, '\n');
        };

    // Project configuration.
    grunt.initConfig({
        pkg:        grunt.file.readJSON('package.json'),
        site:       grunt.file.readYAML('_config.yml'),
        vendor:     grunt.file.readJSON('.bowerrc').directory,
        bootstrap:  '<%= vendor %>/bootstrap',
        clean: {
            example: ['<%= site.dest %>/*.html'],
        },
        jshint: {
            all: ['Gruntfile.js', 'templates/helpers/*.js'],
            options: { jshintrc: '.jshintrc' }
        },
        less: {
            options: {
                vendor: 'vendor',
                paths: [ '<%= site.theme %>'],
            },
            site: {
                src: ['<%= site.theme %>/agency.less', '<%= site.theme %>/custom.less'],
                dest: '<%= site.assets %>/css/site.css'
            }
        },
        assemble: {
            options: {
                production:     true,
                flatten:        true,
                contextual: {
                    dest:       './temp'
                },
                pkg:    '<%= pkg %>',
                site:   '<%= site %>',
                data:   ['<%= site.data %>'],

                // Templates
                partials:   '<%= site.includes %>',
                layoutdir:  '<%= site.layouts %>',
                layout:     '<%= site.layout %>',

                // Extensions
                helpers:    '<%= site.helpers %>',

                // Assets
                assets:     '<%= site.assets %>',

                marked:         {sanitize: false },
                prettify: {
                    indent:         2,
                    condense:       true,
                    padcomments:    true
                }
            },
            amabla: {
                files: {'<%= site.dest %>/': ['<%= site.templates %>/*.hbs']}
            }
        },
        copy: {
            assets: {
                files: [
                    {expand: true, cwd: '<%= bootstrap %>/dist/css',   src: ['bootstrap.min.css'], dest: '<%= site.assets %>/css/'},
                    {expand: true, cwd: '<%= vendor %>/components-font-awesome/css/', src: ['font-awesome.min.css'], dest: '<%= site.assets %>/css/'},

                    {expand: true, cwd: '<%= bootstrap %>/dist/fonts', src: ['*.*'], dest: '<%= site.assets %>/fonts/'},
                    {expand: true, cwd: '<%= vendor %>/components-font-awesome/fonts', src: ['*.*'], dest: '<%= site.assets %>/fonts/'},

                    {expand: true, cwd: '<%= bootstrap %>/dist/js',    src: ['*.*'], dest: '<%= site.assets %>/js/'},
                    {expand: true, cwd: '<%= site.theme %>/js/',        src: ['*.*'], dest: '<%= site.assets %>/js/'},

                    {expand: true, cwd: '<%= site.theme %>/images/',        src: ['**/*.*'], dest: '<%= site.assets %>/images/'},
                    {expand: true, cwd: '<%= site.theme %>/',    src: ['favicon.ico', 'statuts_amabla.pdf'], dest: '<%= site.dest %>'}
                ]
            }
        }
    });

    // Load npm plugins to provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-readme');
    grunt.loadNpmTasks('grunt-sync-pkg');
    grunt.loadNpmTasks('grunt-newer');

    // Load Assemble
    grunt.loadNpmTasks('assemble-less');
    grunt.loadNpmTasks('assemble');

    // Build HTML, compile LESS and watch for changes. You must first run "bower install"
    // or install Bootstrap to the "vendor" directory before running this command.
    grunt.registerTask('default', ['clean', 'jshint', 'less', 'copy', 'assemble']);
};
