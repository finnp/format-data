// Taken from https://github.com/mikeal/SLEEP/blob/master/server.js#L40
var Transform = require('stream').Transform
var inherits = require('inherits')

inherits(JSONFormat, Transform)
module.exports = JSONFormat

function JSONFormat(opts) {
  if(!(this instanceof JSONFormat)) return new JSONFormat(opts)
  Transform.call(this, {objectMode: true})
  this.style = opts.style || 'object'
  this.key = opts.key || 'rows'
  this.prefix = opts.prefix
  this.separator = opts.separator
  this.suffix = opts.suffix
  this.started = false
  this.i = 0
  this.destroyed = false
  this.err = false

}

JSONFormat.prototype._transform = function (data, enc, cb) {
    this.started = true

  if(this.style === 'array') {
     if (this.i === 0) this._prefix('[')
     else this._separator(',')

    cb(null, JSON.stringify(data))
  } else if(this.style === 'object') {
     if (this.i === 0) this._prefix('{"' + this.key + '":[')
     else this._separator(',')
     this.push(JSON.stringify(data))

    cb(null)

 // the following are technically not JSON, but included to be compliant.
 // they do not use prefix, separator, or suffix.

  } else if (this.style === 'newline') {
     var ndrow = JSON.stringify(data) + '\n'
    cb(null, ndrow)
  } else if(this.style === 'sse') {
    cb(null, 'event: data\ndata: ' + JSON.stringify(data) + '\n\n')
  } else {
    cb(new Error('unknown feed style.'))
  }

  this.i += 1

 }

JSONFormat.prototype._prefix = function (prefix) {
  this.push(this.prefix ? this.prefix : prefix)
}

JSONFormat.prototype._separator = function (separator) {
  this.push(this.separator ? this.separator : separator)
}

JSONFormat.prototype._suffix = function (suffix) {
  this.push(this.suffix ? this.suffix : suffix)
}

JSONFormat.prototype._flush = function (cb) {
    if (this.style === 'newline' || this.style === 'sse') {
      // do nothing
    } else if (this.style === 'array') {
      if (this.started) this._suffix(']')
      else this.push('[]')
      if(this.err) {
        this._separator('\n')
        this.push(JSON.stringify({error: this.err.message}))
      }
    } else if (this.style === 'object') {
      if (!this.started) this._prefix('{"'+ this.key + '":[')
      if(this.err) {
        this.push('],"error":' + JSON.stringify(this.err.message))
        this._suffix('}')
      }
      else {
        this.push(']') // finish array
        this._suffix('}')
      }
    } else {
      return this.emit('error', new Error('unknown feed style.'))
    }
    cb()
}

JSONFormat.prototype.destroy = function(err) {
  if (this.destroyed) return
  this.destroyed = true

  this.err = err
  this.end()
}

