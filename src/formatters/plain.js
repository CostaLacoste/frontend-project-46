const COMPLEX_VALUE = '[complex value]'

const isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val)

const formatValue = (value) => {
  if (isObject(value)) return COMPLEX_VALUE
  if (value === null) return 'null'
  if (typeof value === 'string') return `'${value}'`
  return String(value)
}

const buildChanges = (data1, data2, pathPrefix = '') => {
  const keys = Array.from(new Set([...Object.keys(data1), ...Object.keys(data2)])).sort()
  const changes = []

  for (const key of keys) {
    const path = pathPrefix ? `${pathPrefix}.${key}` : key
    const has1 = Object.prototype.hasOwnProperty.call(data1, key)
    const has2 = Object.prototype.hasOwnProperty.call(data2, key)
    const val1 = data1[key]
    const val2 = data2[key]
    const obj1 = has1 && isObject(val1)
    const obj2 = has2 && isObject(val2)

    if (has1 && has2) {
      if (obj1 && obj2) {
        changes.push(...buildChanges(val1, val2, path))
      } else if (!obj1 && !obj2) {
        if (val1 !== val2) {
          changes.push({ path, status: 'updated', oldValue: val1, newValue: val2 })
        }
      } else if (obj1 && !obj2) {
        changes.push({ path, status: 'updated', oldValue: val1, newValue: val2 })
      } else {
        changes.push({ path, status: 'updated', oldValue: val1, newValue: val2 })
      }
    } else if (has1) {
      changes.push({ path, status: 'removed' })
    } else {
      changes.push({ path, status: 'added', value: val2 })
    }
  }
  return changes
}

const formatChange = (change) => {
  const { path, status } = change
  const prop = `'${path}'`
  switch (status) {
    case 'added':
      return `Property ${prop} was added with value: ${formatValue(change.value)}`
    case 'removed':
      return `Property ${prop} was removed`
    case 'updated':
      return `Property ${prop} was updated. From ${formatValue(change.oldValue)} to ${formatValue(change.newValue)}`
    default:
      return ''
  }
}

const formatPlain = (data1, data2) => {
  const changes = buildChanges(data1, data2)
  changes.sort((a, b) => a.path.localeCompare(b.path))
  return changes.map(formatChange).join('\n')
}

export default formatPlain
