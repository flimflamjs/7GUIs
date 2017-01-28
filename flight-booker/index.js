const R = require('ramda')
const h = require('flimflam/h')
const serialize = require('form-serialize')
const flyd = require('flimflam/flyd')
const moment = require('moment')

function init() {
  var state = {
    type$: flyd.stream('one-way')
  , keyupDeparture$: flyd.stream()
  , keyupReturn$: flyd.stream()
  , submit$: flyd.stream()
  }

  // Convert input change event obj to moment date
  const toMoment = ev => moment(ev.currentTarget.value, 'DD.MM.YYYY', true)
  // Validate that an input change event has a valid date
  const dateIsInvalid = ev => !ev || !ev.currentTarget.value || !toMoment(ev).isValid()
  // Stream of departure dates entered by the user
  const departureDate$ = flyd.map(toMoment, state.keyupDeparture$)
  // Stream of return dates entered by the user
  const returnDate$ = flyd.map(toMoment, state.keyupReturn$)
  state.departureInvalid$ = flyd.immediate(flyd.map(dateIsInvalid, state.keyupDeparture$))
  state.returnInvalid$ = flyd.map(dateIsInvalid, state.keyupReturn$)

  state.notBeforeReturn$ = flyd.lift(
    (ret, dep, type) => type === 'round-trip' && !dep.isBefore(ret)
  , returnDate$
  , departureDate$
  , state.type$ )

  const formData$ = flyd.map(form => serialize(form, {hash: true}), state.submit$)
  state.successMessage$ = flyd.map(formatSuccessMessage, formData$)
  return state
}

function formatSuccessMessage(data) {
  var prefix = `You have booked a ${data.type} flight`
  return data.type === 'round-trip'
    ? `${prefix}, departing ${data.departureDate} and returning ${data.returnDate}`
    : `${prefix} for ${data.departureDate}`
}

function view(state) {
  return h('div', [
    h('form', {
      on: {submit: ev => {ev.preventDefault(); state.submit$(ev.currentTarget)}}
    }, [
      h('select', { 
        on: {change: ev => state.type$(ev.currentTarget.value)}
      , props: {name: 'type'}
      }, [
        h('option', {props: {value: 'one-way'}}, 'One-way flight')
      , h('option', {props: {value: 'round-trip'}}, 'Return flight')
      ])
    , h('br')
    , h('input.departureDate', {
        props: {
          name: 'departureDate'
        , type: 'text'
        , placeholder: 'Depart date (DD.MM.YYYY)'
        }
      , class: {red: state.departureInvalid$()}
      , on: {keyup: state.keyupDeparture$}
      })
    , h('br')
    , h('input.returnDate', {
        props: {
          name: 'returnDate'
        , type: 'text'
        , placeholder: state.type$() === 'one-way' ? 'No return date' : 'Return date (DD.MM.YYYY)'
        , disabled: state.type$() === 'one-way'
        }
      , class: {red: state.returnInvalid$()}
      , on: {keyup: state.keyupReturn$}
      })
    , h('br')
    , h('button', {props: {disabled: state.returnInvalid$() || state.departureInvalid$() || state.notBeforeReturn$()}}, 'Book')
    ])
  , h('p.bookingMessage', state.successMessage$() || 'No flight booked yet.')
  ])
}

module.exports = {init, view}

