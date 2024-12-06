import * as fs from "node:fs/promises"

const input = await fs.readFile("./day-three/data.txt", "utf-8")
const data = input
  .trim()

const partOne = () => {
  const matches = data.match(/mul\((?:\d{1,3}),(?:\d{1,3})\)/g)

  if (!matches) throw new Error("No matches found")

  const numbers = matches.map((match) => {
    const [a, b] = match.match(/\d{1,3}/g)!.map(Number)
    return a * b
  })

  return numbers.reduce((acc, curr) => acc + curr, 0)
}

const partTwo = () => {
  let enabled = true // mul operations start enabled
  let total = 0

  const operationPattern = /(?:do|don't)\(\)|mul\(\d{1,3},\d{1,3}\)/g
  const operations = data.match(operationPattern) ?? []

  operations.forEach((op) => {
    if (op === "do()") {
      enabled = true
    } else if (op === "don't()") {
      enabled = false
    } else if (enabled && op.startsWith("mul")) {
      const [n1, n2] = op.match(/\d+/g)?.map((num) => parseInt(num, 10)) as [
        number,
        number,
      ]

      console.log(n1, n2)

      if (n1 <= 999 && n2 <= 999) {
        total += n1 * n2
      }
    }
  })

  return total
}

console.log({ partOne: partOne(), partTwo: partTwo() })
