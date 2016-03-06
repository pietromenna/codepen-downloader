'use strict';

let http = require('http');

module.exports = {
  download : (url, fn) => {
    http.get(url, (res) => {
      res.on('data', fn);
    }).on('error', (e) => {
      console.log(`Error: ${e.message}`);
    });
  }
}
