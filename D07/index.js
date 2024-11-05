const fs = require('fs')
const logHeaderPrefix = 'AOC2021'
const challengeDayNo = '07'
const challengeTitle = 'The Treachery of Whales'

let rawInputData

try {
  rawInputData = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
} catch (e) {
  console.log(`Error!`)
  console.error(e)
}

const parseInput = rawData => Array.from(
    rawData.matchAll(/(?<crabPosition>(\d{1,}))/gm),
    ( { groups: { crabPosition } } ) => +crabPosition
  ).sort( ( crabPosition1, crabPosition2 ) => crabPosition1 < crabPosition2 ? -1 
      : crabPosition1 > crabPosition2 ? 1 
      : 0 
  )

const calculateOptimumFuel = rawData => {
  const data = parseInput(rawData)
  
  const populationMap = data.reduce( (populationMap, position) => {
      populationMap.set( position, 1 + ( populationMap.get(position) ?? 0 ) )
      return populationMap
    }, new Map())
  
  // get median
  let median 
  const isExactMedian = !!( data.length % 2 )
  const midPoint = Math.ceil( data.length / 2 )

  if (isExactMedian) median = data.at( midPoint )
  else {
    const optionRef = [ data.at( midPoint ), data.at( midPoint + 1) ]
    const optionFuelSavings = optionRef.map( option => populationMap.get(option) * option)
    median = optionRef.at( optionFuelSavings.indexOf( Math.max(...optionFuelSavings) ) )
  }

  // get mean options
  let baseMean = data.reduce( (total, currentPosition) => total += currentPosition, 0 ) / data.length
  let [ minMean, maxMean ] = [ Math.floor(baseMean), Math.ceil(baseMean) ]
  
  const { 
    atConstantFuelCost, 
    atIncreasingFuelCostPerMinMean, 
    atIncreasingFuelCostPerMaxMean 
  } = data.reduce( (totalFuelCost, position ) => {
    totalFuelCost.atConstantFuelCost += Math.abs(position - median)

    let [ costPerMinMean, costPerMaxMean ] = [ minMean, maxMean ]
      .map( meanRef => {
        let range = Math.abs(position - meanRef)

        /** compute and return sum of arithmetic progression 
        *  i.e., n / 2 * ( 2 * a + ( n − 1 ) * d )
        *    where n is the expected number of progression
        *      a is the initial number of progression (1 in this case)
        *      d is the increment per progression (also 1 in this case)
        */
        return range / 2 * ( 2 * 1 + (range - 1) * 1)
      })
  
    totalFuelCost.atIncreasingFuelCostPerMinMean += costPerMinMean
    totalFuelCost.atIncreasingFuelCostPerMaxMean += costPerMaxMean

    return totalFuelCost
  }, {
    atConstantFuelCost: 0,
    atIncreasingFuelCostPerMinMean: 0, 
    atIncreasingFuelCostPerMaxMean: 0
  })

  return {
    atConstantFuelCost,
    atIncreasingFuelCost: Math.min( atIncreasingFuelCostPerMinMean, atIncreasingFuelCostPerMaxMean )
  }
}

console.info(`${logHeaderPrefix} | Day ${challengeDayNo} | ${challengeTitle}`);

if (rawInputData) {
  const t1 = performance.now()
  
  const { 
    atConstantFuelCost: p1,
    atIncreasingFuelCost: p2
  } = calculateOptimumFuel(rawInputData)

  console.info(`P1 : ${ p1 }`)  
  console.info(`P2 : ${ p2 }`) 

  const t2 = performance.now()
  console.info(`T : ${t2 - t1} ms`)
}