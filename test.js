
var test = require('tap').test;
var startpoint = require('./startpoint.js');
var crypto = require('crypto');

var buffer = crypto.randomBytes(16384 * 3.5);
var array = [[1], [2], [3]];

test('simple read and end using buffer', function (t) {
  var point = startpoint(buffer);

  t.equal(point.read(100).toString('hex'), buffer.slice(0, 100).toString('hex'));
  t.equal(point.read(16384).toString('hex'), buffer.slice(100, 100 + 16384).toString('hex'));
  t.equal(point.read(16384).toString('hex'), buffer.slice(100 + 16384, 100 + 2 * 16384).toString('hex'));
  t.equal(point.read(16384).toString('hex'), buffer.slice(100 + 2 * 16384, 100 + 3 * 16384).toString('hex'));
  t.equal(point.read(16384).toString('hex'), buffer.slice(100 + 3 * 16384, buffer.length).toString('hex'));
  t.equal(point.read(16384), null);

  t.end();
});

test('simple error sending', function (t) {
  var fakeError = new Error('error');

  var point = startpoint(fakeError);
  point.once('error', function (err) {
    t.equal(err, fakeError);
    t.end();
  });
  point.read();
});

test('simple error sending', function (t) {
  var fakeError = new Error('error');

  var point = startpoint(fakeError, {objectMode: true});
  point.once('error', function (err) {
    t.equal(err, fakeError);
    t.end();
  });
  point.read();
});

test('simple read and end using object array', function (t) {
  var point = startpoint(array, {objectMode: true});

  t.deepEqual(point.read(), [1]);
  t.deepEqual(point.read(), [2]);
  t.deepEqual(point.read(), [3]);
  t.equal(point.read(), null);
  t.deepEqual(array, [[1], [2], [3]]);

  t.end();
});
