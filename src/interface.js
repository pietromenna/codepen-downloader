'use strict';

const BASE_URL = "http://codepen.io"

let program = require('commander');
let downloader = require('./downloader.js');
module.exports = program;

let download = function(url, options) {
  downloader.download(`${BASE_URL}${url}`, (data) => {
    console.log(`${data}`);
  });
};

program
  .version('0.1.0')
  .option('-v, --verbose', 'output more log then usual')

program
  .command('download <url>')
  .description('Download single codepen.io showcase based on URL')
  .action(download);

program.parse(process.argv);
