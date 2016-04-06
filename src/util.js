'use strict';
let fs = require('fs');
let async = require('async');

module.exports = {
  createDirectoryIfMissing : function(destination, callback) {
    fs.readdir(destination, (err) => {
      if (!err) return callback();
      fs.mkdir(destination, (err) => {
        callback(err);
      });
    });
  },

  createIndexHtmlFile : function(file, html, fn) {
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

  createFile : function(file, data, fn) {
    this.removeFileIfExists(file, (err) => {
      if (err) return fn(err);
      fs.appendFile(file, data, fn);
    });
  },

  removeFileIfExists : function(file, fn) {
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
