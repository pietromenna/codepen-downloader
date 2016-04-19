#!/usr/bin/env node
'use strict';

let program     = require('commander');
let async       = require('async');
let fs          = require('fs');
let cpen        = require('../src/cpen');
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

  if (options === null || options === undefined) {
    options = {};
  };

  options['targetFiles'] = ['html', 'css', 'js'];
  options['includeDependencies'] = true;

  debugger;

  cpen.download(url, destination,
    (err) => {
      if (err) return console.log(`Error: ${err.message}`);
      console.log(`Completed`);
    },
    options,
    (message) => {
      progress.tick();
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
