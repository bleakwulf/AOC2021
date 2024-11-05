const fs = require('fs')
const logHeaderPrefix = 'AOC2021'
const challengeDayNo = '04'
const challengeTitle = 'Giant Squid'

let rawInputData

try {
  rawInputData = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
} catch (e) {
  console.log(`Error!`)
  console.error(e)
}

const parseInput = (rawData) => {
  const [ rawDrawsData, ...rawCardsData ] = rawData.split('\n\n')
  const drawData = rawDrawsData.split(`,`).map(Number)
  const cardsData = new Map(
    rawCardsData
      .map( rawCardData => rawCardData
        .split(`\n`)
        .map( rawRowsData => Array.from(
          rawRowsData.matchAll(/(?<numEntry>(\d{1,}))/gm),
          ( { groups: { numEntry } } ) => +numEntry
        ))
      ).map( (cardData, cardIndex ) => {
        const numEntries = new Map( 
          cardData.map( (rowData, rowIndex ) => rowData.map(
            ( cellData, columnIndex ) => [ cellData, [ rowIndex, columnIndex ] ]
          )).flat()
        )
        
        const remTotal = cardData
          .flat()
          .reduce( (sum, numEntry ) => sum += numEntry, 0 )
        
        const rowMap = new Map(
          cardData.map( (rowData, rowIndex ) => [ rowIndex, new Set(rowData) ] )
        )
        
        const columnMap = new Map(
          cardData
            .reduce( ( allColumnTotals, rowData ) => {
              rowData.forEach( (numEntry, columnIndex ) => {
                allColumnTotals[columnIndex] ??= new Set()
                allColumnTotals[columnIndex].add(numEntry)
              })
    
              return allColumnTotals
            }, [])
            .map( (columnData, columnIndex) => [ columnIndex, columnData ] )
        )
        
      return [ cardIndex, { 
        numEntries, 
        remTotal, 
        rowMap, 
        columnMap 
      } ]
    })
  )
  
  return { drawData, cardsData }
}

const simulateGame = (rawData) => {
  let { drawData, cardsData } = parseInput(rawData)
  let isEndGame = false
  let drawIndex = 0
  let winCardScores = []

  while(!isEndGame) {
    const drawnNumber = drawData.at(drawIndex)

    for( const indexRef of cardsData.keys()) {
      let cardRef = cardsData.get(indexRef)
      let { numEntries, rowMap, columnMap } = cardRef
      
      if (!numEntries.has(drawnNumber)) continue
      
      let [ rowIndex, columnIndex ] = numEntries.get(drawnNumber)
      
      cardRef.remTotal -= drawnNumber
      rowMap.get(rowIndex).delete(drawnNumber)
      columnMap.get(columnIndex).delete(drawnNumber)
      numEntries.delete(drawnNumber)

      let hasCardWon = !rowMap.get(rowIndex).size
        || !columnMap.get(columnIndex).size
      
      if (!hasCardWon) continue

      winCardScores.push(drawnNumber * cardRef.remTotal)
      cardsData.delete(indexRef)
    }
    
    drawIndex++
    isEndGame = !cardsData.size || drawIndex >= drawData.length
  }
  
  return [ 
    winCardScores.shift(), 
    winCardScores.pop() 
  ]
}

console.info(`${logHeaderPrefix} | Day ${challengeDayNo} | ${challengeTitle}`);

if (rawInputData) {
  const t1 = performance.now()
  
  const [ p1, p2 ] = simulateGame(rawInputData)
  console.info(`P1 : ${ p1 }`)    // 22680
  console.info(`P2 : ${ p2 }`)    // 16168
  
  const t2 = performance.now()
  console.info(`T : ${t2 - t1} ms`)
}