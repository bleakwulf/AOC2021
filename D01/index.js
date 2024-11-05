const fs = require('fs')
const logHeaderPrefix = 'AOC2021'
const challengeDayNo = '01'
const challengeTitle = 'Sonar Sweep'

const DEFAULT_SLIDING_WINDOW_SIZE = 1
let rawInputData

try {
  rawInputData = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
} catch (e) {
  console.log(`Error!`)
  console.error(e)
}

const parseInput = (rawData) => rawData.split('\n').map(Number)

const countDepthIncrements = (input, windowSize = DEFAULT_SLIDING_WINDOW_SIZE) => {
  let depthIncrements = 0
  let lastSlidingSum

  for (
    iStart = 0, iEnd = windowSize;
    iEnd <= input.length;
    iStart++, iEnd++
  ) {
    let currentSum = input
      .slice(iStart, iEnd)
      .reduce((sum, reading) => sum += reading, 0)

    if (currentSum > lastSlidingSum ?? currentSum) depthIncrements++

    lastSlidingSum = currentSum
  }

  return depthIncrements
}

console.info(`${logHeaderPrefix} | Day ${challengeDayNo} | ${challengeTitle}`);

if (rawInputData?.length) {
  const t1 = performance.now()

  let inputData = parseInput(rawInputData)

  console.info(`P1 : ${countDepthIncrements(inputData)}`)
  console.info(`P2 : ${countDepthIncrements(inputData, 3)}`)

  const t2 = performance.now()
  console.info(`T : ${t2 - t1} ms`)
}