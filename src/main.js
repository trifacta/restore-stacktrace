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
var program = require('commander');

var loadSourcemaps = require('./load-sourcemaps');
var restoreStacktrace = require('./restore-stacktrace');

program
  .version('0.0.1')
  .option('-m, --maps <value>', 'Directory containing source maps')
  .option('-s, --stacktrace <value>', 'File containing minified stack trace')
  .parse(process.argv);

console.log(restoreStacktrace({
  stacktrace: fs.readFileSync(program.stacktrace).toString(),
  sourceMaps: loadSourcemaps(program.maps)
}));
