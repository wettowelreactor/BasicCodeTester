'use strict';
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-scss-imports'); //shim to inline css imports

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dev: {
        src: ['app/sass/style.sass'],
        dest: 'app/static/assets/style.css'
      },
    },

    sass_imports: {
      'app/sass/imports.scss': [
        'node_modules/codemirror/lib/codemirror.css', 
      ]
    },

    browserify: {
      browserifyOptions: {
        debug: true
      },
      'app/static/assets/bundle.js': ['app/js/app.js'],
      'app/static/assets/webWorker.js': ['app/js/checkCode.js']
    },

    jshint: {
      files: [
        'Gruntfile.js',
        'app/js/**/*.js'
      ],
      options: {
        jshintrc: true,
      }
    },

    notify: {
      sass: {
        options: {
          message: 'SASS compiled!'
        }
      },
      bundle: {
        options: {
          message: 'Bundle ready!'
        }
      }
    },

    watch: {
      bundle: {
        files: ['app/js/**/*.js'],
        tasks: ['jshint', 'browserify', 'notify:bundle']
      },
      sass: {
        files: ['app/sass/**/*.sass', 'notify:sass'],
        tasks: ['sass']
      }
    }
  });

  grunt.registerTask('default', ['sass_imports', 'watch']);
};
