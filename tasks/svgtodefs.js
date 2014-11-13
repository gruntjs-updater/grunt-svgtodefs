/*
 * svgtodefs
 * https://github.com/brunosabot/grunt-svgtodefs
 *
 * Copyright (c) 2014 Bruno Sabot
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('svgtodefs', 'Transform a list of svg files to a single defs file', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      idPrefix: '',
      svgClass: 'svg-defs'
    });

    // Iterate over all specified file groups.
    this.files.forEach(function (f) {

      // Write the destination file.
      var src = '<svg class="' + options.svgClass + '"><defs>';

      // Concat specified files.
      src += f.src.filter(function (filepath) {

        if (!grunt.file.exists(filepath)) {

          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;

        } else if (filepath.indexOf('.svg') === -1) {
          return false;
        }

        return true;

      }).map(function (filepath) {

        var fileContent = grunt.file.read(filepath);

        fileContent = fileContent.replace(/<!.*>/gmi, '');
        fileContent = fileContent.replace(/<\?.*\?>/gmi, '');
        fileContent = fileContent.replace(/\s+/gmi, ' ');
        fileContent = fileContent.replace(/<svg(.*?)>/gi, '');
        fileContent = fileContent.replace(/<\/svg>/gmi, '');
        fileContent = fileContent.replace(/<g(.*?)>/gi, '');
        fileContent = fileContent.replace(/<\/g>/gmi, '');

        var id = filepath.split('/');
        id = id[id.length - 1];
        id = id.replace(".svg", '');

        return '<g id="' + options.idPrefix + id + '">' + fileContent.trim() + '</g>' + "\n";

      }).join('');

      // Handle options.
      src += '</defs></svg>';

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');

    });

  });

};
