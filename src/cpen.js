'use strict';

const async = require('async');
const util = require('./util');
const web = require('./web');

module.exports = {

  download(url, destination, onCompleteCallback, options, onTick) {
    options = options || util.defaultOptions;
    let parallel = {};
    options.targetFiles.forEach(f => parallel[f] = this.downloadFromEndpoint(url, f));

    if (options.includeDependencies) {
      parallel['deps'] = (callback) => {
        web.getPenProperties(url, (err, data) => {
          if (onTick)
          onTick();
          callback(err, data);
        })
      };
    }

    async.parallel(parallel, (err, results) => {
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

  downloadFromEndpoint(url, fileExtension) {
    return (callback) => {
      web.downloadFile(url, fileExtension, callback, (err, data) => {
        if(onTick)
          onTick();
        callback();
      });
    }
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
