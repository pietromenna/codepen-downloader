"use strict";

let fs = require('fs');
let http = require('http');
let async = require('async');
let util  = require('./util');


module.exports = {

  download : (url, file, fn) => {
    http.get(`${util.parseUrl(url)}.${file}`, (res) => {
      let buffer = '';
      res
      .on("data", (chunk) => {
        buffer += chunk;
      })
      .on('end', () => {
        fn(null, buffer);
      })
      .on('err', (err) => {
        fn(err);
      })
    });

  },

  create : (result, destination, fn) => {
    util.createDirectoryIfMissing(destination, (err) => {
      if (err) console.log(`Error: ${err}`);
      async.parallel([
        (callback) => {
          util.createIndexHtmlFile(`${destination}/index.html`, result.html, callback)
        },
        (callback) => {
          util.createFile(`${destination}/style.css`, result.css, callback);
        },
        (callback) => {
          util.createFile(`${destination}/main.js`, result.js, callback);
        }
      ], fn);
    });
  }
}
