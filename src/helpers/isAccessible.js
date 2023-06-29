const fs = require('fs').promises

// повертає логічне вираження чи iснує папка
const isAccessible = path => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false)
}

module.exports = isAccessible
