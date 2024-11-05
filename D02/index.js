const fs = require('fs')
const logHeaderPrefix = 'AOC2021'
const challengeDayNo = '02'
const challengeTitle = 'Dive!'

const DIRECTIONS = {
  FORWARD : `forward`,
  UPWARD : `up`,
  DOWNWARD : `down`
}

let rawInputData

try {
  rawInputData = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
} catch (e) {
  console.log(`Error!`)
  console.error(e)
}

const solveP1 = (input) => { 
  let [ forwardCount, upCount, downCount ] = [
      // all forward moves 
      Array.from(
        input.matchAll(/^forward (?<increment>(\d{1,}))$/gm), 
        ( { groups: { increment } } ) => +increment
      ), 
      // all upward moves 
      Array.from(
        input.matchAll(/^up (?<increment>(\d{1,}))$/gm), 
        ( { groups: { increment } } ) => -increment
      ), 
      // all downward moves 
      Array.from(
        input.matchAll(/^down (?<increment>(\d{1,}))$/gm), 
        ( { groups: { increment } } ) => +increment
      )
    ]
    .map( moves => moves.reduce( (sum, value) => sum += value, 0 ) )

  return forwardCount * (upCount + downCount)
}

const solveP2 = input => {
  const moves = input.split('\n')
  
  let distance = 0
  let depth = 0
  let aim = 0
  
  for ( i = 0; i < moves.length; i++ ) {
    const [ direction, units ] = moves[i].split(' ')

    switch (direction) {
      case DIRECTIONS.UPWARD    : aim += -units; break;
      case DIRECTIONS.DOWNWARD  : aim += +units; break;
      default:  // forward
        distance += +units
        depth += +units * aim
        break
    }
  }

  return distance * depth
}

console.info(`${logHeaderPrefix} | Day ${challengeDayNo} | ${challengeTitle}`);

if (rawInputData) {
  const t1 = performance.now()

  console.info(`P1 : ${solveP1(rawInputData)}`)
  console.info(`P2 : ${solveP2(rawInputData)}`)

  const t2 = performance.now()
  console.info(`T : ${t2 - t1} ms`)
}