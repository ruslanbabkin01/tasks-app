const isAccessible = require('./isAccessible')
const fs = require('fs').promises

// створює папку, якщо її не існує
const createFolderIsNotExist = async folder => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder)
  }
}

module.exports = createFolderIsNotExist
