'use strict';
let fs = require('fs');
let async = require('async');

const fullURL   = /http[s]?:\/\/codepen\.io\/(.*)\/(.*)\/(.*)/;
const domainURL = /codepen\.io\/(.*)\/(.*)\/(.*)/;
const penURL    = /\/(.*)\/(.*)\/(.*)/;

const normalURL = /htt[s]?:\/\/(.*)/;

module.exports = {

  evaluateOptions(options) {
    for(let opt in this.defaultOptions) {
      if (!options.hasOwnProperty(opt)) {
        options[opt] = this.defaultOptions[opt];
      };
    };

    return options;
  },

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

  parseScriptUrl(url) {
    if (normalURL.exec(url) === null)
      return `http:${url}`;
    else
      return url;
  },

  createScriptTag(result) {
    let scripts = "";
    if (result.deps) {
      result.deps.resources.forEach((d) => {
        d.url = this.parseScriptUrl(d.url);
        if (d.resource_type === 'js')
        scripts = `${scripts}\n \
        <script src=${d.url}></script>`;
      });
    }
    return scripts;
  },

  createIndexHtmlFile(file, result, fn) {
    async.parallel([
      (callback) => fs.readFile(__dirname + '/template/head01.html', callback),
      (callback) => fs.readFile(__dirname + '/template/head02.html', callback),
      (callback) => fs.readFile(__dirname + '/template/foot.html', callback)
    ], (err, data) => {
      if(err) return fn(err);
      this.removeFileIfExists(file, (err) => {
        if (err) return fn(err);
        fs.appendFileSync(file, data[0]);
        fs.appendFileSync(file, this.createScriptTag(result));
        fs.appendFileSync(file, data[1]);
        fs.appendFileSync(file, result.html);
        fs.appendFileSync(file, data[2]);
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
  },

  defaultOptions : {
    targetFiles : ['html', 'css', 'js'],
    includeDependencies : true,
    includePreProcessed : true
  }

};
