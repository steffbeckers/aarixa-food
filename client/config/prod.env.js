// Steff
const moment = require('moment')

module.exports = {
  NODE_ENV: '"production"',
  API: '"https://aarixafood.steffbeckers.eu/api"',
  BUILD_DATETIME: '"' + moment().format('DD/MM/YYYY HH:mm:ss') + '"'
}
