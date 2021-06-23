const { Command } = require('commander')
const chalk = require('chalk')

const domains = require('./lib/domains')
const whois = require('./lib/whois')

const app = new Command()

app
  .version(require('./package.json').version, '-V, --version')
  .description('Checks if one or multiple domains are available')

app
  .command('check <domain>')
  .description('Checks only one domain for availability')
  .option('-d, --dns', 'Specific DNS server')
  .option('-f, --full', 'Show full whois response')
  .action(async (domain, options) => {
    const tld = domain.replace(/^.+?(\.|$)/, '').toLowerCase()
    const name = domain.substr(0, domain.indexOf('.')).toLowerCase()

    try {
      const res = await whois.lookup(name, tld)
      if (options.full) console.log('\n' + chalk.blue('Full WHOIS response:') + '\n\n' + res)
      const available = whois.parse(res, tld)
      console.log('\nThe domain', chalk.blue(domain), 'is', available ? chalk.green('available!\n') : chalk.red('not available!\n'))
    } catch (e) {
      console.error(chalk.red(e.message))
      process.exit(1)
    }
  })

app
  .command('wordlist <wordlist> [tld]')
  .description('Checks multiple domains with a wordlist')
  .option('-d, --dns', 'Specific DNS server')
  .action(async (wordlist, tld, options) => {
    await domains.wordlist(wordlist, tld || 'com')
  })

app.parse(process.argv)
