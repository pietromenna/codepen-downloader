'use strict';

const async = require('async');
const util = require('./util');
const web = require('./web');

module.exports = {

  download(url, destination, onCompleteCallback, options) {
    options = util.evaluateOptions(options);
    let parallel = {};
    options.targetFiles.forEach(f => parallel[f] = this.downloadFromEndpoint(url, f, options));

    if (options.includeDependencies) {
      parallel['deps'] = (callback) => {
        web.getPenProperties(url, (err, data) => {
          if (options.onTick)
            options.onTick();
          callback(err, data);
        })
      };
    }

    async.parallel(parallel, (err, results) => {
      if (err) {
        return console.error(err.message);
      }

      this.create(results, destination, (e) => {
        if (options.onTick)
          options.onTick();
        onCompleteCallback(e);
      });
    });
  },

  downloadFromEndpoint(url, fileExtension, options) {
    return (callback) => {
      web.downloadFile(url, fileExtension, callback, (err, data) => {
        if(options.onTick)
          options.onTick();
        callback();
      });
    }
  },

  create(result, destination, fn) {
    util.createDirectoryIfMissing(destination, (err) => {
      if (err) console.log(`Error: ${err}`);
      async.parallel([
        (callback) => {
          util.createIndexHtmlFile(`${destination}/index.html`, result, callback);
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
