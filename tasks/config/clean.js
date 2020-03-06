/**
 * `clean`
 *
 * ---------------------------------------------------------------
 *
 * Remove the files and folders in your Sails app's web root
 * (conventionally a hidden directory called `.tmp/public`).
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-clean
 *
 */
module.exports = function(grunt) {

  grunt.config.set('clean', {
    //dev: ['.tmp/public/**'],
    dev: ['.tmp/public/fonts/**','.tmp/public/images/**','.tmp/public/js/**','.tmp/public/js/**','.tmp/public/styles/**','.tmp/public/*.*'],
    build: ['www']
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
};

