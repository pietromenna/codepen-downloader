'use strict';
let fs = require('fs');
let async = require('async');

const fullURL   = /http[s]?:\/\/codepen\.io\/(.*)\/(.*)\/(.*)/;
const domainURL = /codepen\.io\/(.*)\/(.*)\/(.*)/;
const penURL    = /\/(.*)\/(.*)\/(.*)/;

module.exports = {

  parseUrl(url) {
    if (fullURL.exec(url) !== null) {
      return url;
    } else if (domainURL.exec(url) !== null){
      return `http://${url}`;
    } else if (penURL.exec(url) !== null) {
      return `http://codepen.io${url}`;
    } else {
      throw new Error('Invalid URL');
    }
  },

  createDirectoryIfMissing(destination, callback) {
    fs.readdir(destination, (err) => {
      if (!err) return callback();
      fs.mkdir(destination, (err) => {
        callback(err);
      });
    });
  },

  createIndexHtmlFile(file, html, fn) {
    async.parallel([
      (callback) => fs.readFile(__dirname + '/template/head.html', callback),
      (callback) => fs.readFile(__dirname + '/template/foot.html', callback)
    ], (err, data) => {
      if(err) return fn(err);
      this.removeFileIfExists(file, (err) => {
        if (err) return fn(err);
        fs.appendFileSync(file, data[0]);
        fs.appendFileSync(file, html);
        fs.appendFileSync(file, data[1]);
        fn(null, file);
      });
    });
  },

  createFile(file, data, fn) {
    this.removeFileIfExists(file, (err) => {
      if (err) return fn(err);
      fs.appendFile(file, data, fn);
    });
  },

  removeFileIfExists(file, fn) {
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

};
