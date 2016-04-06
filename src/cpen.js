"use strict";

let fs = require('fs');
let http = require('http');
let async = require('async');
let util  = require('./util');


module.exports = {

  download : function(url, destination, options, onTick, callback) {
    async.parallel({
      html : (callback) => {
        this._downloadFile(url, 'html', (err, data) => {
          onTick();
          callback(err,data);
        });
      },
      css : (callback) => {
        this._downloadFile(url, 'css', (err, data) => {
          onTick();
          callback(err,data);
        });
      },
      js : (callback) => {
        this._downloadFile(url, 'js', callback, (err, data) => {
          onTick();
          callback(err,data);
        });
      }
    }, (err, results) => {
      if (err) return console.error(err.message);
      this.create(results, destination, (e) => {
        onTick();
        if (e) console.error(e.message);
        else console.log('Completed');
      });
    });
  },

  _downloadFile : function(url, file, fn) {
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

  create : function(result, destination, fn) {
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
