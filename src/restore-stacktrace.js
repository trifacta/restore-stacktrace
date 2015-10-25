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

var _ = require('lodash');

function restoreStacktrace(options) {
  var stacktrace = options.stacktrace;
  var sourceMaps = options.sourceMaps;

  var lines = stacktrace.split('\n');
  var result = '';

  lines.forEach(function(stackLine) {
    stackLine = stackLine.trim();

    if (stackLine.indexOf('at ') === 0) {

      // isOnlyUrl
      // true: " at http://something/bundle.js:1:1"
      // false: " at bla.bla (http://something/bundle.js:1:1)"
      var isOnlyUrl = stackLine.match(/^at http(s?):\/\//);

      var sourceUrl = isOnlyUrl ?
        stackLine.substring('at '.length) :
        stackLine.substring(
          stackLine.lastIndexOf('(') + 1,
          stackLine.lastIndexOf(')')
        );

      var bundleFile = sourceUrl.substring(
        sourceUrl.lastIndexOf('/') + 1,
        sourceUrl.lastIndexOf(':', sourceUrl.lastIndexOf(':') - 1)
      );

      var sourceLine = parseInt(sourceUrl.substring(
        sourceUrl.lastIndexOf(':', sourceUrl.lastIndexOf(':') - 1) + 1,
        sourceUrl.lastIndexOf(':')
      ));

      var column = parseInt(sourceUrl.substring(
        sourceUrl.lastIndexOf(':') + 1,
        sourceUrl.length
      ));

      var sourceMap = sourceMaps[bundleFile];

      if (sourceMap == null) {
        result += '  [original] ' + stackLine;
        return;
      }

      var originalPosition = sourceMap.originalPositionFor({
        line: sourceLine,
        column: column
      });

      var source = originalPosition.source.substring('webpack:///'.length, originalPosition.source.length);

      // remove last ? part
      if (source.lastIndexOf('?') > source.lastIndexOf('/')) {
        source = source.substring(0, source.lastIndexOf('?'));
      }

      result += '  at ';
      if (!isOnlyUrl) {
        result += stackLine.substring('at '.length, stackLine.lastIndexOf('('));
      }
      result += originalPosition.name;
      result += ' (' + source + ':' + originalPosition.line + ':' + originalPosition.column + ')';
    } else {
      result += stackLine;
    }

    result += '\n';
  });

  return result;
}

module.exports = restoreStacktrace;
