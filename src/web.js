'use strict';

let scrape = require('scrape');
let htmlEntities = require('html-entities').AllHtmlEntities;

let html = new htmlEntities();

module.exports = {

  _externalResources(json, obj) {
    if (json.resources !== null)
      obj.resources = json.resources;
  },

  _preProcessors(json, obj) {
    obj.html_pre_processor = json.editor_settings.html_pre_processor;
    obj.css_pre_processor = json.editor_settings.css_pre_processor;
    obj.js_pre_processor = json.editor_settings.js_pre_processor;
  },

  getPenProperties(url, callback) {
    scrape.request(url, (err, $) => {
      let properties = {};
      if (err) return callback(err);
      let penValue = JSON.parse(html.decode($('input#init-data').first().attribs.value));
      let resource = JSON.parse(penValue.__pen);

      this._externalResources(resource, properties);
      this._preProcessors(resource, properties);

      callback(null, properties);
    });

  }
}
