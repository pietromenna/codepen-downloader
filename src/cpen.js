'use strict';

let fs = require('fs');
let http = require('http');
let async = require('async');
let ProgressBar = require('progress');

const BASE_URL = "http://codepen.io"

let createFile = (file, data, callback) => {
  fs.stat(file, (err, stat) => {
    if (!err) {
      fs.unlink(file, (err) => {
        if (err) return callback(err);
        fs.appendFile(file, data, (e) => {
          if (e) return callback(e);
          return callback(null, data);
        });
      });
    }
    else if (err.code == 'ENOENT') {
      fs.appendFile(file, data, (e) => {
        if (e) return callback(e);
        return callback(null, data);
      });
    } else {
      return callback(err);
    }
  });
};

module.exports = {

  download : (url, file, fn) => {
    http.get(`${BASE_URL}${url}.${file}`, (res) => {
      let buffer = '';
      res
      .on('data', (chunk) => {
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
    async.parallel([
      (callback) => {
        createFile(`${destination}/index.html`, result.html, callback);
      },
      (callback) => {
        createFile(`${destination}/style.css`, result.css, callback);
      },
      (callback) => {
        createFile(`${destination}/main.js`, result.js, callback);
      }
    ], fn);
  }
}
