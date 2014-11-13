// Taken from https://github.com/mikeal/SLEEP/blob/master/server.js#L40
var Transform = require('stream').Transform
var inherits = require('inherits')

inherits(JSONFormat, Transform)
module.exports = JSONFormat
  
function JSONFormat(opts) {
  if(!(this instanceof JSONFormat)) return new JSONFormat(opts)
  Transform.call(this, {objectMode: true})
  this.style = opts.style || 'object'
  this.started = false
  this.i = 0
}
  
JSONFormat.prototype._transform = function (data, enc, cb) {
    this.started = true

  if(this.style === 'array') {
     if (this.i === 0) this.push('[')
     else this.push(',')

    cb(null, JSON.stringify(data))
  } else if(this.style === 'object') {
     if (this.i === 0) this.push('{"rows":[')
     else this.push(',')
     
    cb(null, JSON.stringify(data))
    
 // the following are technically not JSON, but included to be compliant with 
 
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
 
JSONFormat.prototype._flush = function (cb) {
    if (this.style === 'newline' || this.style === 'sse') {
      // do nothing
    } else if (this.style === 'array') {
      if (this.started) this.push(']')
      else this.push('[]')
    } else if (this.style === 'object') {
      if (this.started) this.push(']}')
      else this.push('{"rows":[]}')
    } else {
      return this.emit('error', new Error('unknown feed style.'))
    }
    cb()
}

