import * as fs from "node:fs/promises"

async function parseFile(
  filePath: string,
): Promise<{
  firstArray: number[]
  secondArray: number[]
}> {
  const fileContent = await fs.readFile(filePath, "utf-8")

  const firstArray: number[] = []
  const secondArray: number[] = []

  const lines = fileContent.trim().split("\n")

  lines.forEach((line, index) => {
    const numbers = line.trim().split(/\s+/)

    if (numbers.length !== 2) {
      throw new Error(
        `Invalid format at line ${
          index + 1
        }. Expected 2 numbers, got ${numbers.length}`,
      )
    }

    const firstNum = parseInt(numbers[0], 10)
    const secondNum = parseInt(numbers[1], 10)

    if (isNaN(firstNum) || isNaN(secondNum)) {
      throw new Error(`Invalid number at line ${index + 1}`)
    }

    firstArray.push(firstNum)
    secondArray.push(secondNum)
  })

  return {
    firstArray,
    secondArray,
  }
}

const partOne = async () => {
  const { firstArray, secondArray } = await parseFile("./day-1/data.txt")

  const sortedFirstArr = firstArray.sort((a, b) => a - b)
  const sortedSecondArr = secondArray.sort((a, b) => a - b)

  if (sortedFirstArr.length !== sortedSecondArr.length) {
    throw new Error("Arrays are not the same length")
  }

  let total = 0
  for (let i = 0; i < sortedFirstArr.length; i++) {
    total += Math.abs(sortedFirstArr[i] - secondArray[i])
  }

  console.log({ partOneAnswer: total })
}

const partTwo = async () => {
  const { firstArray, secondArray } = await parseFile("./day-1/data.txt")

  const secondArrayfreqMap = Object.groupBy(secondArray, (item) => item)

  const secondArrayElemCounts = Object.fromEntries(
    Object.entries(secondArrayfreqMap).map(([k, v]) => [k, v?.length ?? 0]),
  )

  let total = 0

  for (let i = 0; i < firstArray.length; i++) {
    const num = firstArray[i]

    if (!num) {
      throw new Error(`Invalid number at index ${i}`)
    }

    if (secondArrayElemCounts[num] > 0) {
      total += num * secondArrayElemCounts[num]
    }
  }

  console.log({ partTwoAnswer: total })
}

await partOne()
await partTwo()
