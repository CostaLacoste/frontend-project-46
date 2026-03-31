const INDENT_STEP = 4

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value)

const stringify = (value, depth) => {
  if (!isObject(value)) {
    if (value === null) {
      return 'null'
    }
    return String(value)
  }

  const indent = ' '.repeat(depth * INDENT_STEP)
  const bracketIndent = ' '.repeat((depth - 1) * INDENT_STEP)
  const lines = Object.keys(value)
    .sort()
    .map(key => `${indent}${key}: ${stringify(value[key], depth + 1)}`)

  return ['{', ...lines, `${bracketIndent}}`].join('\n')
}

const formatDiff = (firstData, secondData, depth) => {
  const currentIndent = ' '.repeat(depth * INDENT_STEP)
  const signIndent = ' '.repeat(depth * INDENT_STEP - 2)
  const keys = Array.from(new Set([...Object.keys(firstData), ...Object.keys(secondData)])).sort()

  const lines = keys.flatMap((key) => {
    const hasFirst = Object.prototype.hasOwnProperty.call(firstData, key)
    const hasSecond = Object.prototype.hasOwnProperty.call(secondData, key)

    if (!hasFirst) {
      return `${signIndent}+ ${key}: ${stringify(secondData[key], depth + 1)}`
    }

    if (!hasSecond) {
      return `${signIndent}- ${key}: ${stringify(firstData[key], depth + 1)}`
    }

    const firstValue = firstData[key]
    const secondValue = secondData[key]

    if (isObject(firstValue) && isObject(secondValue)) {
      return `${currentIndent}${key}: ${formatDiff(firstValue, secondValue, depth + 1)}`
    }

    if (firstValue === secondValue) {
      return `${currentIndent}${key}: ${stringify(firstValue, depth + 1)}`
    }

    return [
      `${signIndent}- ${key}: ${stringify(firstValue, depth + 1)}`,
      `${signIndent}+ ${key}: ${stringify(secondValue, depth + 1)}`,
    ]
  })

  const bracketIndent = ' '.repeat((depth - 1) * INDENT_STEP)
  return ['{', ...lines, `${bracketIndent}}`].join('\n')
}

const formatStylish = (firstData, secondData) => formatDiff(firstData, secondData, 1)

export default formatStylish
