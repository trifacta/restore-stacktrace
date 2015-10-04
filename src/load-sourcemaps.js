/**
 * Trifacta Inc. Confidential
 *
 * Copyright 2015 Trifacta Inc.
 * All Rights Reserved.
 *
 * Any use of this material is subject to the Trifacta Inc., Source License located
 * in the file 'SOURCE_LICENSE.txt' which is part of this package.  All rights to
 * this material and any derivative works thereof are reserved by Trifacta Inc.
 */

var fs = require('fs');
var sourcemap = require('source-map');

var SourceMapConsumer = sourcemap.SourceMapConsumer;

var endsWith = function(s, suffix) {
  return s.indexOf(suffix, s.length - suffix.length) !== -1;
};

module.exports = function(sourceMapsDirectory) {
  return fs.readdirSync(sourceMapsDirectory).reduce(function(files, filename) {
    if (!endsWith(filename, '.map')) {
      return files;
    }

    var moduleName = filename.substring(0, filename.length - '.map'.length);
    var sourceMapFile = sourceMapsDirectory + filename;
    var sourceMapContent = fs.readFileSync(sourceMapFile).toString();

    files[moduleName] = new SourceMapConsumer(sourceMapContent);

    return files;
  }, {});
};
