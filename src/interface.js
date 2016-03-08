'use strict';

let program    = require('commander');
let async      = require('async');
let fs         = require('fs');
let cpen       = require('./cpen');
let ProgressBar = require('progress');

module.exports = program;

let download = function(url, destination, options) {
  destination = destination || '.'
  let progress = new ProgressBar(`Downloading ( :percent )[:bar]`, {
    complete: '=',
    incomplete: '-',
    width: 50,
    total: 4
  });

  progress.tick();
  async.parallel({
    html : (callback) => {
      cpen.download(url, 'html', (err, data) => {
        progress.tick();
        callback(err,data);
      });
    },
    css : (callback) => {
      cpen.download(url, 'css', (err, data) => {
        progress.tick();
        callback(err,data);
      });
    },
    js : (callback) => {
      cpen.download(url, 'js', callback, (err, data) => {
        progress.tick();
        callback(err,data);
      });
    }
  }, (err, results) => {
    if (err) return console.error(err.message);
    cpen.create(results, destination, (e) => {
      progress.tick();
      if (e) console.error(err.message);
    });
  });
}

program
  .version('0.1.0')
  .option('-v, --verbose', 'output more log then usual')

program
  .command('download <url> [destination]')
  .description('Download single codepen.io showcase based on URL')
  .action(download);

program.parse(process.argv);
