'use strict';

const http = require('http');
const async = require('async');
const util = require('./util');
const web = require('./web');

module.exports = {

  download(url, destination, onCompleteCallback, options, onTick) {
    async.parallel({
      html: (callback) => {
        this._downloadFile(url, 'html', (err, data) => {
          if (onTick)
            onTick();
          callback(err, data);
        });
      },
      css: (callback) => {
        this._downloadFile(url, 'css', (err, data) => {
          if (onTick)
            onTick();
          callback(err, data);
        });
      },
      js: (callback) => {
        this._downloadFile(url, 'js', callback, (err, data) => {
          if (onTick)
            onTick();
          callback(err, data);
        });
      },
      deps : (callback) => {
        web.getPenProperties(url, (err, data) => {
          if (onTick)
            onTick();
          callback(err, data);
        })
      }
    }, (err, results) => {
      if (err) {
        return console.error(err.message);
      }

      this.create(results, destination, (e) => {
        if (onTick)
          onTick();
        onCompleteCallback(e);
      });
    });
  },

  _downloadFile(url, file, fn) {
    http.get(`${util.parseUrl(url)}.${file}`, (res) => {
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
      });
    });
  },

  create(result, destination, fn) {
    util.createDirectoryIfMissing(destination, (err) => {
      if (err) console.log(`Error: ${err}`);
      async.parallel([
        (callback) => {
          util.createIndexHtmlFile(`${destination}/index.html`, result.html, callback);
        },
        (callback) => {
          util.createFile(`${destination}/style.css`, result.css, callback);
        },
        (callback) => {
          util.createFile(`${destination}/main.js`, result.js, callback);
        },
      ], fn);
    });
  },
};
