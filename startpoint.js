
var stream = require('stream');
var util = require('util');

function copyArray(input) {
  var output = new Array(input.length);
  for (var i = 0, l = input.length; i < l; i++) {
    output[i] = input[i];
  }
  return output;
}

function Startpoint(input, options) {
  if (!(this instanceof Startpoint)) return new Startpoint(input, options);

  stream.Readable.call(this, options);

  this._position = 0;
  this._objectMode = !!(options && options.objectMode);

  // will keep a long list of buffers
  if (input instanceof Error) {
    this._error = input;
    this._data = null;
  } else if (this._objectMode) {
    this._error = null;
    this._data = copyArray(input);
  } else if (Buffer.isBuffer(input)) {
    this._error = null;
    this._data = input;
  } else {
    this._error = null;
    this._data = new Buffer(input.toString());
  }
}
module.exports = Startpoint;
util.inherits(Startpoint, stream.Readable);

Startpoint.prototype._read = function (size) {
  // Error mode
  if (this._error) {
    this.emit('error', this._error);
    return this.push(null);
  }

  // Object mode
  else if (this._objectMode) {
    // if there are no more data to read, send nul
    if (this._data.length === 0) {
       return this.push(null);
    }

    // Send data chunk
    this.push(this._data.shift());
  }

  // Buffer mode
  else {
    // At this point we know that buffer is set
    if (this._position + size > this._data.length) {
      size = this._data.length - this._position;
    }

    // if there are no more data to read, send nul
    if (this._position === this._data.length) {
      return this.push(null);
    }

    // slice out the buffer and update the the current position
    var buffer = this._data.slice(this._position, this._position + size);
    this._position += size;

    // no there is no delay here, if that is needed
    // use another stream module to create that delay.
    this.push(buffer);
  }
};
