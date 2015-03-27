const types = {
  dash: require('case-dash'),
  snake: require('case-snake'),
  dot: require('case-dot'),
  camel: require('case-camel')
}

const methods = ['parse', 'stringify', 'is']

function concat (a, b) {
  return a.concat(b)
}

function isMethod (key) {
  return (key in this) && typeof this[key] === 'function'
}

function isType (type) {
  return types[type].is(this)
}

export function addCase (name, obj) {
  name = String(name)

  if(typeof obj !== 'object') {
    throw new Error('Can only add new cases of type object')
  }

  if(!methods.every(isMethod, obj)) {
    throw new Error(`Added cases must have the methods ${methods}`)
  }

  types[name] = obj
}

export function identify (val) {
  const types = this.identifyAll(val)

  if(types.length) {
    return types[0]
  }
  return undefined
}

export function identifyAll (val) {
  if(typeof val === 'undefined' || val === null) {
    return []
  }

  val = String(val)

  return Object.keys(types).filter(isType, val)
}

export function parseAs (val, type) {
  if(!(type in types)) {
    throw new Error(`Unknown case: ${type}`)
  }

  return types[type].parse(val)
}

export function parse (val) {
  if(typeof val === 'undefined' || val === null) {
    return []
  }

  val = String(val)
  const type = this.identify(val)
  if(typeof type === 'undefined') {
    return val
  }
  return this.parseAs(val, type)
}

export function parseAll (val) {
  let ret = []

  if(typeof val === 'undefined' || val === null) {
    return []
  }

  ret.push(String(val))

  for(let type of identifyAll(val)) {
    ret = ret.map(function (str) {
      return parseAs(str, type)
    }).reduce(concat, [])
  }

  return ret
}

export function stringify (val, type) {
  if(!(type in types)) {
    throw new Error(`Unknown case: ${type}`)
  }

  return types[type].stringify(val)
}

export function convert (val, fromType, toType) {
  let parsed

  if(arguments.length < 3) {
    toType = fromType
    fromType = undefined
  }

  if(typeof fromType === 'undefined') {
    parsed = this.parseAll(val)
  } else {
    parsed = this.parseAs(val, fromType)
  }

  return this.stringify(parsed, toType)
}
