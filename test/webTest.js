'use strict';

let web = require('../src/web');
let nock = require('nock');

describe('Get pen properties', () => {

  beforeEach(done => {
    nock('http://www.codepen.io')
      .get('/aaa/pen/bbb')
      .replyWithFile(200, __dirname + '/response.html');

    done();
  });

  it('Should parse properties', (done) => {
    web.getPenProperties('http://www.codepen.io/aaa/pen/bbb', function(err, properties) {
      expect(err).to.be.null;
    });
  })

})
