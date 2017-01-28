const render = require('flimflam/render')
const h = require('flimflam/h')

const counter = require('../counter')
const converter = require('../converter')
const booker = require('../flight-booker')
const timer = require('../timer')
const crud = require('../crud')

const init = () => {
  return {
    counter: counter.init()
  , converter: converter.init()
  , booker: booker.init()
  , timer: timer.init()
  , crud: timer.init()
  }
}

const view = state => {
  return h('div.max-width-4.mx-auto.mb4', [
    h('h1', 'Flimflam 7GUIs Examples')
  , h('p', [
      '7GUIs is a "benchmark" for frontend framework usability. Source code and documentation for each example implemented in Flimflam can be found '
    , h('a', {props: {href: "https://github.com/flimflamjs/7GUIs"}}, 'here')
    , '. More information about 7GUIs can be found '
    , h('a', {props: {href: 'https://github.com/eugenkiss/7guis'}}, 'here')
    , '.'
    ])
  , h('h2', "Counter")
  , counter.view(state.counter)
  , h('h2', "Temperature Converter")
  , converter.view(state.converter)
  , h('h2', "Flight Booker")
  , booker.view(state.booker)
  , h('h2', "Timer")
  , timer.view(state.timer)
  , h('h2', 'CRUD')
  // , crud.view(state.crud)
  , h('p', 'todo')
  ])
}

const container = document.body.querySelector(".container")
render(view, init(), container)
