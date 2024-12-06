import fs from "node:fs/promises"

const input = await fs.readFile("./day-five/data.txt", "utf-8")
const [rulesSection, updatesSection] = input.trim().split("\n\n")

const rules = rulesSection.split("\n").map((rule) => {
  const [before, after] = rule.split("|").map((num) => parseInt(num, 10))
  return [before, after]
})

const updates = updatesSection.split("\n")
  .map((line) => line.split(",").map((num) => parseInt(num, 10)))

const partOne = () => {
  const isValidUpdate = (pages: number[]) => {
    for (const [before, after] of rules) {
      // only check where both pages are in this update
      if (pages.includes(before) && pages.includes(after)) {
        // get pos of these pages in the update
        const beforePos = pages.indexOf(before)
        const afterPos = pages.indexOf(after)

        if (beforePos > afterPos) {
          return false
        }
      }
    }
    return true
  }

  let sum = 0

  // total each updates middle number
  for (const update of updates) {
    if (isValidUpdate(update)) {
      const middleIndex = Math.floor(update.length / 2)
      sum += update[middleIndex]
    }
  }

  return sum
}

const partTwo = () => {
  const isValidUpdate = (pages: number[]) => {
    for (const [before, after] of rules) {
      if (pages.includes(before) && pages.includes(after)) {
        const beforePos = pages.indexOf(before)
        const afterPos = pages.indexOf(after)
        if (beforePos > afterPos) {
          return false
        }
      }
    }
    return true
  }

  const topologicalSort = (pages: number[]) => {
    // build adjacency list for these pages
    const graph = new Map<number, Set<number>>()
    const inDegree = new Map<number, number>()

    // init graph and inDegree
    pages.forEach((page) => {
      graph.set(page, new Set())
      inDegree.set(page, 0)
    })

    // add edges from rules
    for (const [before, after] of rules) {
      if (pages.includes(before) && pages.includes(after)) {
        ;(graph.get(before) as Set<number>).add(after)
        inDegree.set(after, inDegree.get(after) as number + 1)
      }
    }

    // find nodes with no incoming edges
    const queue = pages.filter((page) => inDegree.get(page) === 0)
    const result: number[] = []

    // process queue
    while (queue.length > 0) {
      const current = queue.shift()!
      result.push(current)

      // update neighbors
      for (const neighbor of graph.get(current)!) {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1)
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor)
        }
      }
    }

    return result
  }

  let sum = 0

  // total each invalid updates middle number
  for (const update of updates) {
    if (!isValidUpdate(update)) {
      const sortedUpdate = topologicalSort(update)
      const middleIdx = Math.floor(sortedUpdate.length / 2)
      sum += sortedUpdate[middleIdx]
    }
  }

  return sum
}

console.log({ partOne: partOne(), partTwo: partTwo() })
