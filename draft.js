const fs = require('fs')
const logHeaderPrefix = 'AOC2021'
const challengeDayNo = '01'
const challengeTitle = 'Sonar Sweep'

let rawInputData, inputData
let doCustomLog = true  // for debugging

try {
  rawInputData = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
} catch (e) {
  console.log(`Error!`)
  console.error(e)
}

const customLog = message => doCustomLog && console.log(message)

const parseInput = () => {
  inputData = rawInputData.split('\n\n')
}

const solveP1 = rawInput => { }

const solveP2 = rawInput => { }

console.info(`${logHeaderPrefix} | Day ${challengeDayNo} | ${challengeTitle}`);

if (rawInputData) {
  const t1 = performance.now()
  parseInput()

  console.info(`P1 : ${solveP1(inputData)}`)
  console.info(`P2 : ${solveP2(inputData)}`)

  const t2 = performance.now()
  console.info(`T : ${t2 - t1} ms`)
}