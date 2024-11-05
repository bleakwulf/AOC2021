const fs = require('fs')
const logHeaderPrefix = 'AOC2021'
const challengeDayNo = '06'
const challengeTitle = 'Lanternfish'

const CHECK_INTERVALS = {
  MIN_DAYS: 80, 
  MAX_DAYS: 256
}
const AGE_NEW_PARENT = 6
const AGE_NEW_CHILD = 8

let rawInputData

try {
  rawInputData = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
} catch (e) {
  console.log(`Error!`)
  console.error(e)
}

const parseInput = () => rawInputData.split(`,`).map(Number)

const getTotalPopulation = rawPopulationData => rawPopulationData.reduce( (total, ageGroup) => total += ageGroup, 0)

const simulateSpawning = (
  rawData, 
  intervals = [ CHECK_INTERVALS.MAX_DAYS ]
) => {
  const maxDay = Math.max(...intervals)
  const intervalPopulations = []
  const perAgePopulation = Array(AGE_NEW_CHILD + 1).fill(0)
  
  parseInput(rawData).forEach( fishAge => perAgePopulation[fishAge]++ )
  
  let dayCount = 0
  let isSimEnd = false
  
  while( !isSimEnd) {
    let spawningPopulation = perAgePopulation.shift()
    
    perAgePopulation[AGE_NEW_PARENT] += spawningPopulation
    perAgePopulation.push(spawningPopulation)
    isSimEnd = ++dayCount >= maxDay

    if (intervals.some( interval => interval === dayCount ))
      intervalPopulations.push(getTotalPopulation(perAgePopulation))
  }

  intervalPopulations.push(getTotalPopulation(perAgePopulation))

  return intervalPopulations
}

console.info(`${logHeaderPrefix} | Day ${challengeDayNo} | ${challengeTitle}`);

if (rawInputData) {
  const t1 = performance.now()

  const [ p1, p2 ] = simulateSpawning(rawInputData, [ CHECK_INTERVALS.MIN_DAYS, CHECK_INTERVALS.MAX_DAYS ])

  console.info(`P1 : ${ p1 }`)
  console.info(`P2 : ${ p2 }`)

  const t2 = performance.now()
  console.info(`T : ${t2 - t1} ms`)
}