const net = require('net')

const CRLF = "\r\n"
const servers = require('./servers.json')


/**
 * Parses a WHOIS response and returns the availability of a domain
 * 
 * @param {String} raw Raw resonse
 * @param {String} tld Top Level Domain
 * @returns {Boolean}
 */
const parse = (raw, tld) => {
  const regex = require('./regex.json')
  const notFoundRegex = regex[tld] ? regex[tld] : regex['default']
  var isAvailable = false

  if (raw.match(new RegExp(notFoundRegex))) {
    isAvailable = true
  }
  return isAvailable
}


/**
 * Looks up a domain and returns the raw WHOIS response
 * 
 * @param {String} name Domain name without TLD
 * @param {String} tld Top Level Domain
 * @param {Object} options 
 * @returns {String}
 */
const lookup = (name, tld, options) => {
  options = (options === undefined || typeof options !== 'object') ? { } : options
  options.timeout = (typeof options.timeout === 'undefined') ? 5000 : options.timeout;
  options.port = (typeof options.port === 'undefined') ? 43 : options.port;
  options.format = (typeof options.format === 'undefined') ? false : options.format;

  const address = name + '.' + tld
  const serverName = (typeof servers[tld] === 'object') ? servers[tld].host : servers[tld]
  const serverQuery = (typeof servers[tld] === 'object' && servers[tld].query !== undefined) ? servers[tld].query.replace('$addr', address) : address

  //console.log(serverName, serverQuery)
  if(!serverName) return Promise.reject(new Error('Failed to lookup'))
  return new Promise((resolve, reject) => {
    let buffer = ''

    const socket = net.createConnection(options.port, serverName, () => {
      socket.write(serverQuery + CRLF)
    })

    socket.setEncoding('utf-8')
    socket.setTimeout(options.timeout)

    socket.on('data', (data) => {
      buffer += data
    })
    socket.on('end', () => {
      socket.destroy()
      resolve(buffer)
    })
    socket.on('error', err => reject(err))
    socket.on('timeout', () => {
      reject(new Error('Server timeout'))
    })
  })
}


module.exports = {
  lookup,
  parse
}
