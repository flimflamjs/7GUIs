const R = require('ramda')

// Parse cell expressions

const updateSheet = (loc, newExpr, sheet) => {
  // Find all references to other cells in this expression
  const oldRefs = findRefs(sheet.formulas[loc] || '')
  const refs = findRefs(newExpr)
  if(R.contains(loc, refs)) {
    return sheet
  }
  const toRemove = R.difference(oldRefs, refs)
  const toAdd = R.difference(refs, oldRefs)
  addRefs(toAdd, loc, sheet)
  removeRefs(toRemove, loc, sheet)
  sheet.formulas[loc] = newExpr
  // Re-evaluate the given expression
  evaluateExpr(loc, sheet)
  // Re-evaluate all the other cells that reference this cell
  const dependents = sheet.references[loc] || []
  R.map(loc => evaluateExpr(loc, sheet), dependents)
  return sheet
}

const findRefs = expr => {
  const regex = /[A-Z][1-9]([1-9])?/g
  return R.match(regex, expr)
}

// Add new references
// This mutates sheet
const addRefs = (toAdd, loc, sheet) => {
  R.map(
    r => {
      sheet.references[r] = sheet.references[r] || []
      const ref = sheet.references[r]
      ref.push(loc)
    }
  , toAdd
  )
}

// Remove existing references
// This mutates sheet
const removeRefs = (toRemove, loc, sheet) => {
  R.map(
    r => {
      sheet.references[r] = sheet.references[r] || []
      const refs = sheet.references[r]
      const idx = R.findIndex(R.equals(r), refs)
      sheet.references[r] = R.remove(idx, 1, refs)
    }
  , toRemove
  )
}

// Given a location, an expression, and a full sheet
// Return the new sheet with the value updated for the expression
// This mutates the sheet object
const evaluateExpr = (location, sheet) => {
  const expr = sheet.formulas[location]
  try {
    eval(`with(sheet.values) {sheet.values[location] = eval(expr)}`) // lol fun times
  } catch(e) {
    console.log({e})
  }
  return sheet
}

module.exports = updateSheet
