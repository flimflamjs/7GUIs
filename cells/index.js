const R = require('ramda')
const h = require('flimflam/h')
const render = require('flimflam/render')
const flyd = require('flyd')

function init() {
  var state = {}
  return state
}

function view(state) {
  return h('body', [
    'hallo welt'
  ])
}

render(view, init(), document.body)
module.exports = {init, view}
