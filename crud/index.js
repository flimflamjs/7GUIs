const R = require('ramda')
const h = require('flimflam/h')
const flyd = require('flimflam/flyd')
const serialize = require('form-serialize')
const uuid = require('uuid')

function init() {
  var state = {
    filter$:       flyd.stream('')
  , selected$:     flyd.stream()
  , clickCreate$:  flyd.stream()
  , clickUpdate$:  flyd.stream()
  , clickDelete$:  flyd.stream()
  }

  const toCreate$ = validSubmit(state.clickCreate$)
  const toUpdate$ = validSubmit(state.clickUpdate$)
  // Sample from the currently selected name on every delete click
  const toDelete$ = flyd.sampleOn(state.clickDelete$, state.selected$)
  const entries$ = flyd.scanMerge([
    [toCreate$, createEntry]
  , [toUpdate$, updateEntry]
  , [toDelete$, deleteEntry]
  ], defaultEntries)

  state.filteredEntries$ = flyd.lift(filter, entries$, state.filter$)

  return state
}

const defaultEntries = [
  {firstName: 'Hans', lastName: 'Emil', id: uuid.v1()}
, {firstName: 'Max', lastName: 'Mustermann', id: uuid.v1()}
, {firstName: 'Roman', lastName: 'Tisch', id: uuid.v1()}
]

// -- Utils
const getFormData = flyd.map(ev => serialize(ev.currentTarget.form, {hash: true}))
const isNonEmpty = flyd.filter(data => data.firstName && data.lastName)
const validSubmit = R.compose(isNonEmpty, getFormData)

const createEntry = (entries, {firstName, lastName}) => {
  const id = uuid.v1()
  const person = {firstName, lastName, id}
  return R.append(person, entries)
}

const updateEntry = (entries, {id, firstName, lastName})=> {
  const idx = findByID(id)(entries)
  if(idx === -1) return entries
  const updated = R.merge(entries[idx], {firstName, lastName})
  return R.update(idx, updated, entries)
}

const deleteEntry = (entries, {id}) => {
  const idx = findByID(id)(entries)
  if(idx === -1) return entries
  return R.remove(idx, 1, entries)
}

const findByID = id => 
  R.findIndex(R.propEq('id', id))

const killSubmit = ev => {
  ev.preventDefault() 
  ev.stopPropogation()
}

// Apply the filter string as entered by the user
function filter(entries, searchWord) {
  if(!searchWord || !searchWord.length) return entries
  const isMatch = R.compose(matchesSearch(searchWord), R.prop('lastName'))
  return R.filter(isMatch, entries)
}
const matchesSearch = searchWord => n => 
  n.toLowerCase().indexOf(searchWord.toLowerCase()) !== -1


// -- View functions

function view(state) {
  return h('div', [
    searchFilter(state)
  , h('form', {on: {submit: killSubmit}}, [
      h('ol', R.map(nameOption(state), state.filteredEntries$()))
    , fields(state)
    , actions(state)
    ])
  ])
}

function searchFilter(state) {
  return h('div', [
    h('label', ['Filter by ', h('strong', 'surname:'), ' '])
  , h('input.filter', {
      props: {type: 'text', name: 'filter'}
    , on: {keyup: ev => state.filter$(ev.currentTarget.value)}
    })
  ])
}

function fields(state) {
  const selected = state.selected$() || {}
  return h('div', [
    h('div', [
      h('label', 'Name: ')
    , h('input.name', {props: {name: 'firstName', type: 'text', value: selected.firstName || ''}})
    ])
  , h('div', [
      h('label', 'Surname: ')
    , h('input.surname', {props: {name: 'lastName', type: 'text', value: selected.lastName || ''}})
    ])
  , h('input', {props: {type: 'hidden', name: 'id', value: selected.id}})
  ])
}

function actions(state) {
  return h('div', [
    h('button.create', {
      on: {click: state.clickCreate$}
    , props: {type: 'button'}
    }, "Create")
    , h('button.update', {
      on: {click: state.clickUpdate$}
    , props: {disabled: !state.selected$(), type: 'button'}
    }, "Update")
    , h('button.delete', {
      on: {click: state.clickDelete$}
    , props: {disabled: !state.selected$(), type: 'button'}
    }, "Delete")
  ])
}

// A single item within the listing of selectable entries
const nameOption = state => entry => {
  const isMatched = state.selected$() && state.selected$().id === entry.id
  return h('li' , {
    on: {click: [state.selected$, isMatched ? undefined : entry]}
  , style: {background: isMatched ? '#d8d8d8' : ''}
  }, entry.lastName + ', ' + entry.firstName)
}

module.exports = {init, view}
