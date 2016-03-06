'use strict';

let program    = require('commander');
let async      = require('async');
let fs         = require('fs');
let cpen       = require('./cpen');

module.exports = program;

let download = function(url, options) {
  async.parallel({
    html : (callback) => {
      cpen.download(url, 'html', callback);
    },
    css : (callback) => {
      cpen.download(url, 'css', callback)
    },
    js : (callback) => {
      cpen.download(url, 'js', callback);
    }
  }, cpen.create);
}

program
  .version('0.1.0')
  .option('-v, --verbose', 'output more log then usual')

program
  .command('download <url>')
  .description('Download single codepen.io showcase based on URL')
  .action(download);

program.parse(process.argv);
