
var stream = require('stream');
var util = require('util');

function Startpoint(input) {
  if (!(this instanceof Startpoint)) return new Startpoint(input);

  stream.Readable.call(this);

  this.position = 0;

  // will keep a long list of buffers
  if (input instanceof Error) {
    this.error = input;
    this.buffer = null;
  } else if (Buffer.isBuffer(input)) {
    this.error = null;
    this.buffer = input;
  } else {
    this.error = null;
    this.buffer = new Buffer(input.toString());
  }
}
module.exports = Startpoint;
util.inherits(Startpoint, stream.Readable);

Startpoint.prototype._read = function (size, callback) {
  if (this.error) {
    this.emit('error', this.error);
    this.emit('close');
    return;
  }

  // At this point we know that buffer is set
  if (this.position + size > this.buffer.length) {
    size = this.buffer.length - this.position;
  }

  // if there are no more data to read, send nul
  if (this.position === this.buffer.length) {
    this.push(null);
    this.emit('close');
    return;
  }

  // slice out the buffer and update the the current position
  var buffer = this.buffer.slice(this.position, this.position + size);
  this.position += size;

  // no there is no delay here, if that is needed
  // use another stream module to create that delay.
  this.push(buffer);
};
