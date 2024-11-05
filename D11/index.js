const fs = require('fs')
const logHeaderPrefix = 'AOC2021'
const challengeDayNo = '11'
const challengeTitle = 'Dumbo Octopus'

const MAX_ENERGY_LEVEL = 9
const SIM_END_MODE = {
  MAX_INTERVAL: 0, 
  FIRST_FULL_FLASH: 1
}
const DEFAULT_MAX_STEP_INTERVAL = 100

let rawInputData, inputData

try {
  rawInputData = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
} catch (e) {
  console.log(`Error!`)
  console.error(e)
}

const parseEnergyLevels = (rawData, maxSteps )=> rawData
  .split(`\n`)
  .map( rowData => Array.from(rowData).map(Number) )

const simulateSteps = ( 
  rawInput, 
  simEndMode = SIM_END_MODE.MAX_INTERVAL, 
  maxSteps = DEFAULT_MAX_STEP_INTERVAL
) => {
  const energyLevels = parseEnergyLevels(rawInput)
  const columnCount = energyLevels.at(0).length
  const populationSize = energyLevels.length * columnCount 

  let flashCount = 0
  let stepCount = 0
  let isContinue = true

  do {
    stepCount++
    const octopusToFlash = new Map()

    //  init energy level increase and gather init batch of octopuses eligible to flash
    for( let rowIndex = 0; rowIndex < energyLevels.length; rowIndex++ ) {
      for( let columnIndex = 0; columnIndex < columnCount; columnIndex++ ) {
        let energyLevel = ++energyLevels[rowIndex][columnIndex]

        if (energyLevel <= MAX_ENERGY_LEVEL) 
          continue

        const position = `${rowIndex}|${columnIndex}`

        octopusToFlash.set(
          position, 
          { position, xCoord: rowIndex, yCoord: columnIndex, energyLevel, hasFlashed: false  }
        )
      }
    }

    let isContinueFlashing = !!octopusToFlash.size

    if (!isContinueFlashing) 
      continue

    do {
      Array
        .from( octopusToFlash.values() )
        .filter( ({ hasFlashed }) => !hasFlashed )
        .forEach( ({ position, xCoord, yCoord, energyLevel, hasFlashed }) => {
          ++octopusToFlash.get(position).energyLevel
          octopusToFlash.get(position).hasFlashed = true

          let neighbors = []

          // get neighbors' coordinates clockwise
          if (!!xCoord)
            neighbors.push([xCoord - 1, yCoord])  

          if (!!xCoord && yCoord + 1 < columnCount)
            neighbors.push([xCoord - 1, yCoord + 1])  

          if (yCoord + 1 < columnCount)
            neighbors.push([xCoord, yCoord + 1])  

          if (xCoord + 1 < energyLevels.length && yCoord + 1 < columnCount)  
            neighbors.push([xCoord + 1, yCoord + 1])

          if (xCoord + 1 < energyLevels.length)
            neighbors.push([xCoord + 1, yCoord])  

          if (xCoord + 1 < energyLevels.length && !!yCoord)
            neighbors.push([xCoord + 1, yCoord - 1])  

          if (!!yCoord)
            neighbors.push([xCoord, yCoord -1])  

          if (!!xCoord && !!yCoord)
            neighbors.push([xCoord - 1, yCoord - 1])  

          //  assess neighbors eligible to flash
          neighbors.forEach( ([nCoordX, nCoordY]) => {
            let neighborEnergy = ++energyLevels[nCoordX][nCoordY]

            if (neighborEnergy > MAX_ENERGY_LEVEL) {
              let neighborPosition = `${nCoordX}|${nCoordY}`

              if (!octopusToFlash.get(neighborPosition))
                octopusToFlash.set(
                  neighborPosition, 
                  { 
                    position: neighborPosition, 
                    xCoord: nCoordX, 
                    yCoord: nCoordY, 
                    energyLevel: neighborEnergy, 
                    hasFlashed: false  }
                )
              else
                octopusToFlash.get(neighborPosition).energyLevel = neighborEnergy
            }
          })
        })

      isContinueFlashing = !!Array
        .from( octopusToFlash.values() )
        .filter( ({ hasFlashed }) => !hasFlashed )
        .length

    } while ( isContinueFlashing )

    flashCount += octopusToFlash.size

    //  determine end of simulation
    isContinue = simEndMode === SIM_END_MODE.MAX_INTERVAL 
      ? stepCount < maxSteps
      : octopusToFlash.size !== populationSize

    //  reset energy levels of flashed octopuses
    if (isContinue)
      Array
        .from( octopusToFlash.values() )
        .forEach( ({ xCoord, yCoord }) => energyLevels[xCoord][yCoord] = 0 )

  } while ( isContinue )

  return { flashCount, stepCount }
}

const solveP1 = rawInput => {
  const { flashCount } = simulateSteps(rawInput)
  return flashCount
}

const solveP2 = rawInput => {
  const { stepCount } = simulateSteps(rawInput, SIM_END_MODE.FIRST_FULL_FLASH)
  return stepCount
}

console.info(`${logHeaderPrefix} | Day ${challengeDayNo} | ${challengeTitle}`);

if (rawInputData) {
  const t1 = performance.now()

  console.info(`P1 : ${solveP1(rawInputData)}`)
  console.info(`P2 : ${solveP2(rawInputData)}`)

  const t2 = performance.now()
  console.info(`T : ${t2 - t1} ms`)
}