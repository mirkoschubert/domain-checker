const whois = require('whois-parsed-v2')
const wl = require('./wordlist')



const check = async (domain, options) => {
  const res = await whois.lookup(domain)
  return (res && res.isAvailable !== undefined) ? res.isAvailable : null
}

const wordlist = async (path, tld) => {
  const domains = await wl.get(path)
  domains.forEach(domain => {
    console.log(domain + '.' + tld)
  })
}

module.exports = {
  check,
  wordlist
}
