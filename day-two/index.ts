import fs from "node:fs/promises"

const input = await fs.readFile(new URL("./data.txt", import.meta.url), "utf8")

const isValidSequence = (levels: number[]): boolean => {
  const len = levels.length
  if (len <= 1) return false

  const sign = Math.sign(levels[1] - levels[0])
  if (sign === 0) return false

  for (let i = 1; i < len; i++) {
    const diff = levels[i] - levels[i - 1]
    if (Math.sign(diff) !== sign || diff * sign < 1 || diff * sign > 3) {
      return false
    }
  }
  return true
}

const isValidWithDampener = (levels: number[]): boolean => {
  if (isValidSequence(levels)) return true

  // remove each number one at a time to see if it's valid after dampening
  for (let i = 0; i < levels.length; i++) {
    const dampened = [...levels.slice(0, i), ...levels.slice(i + 1)]
    if (isValidSequence(dampened)) {
      return true
    }
  }

  return false
}

const partOne = () => {
  let count = 0
  let currLevels: number[] = []
  let currLevel = 0
  let isNegative = false

  // parse input as strings
  for (let i = 0; i < input.length; i++) {
    const char = input[i]

    if (char === "-") {
      isNegative = true
      continue
    }

    if (char >= "0" && char <= "9") {
      currLevel = currLevel * 10 + (char.charCodeAt(0) - 48) // build up the number digit by digit
      continue
    }

    if (char === " " || char === "\n" || i === input.length - 1) {
      if (isNegative) {
        currLevel = -currLevel
        isNegative = false
      }

      if (currLevel !== 0 || char === " ") {
        currLevels.push(currLevel)
      }

      currLevel = 0

      if (char === "\n" || i === input.length - 1) {
        if (isValidSequence(currLevels)) {
          count++
        }
        currLevels = []
      }
    }
  }

  return count
}

const partTwo = () => {
  // same string parsing as part one to build the arrs
  let count = 0
  let currLevels: number[] = []
  let currLevel = 0
  let isNegative = false

  for (let i = 0; i < input.length; i++) {
    const char = input[i]

    if (char === "-") {
      isNegative = true
      continue
    }

    if (char >= "0" && char <= "9") {
      currLevel = currLevel * 10 + (char.charCodeAt(0) - 48)
      continue
    }

    if (char === " " || char === "\n" || i === input.length - 1) {
      if (isNegative) {
        currLevel = -currLevel
        isNegative = false
      }
      if (currLevel !== 0 || char === " ") {
        currLevels.push(currLevel)
      }
      currLevel = 0

      if (char === "\n" || i === input.length - 1) {
        if (isValidWithDampener(currLevels)) {
          count++
        }
        currLevels = []
      }
    }
  }

  return count
}

console.log({
  partOne: partOne(),
  partTwo: partTwo(),
})
