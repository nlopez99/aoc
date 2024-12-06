import * as fs from "node:fs/promises"

const input = await fs.readFile("./day-four/data.txt", "utf-8")
const data = input
  .trim().split("\n").map((line) => line.trim())

const partOne = () => {
  const rows = data.length
  const cols = data[0].length
  const WORD = "XMAS"

  // vectors
  const dirVectors = [
    [-1, -1], // down-left
    [-1, 0], // left
    [-1, 1], // up-left
    [0, -1], // down
    [0, 1], // up
    [1, -1], // down-right
    [1, 0], // right
    [1, 1], // up-right
  ]

  const isPosValid = (x: number, y: number) =>
    x >= 0 && x < rows && y >= 0 && y < cols

  // check if word exists starting from position (x,y) in direction (dx,dy)
  const checkDirection = (x: number, y: number, dx: number, dy: number) => {
    if (!isPosValid(x + (WORD.length - 1) * dx, y + (WORD.length - 1) * dy)) {
      return false
    }

    for (let i = 0; i < WORD.length; i++) {
      // if this char doesn't match the expected letter (WORD[i]), then the word doesn't exist
      if (data[x + i * dx][y + i * dy] !== WORD[i]) return false
    }

    return true
  }

  let count = 0
  // check each position as start
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // only check positions that start with 'X' so we don't check the same word multiple times
      if (data[i][j] === "X") {
        for (const [dx, dy] of dirVectors) {
          // check if the word exists in this direction
          if (checkDirection(i, j, dx, dy)) {
            count++
          }
        }
      }
    }
  }

  return count
}

const partTwo = () => {
  const rows = data.length
  const cols = data[0].length

  // check a single diagonal line for MAS or SAM
  const checkDiagonal = (x: number, y: number, dx: number, dy: number) => {
    // get the three characters in this diagonal
    const chars = data[x][y] +
      data[x + dx][y + dy] +
      data[x + 2 * dx][y + 2 * dy]

    return chars === "MAS" || chars === "SAM"
  }

  let count = 0

  for (let x = 1; x < rows - 1; x++) {
    for (let y = 1; y < cols - 1; y++) {
      if (data[x][y] === "A") {
        // for each A occurence, check both sets of diagonals
        const leftDiagonal = (
          // top-left to bottom-right
          checkDiagonal(x - 1, y - 1, 1, 1) ||
          // bottom-right to top-left
          checkDiagonal(x + 1, y + 1, -1, -1)
        )

        const rightDiagonal = (
          // top-right to bottom-left
          checkDiagonal(x - 1, y + 1, 1, -1) ||
          // bottom-left to top-right
          checkDiagonal(x + 1, y - 1, -1, 1)
        )

        if (leftDiagonal && rightDiagonal) {
          count++
        }
      }
    }
  }

  return count
}

console.log({ partOne: partOne(), partTwo: partTwo() })
