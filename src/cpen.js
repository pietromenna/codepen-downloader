'use strict';

let fs = require('fs');
let http = require('http');
let async = require('async');

const BASE_URL = "http://codepen.io"

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
    }).on('error', (e) => {
      fn(e);
    });
  },

  create : (err, result) => {
    if(err) {
      console.error(`Error: ${err.message}`);
    } else {
      fs.appendFile('example/index.html', result.html, (e) => { if(e) console.error(e.message) });
      fs.appendFile('example/style.css', result.css, (e) => { if(e) console.error(e.message) });
      fs.appendFile('example/main.js', result.js, (e) => { if(e) console.error(e.message) });
    }

  }

}
