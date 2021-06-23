const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const randomInterval = (min, max) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const keypress = async () => {
  process.stdin.setRawMode(true)
  return new Promise(resolve => process.stdin.once('data', () => {
    process.stdin.setRawMode(false)
    resolve()
  }))
}

module.exports = {
  wait,
  randomInterval,
  keypress
}
