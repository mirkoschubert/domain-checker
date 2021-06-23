const fse = require('fs-extra')

const get = async (path) => {
  const data = await fse.readFile(path, 'utf-8')
  const lines = data.split(/\r?\n/)
  return lines
}

module.exports = {
  get
}
