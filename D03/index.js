const fs = require('fs')
const logHeaderPrefix = 'AOC2021'
const challengeDayNo = '03'
const challengeTitle = 'Binary Diagnostic'

let rawInputData

try {
  rawInputData = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
} catch (e) {
  console.log(`Error!`)
  console.error(e)
}

const solveP1 = rawData => {
  let allMap = new Map()
  
  rawData
    .split('\n')
    .forEach( rawNumber => rawNumber
      .split('')
      .forEach( (digit, xIndex) => {
        if (!allMap.has(xIndex) ) allMap.set( xIndex, [ 0, 0 ])
        allMap.get(xIndex)[+digit] += 1
      })
    )

  let { allMax, allMin } = Array
    .from( allMap.values() )
    .reduce( 
      (summary, stats) => {
        summary.allMax.push( stats.indexOf( Math.max(...stats)))
        summary.allMin.push( stats.indexOf( Math.min(...stats)))
        return summary
      }, { 
        allMax: [], 
        allMin: []
      })

  let [ gammaRate, epsilonRate ] = [ allMax, allMin ]
    .map( digits => parseInt( digits.join(''), 2) )

  return gammaRate * epsilonRate
}

const solveP2 = rawData => {
  let diagnostics = rawData.split('\n')

  let [ oxygenRating, co2Rating ] = [
    [ rawData.split('\n'), 1 ],
    [ rawData.split('\n'), 0 ]
  ].map( ([ diagnosticsRef, defaultDigit ]) => {
    let continueSearch = true
    let finalNumberPrefix = ''
    let index = 0

    while (continueSearch) {
      let [ bitZero, bitOne ] = diagnosticsRef
        .map( record => +record.at(index))
        .reduce( 
          (summary, currentDigit) => {
            summary[currentDigit]++
            return summary
          }, [ 0, 0 ]
        )
  
      let nextDigit = bitZero === bitOne ? defaultDigit
        : defaultDigit ? [ bitZero, bitOne ].indexOf( Math.max( bitZero, bitOne ))
        : [ bitZero, bitOne ].indexOf( Math.min( bitZero, bitOne ))
  
      finalNumberPrefix = finalNumberPrefix.concat(nextDigit)
      diagnosticsRef = diagnosticsRef.filter( record => record.startsWith( finalNumberPrefix ))
      
      continueSearch = diagnosticsRef.length > 1
      index++
    }

    return parseInt( diagnosticsRef.shift(), 2)
  })

  return oxygenRating * co2Rating
}

console.info(`${logHeaderPrefix} | Day ${challengeDayNo} | ${challengeTitle}`);

if (rawInputData) {
  const t1 = performance.now()
  
  console.info(`P1 : ${solveP1(rawInputData)}`)
  console.info(`P2 : ${solveP2(rawInputData)}`)

  const t2 = performance.now()
  console.info(`T : ${t2 - t1} ms`)
}