var ndjson = require('ndjson')
var csv = require('csv-write-stream')
var sse = require('ssejson')
var json = require('./json.js')

module.exports = function (format, opts) { 
  opts = opts || {} 
  if(typeof format == 'object')  {
    opts = format
    format = format.format || 'json'
  }
  
  if(format === 'ndjson') return ndjson.stringify(opts)
  if(format === 'csv') return csv(opts)
  if(format === 'sse') {
    opts.event = 'event' in opts ? opts.event : 'data' // default to 'data' events
    return sse.serialize(opts)
  }
  
  //default to json
  return json(opts)
  
}
