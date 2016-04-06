'use strict';

let program     = require('commander');
let async       = require('async');
let fs          = require('fs');
let cpen        = require('./cpen');
let ProgressBar = require('progress');
let packageJson = require('../package.json');

module.exports = program;

let triggerDownload = function(url, destination, options) {
  destination = destination || '.';
  let progress = new ProgressBar(`Downloading ( :percent )[:bar]`, {
    complete: '=',
    incomplete: '-',
    width: 50,
    total: 3
  });

  // @todo: validate options

  cpen.download(url, destination, options,
    (message) => {
      progress.tick();
    },
    (err) => {
      if (err) return console.log(`Error: ${err.message}`);
      console.log(`Completed`);
    });
}

program
  .version(packageJson.version)
  .option('-v, --verbose', 'output more log then usual')

program
  .command('download <url> [destination]')
  .description('Download single codepen.io showcase based on URL')
  .action(triggerDownload);

program.parse(process.argv);
