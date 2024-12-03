import * as fs from "node:fs/promises"

const input = await fs.readFile("./day-one/data.txt", "utf-8")
const lines = input
  .trim()
  .split("\n")
  .map((line) => {
    const nums = line.trim().split(/\s+/).map(Number)
    if (nums.length !== 2 || isNaN(nums[0]) || isNaN(nums[1])) {
      console.log("Invalid line:", line, "parsed as:", nums)
      throw new Error("Invalid input format")
    }
    return nums
  })

const maxArrLen = Math.max(...lines.flat())

// init buckets
const firstBucket = new Array(maxArrLen + 1).fill(0)
const secondBucket = new Array(maxArrLen + 1).fill(0)
const secondFreqMap = new Array(maxArrLen + 1).fill(0)

// fill buckets
for (const [first, second] of lines) {
  firstBucket[first]++
  secondBucket[second]++
  secondFreqMap[second]++
}

let partOne = 0
let firstIndex = 0
let secondIndex = 0
let remainingPairs = lines.length

while (remainingPairs > 0) {
  // find next number in first arr
  while (firstIndex <= maxArrLen && firstBucket[firstIndex] === 0) {
    firstIndex++
  }
  // find nex number in second arr
  while (secondIndex <= maxArrLen && secondBucket[secondIndex] === 0) {
    secondIndex++
  }

  // invariant: we have at least one number in each array
  if (firstIndex > maxArrLen || secondIndex > maxArrLen) {
    throw new Error("Ran out of numbers before matching all pairs")
  }

  // process the min number of pairs we can make with current numbers
  const pairs = Math.min(firstBucket[firstIndex], secondBucket[secondIndex])
  const distance = Math.abs(firstIndex - secondIndex)

  partOne += distance * pairs

  // update buckets
  firstBucket[firstIndex] -= pairs
  secondBucket[secondIndex] -= pairs
  remainingPairs -= pairs
}

const partTwo = lines.reduce((sum, [first]) => {
  const count = secondFreqMap[first] ?? 0
  return sum + (first * count)
}, 0)

console.log({ partOne, partTwo })
