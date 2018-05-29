'use strict'

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
// Steff
const moment = require('moment')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API: '"http://192.168.0.190:3333/api"',
  BUILD_DATETIME: '"' + moment().format('DD/MM/YYYY HH:mm:ss') + '"'
})
