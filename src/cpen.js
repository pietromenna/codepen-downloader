"use strict";

let fs = require('fs');
let http = require('http');
let async = require('async');
let ProgressBar = require('progress');

const BASE_URL = "http://codepen.io";

let removeFileIfExists = (file, fn) => {
  fs.stat(file, (err) => {
    if(!err) {
      fs.unlink(file, fn);
    } else if (err.code !== "ENOENT") {
      fn(err);
    } else {
      fn(null);
    }
  });
}

let createFile = (file, data, fn) => {
  removeFileIfExists(file, (err) => {
    if (err) return fn(err);
    fs.appendFile(file, data, fn);
  });
};

let createIndexHtmlFile = (file, html, fn) => {
  async.parallel([
    (callback) => fs.readFile(__dirname + '/template/head.html', callback),
    (callback) => fs.readFile(__dirname + '/template/foot.html', callback)
  ], (err, data) => {
    if(err) return fn(err);
    fs.appendFileSync(file, data[0]);
    fs.appendFileSync(file, html);
    fs.appendFileSync(file, data[1]);
  });
}

let createDirectoryIfMissing = (destination, callback) => {
  fs.readdir(destination, (err) => {
    if (!err) return callback();
    fs.mkdir(destination, (err) => {
      callback(err);
    });
  });
}

module.exports = {

  download : (url, file, fn) => {
    http.get(`${BASE_URL}${url}.${file}`, (res) => {
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
    createDirectoryIfMissing(destination, (err) => {
      if (err) console.log(`Error: ${err}`);
      async.parallel([
        (callback) => {
          createIndexHtmlFile(`${destination}/index.html`, result.html, callback)
        },
        (callback) => {
          createFile(`${destination}/style.css`, result.css, callback);
        },
        (callback) => {
          createFile(`${destination}/main.js`, result.js, callback);
        }
      ], fn);
    });
  }
}
