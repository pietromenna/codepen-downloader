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

// let download = function(url, options) {
//
//   downloader.download(`${BASE_URL}${url}.html`, (data) => {
//     fs.appendFile('index.html', data, (err) => {
//       if (err) console.error(`${err.message}`);
//     });
//   });
//
//   downloader.download(`${BASE_URL}${url}.css`, (data) => {
//     fs.appendFile('style.css', data, (err) => {
//       if (err) console.error(`${err.message}`);
//     });
//   });
//
//   downloader.download(`${BASE_URL}${url}.js`, (data) => {
//     fs.appendFile('main.js', data, (err) => {
//       if (err) console.error(`${err.message}`);
//     });
//   });
//
// };

program
  .version('0.1.0')
  .option('-v, --verbose', 'output more log then usual')

program
  .command('download <url>')
  .description('Download single codepen.io showcase based on URL')
  .action(download);

program.parse(process.argv);
