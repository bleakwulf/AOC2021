const fs = require('fs')
const logHeaderPrefix = 'AOC2021'
const challengeDayNo = '09'
const challengeTitle = 'Smoke Basin'

const DEFAULT_RISK_LEVEL_INCREMENT = 1
const MAX_ELEVATION = 9
const MAX_BASIN_RANKING = 3

let rawInputData, inputData

try {
  rawInputData = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
} catch (e) {
  console.log(`Error!`)
  console.error(e)
}

const getTotalRiskLevel = floorMap => Array
  .from(floorMap.values())
  .filter(coordinate => !!coordinate.basinId)
  .reduce((totalRiskLevel, { height }) => totalRiskLevel += height + DEFAULT_RISK_LEVEL_INCREMENT, 0)

const getFloorMap = rawData => {
  let bareMap = rawData.split(`\n`)
    .map(rowData => Array.from(
      rowData.matchAll(/(?<height>(\d{1}))/g),
      ({ groups: { height } }) => +height
    ))

  let [rowMax, columnMax] = [ bareMap.length, bareMap.at(0).length ]

  let basinSeedId = 0
  let basinMap = new Map()

  let floorMap = bareMap
    .map((rowData, rowIndex) => rowData.map(
      (height, columnIndex) => {
        // get neighbors
        let neighbors = []
        
        if (!!rowIndex)  // north neighbor
          neighbors.push(bareMap[rowIndex - 1][columnIndex])
        if (columnIndex < columnMax - 1)  // east neighbor
          neighbors.push(bareMap[rowIndex][columnIndex + 1])
        if (rowIndex < rowMax - 1)  // south neighbor
          neighbors.push(bareMap[rowIndex + 1][columnIndex])
        if (!!columnIndex)  // west neighbor
          neighbors.push(bareMap[rowIndex][columnIndex - 1])

        let isBasin = !~neighbors.indexOf(height) && Math.min(height, ...neighbors) === height
        let basinId = isBasin && ++basinSeedId || 0

        return {
          coords: `${rowIndex}|${columnIndex}`,
          x: rowIndex,
          y: columnIndex,
          height,
          basinId
        }
      }
    ))
    .flat()
    .reduce((floorMap, coordinate) => {
      floorMap.set(coordinate.coords, coordinate)
      return floorMap
    }, new Map())

  const lowPoints = Array
    .from(floorMap.values())
    .filter(coordinate => !!coordinate.basinId)
    .reduce((lowPoints, coordinate) => {
      lowPoints.set(coordinate.coords, coordinate)
      return lowPoints
    }, new Map())
  
  const totalRiskLevel = getTotalRiskLevel(floorMap)
  
  Array.from( lowPoints.values() )
    .forEach( currentLowPoint => {
      let { basinId: refBasinId } = currentLowPoint
      let neighbors = [ currentLowPoint ]
      let isSurveyBasin = neighbors.length
      
      while (isSurveyBasin) {
        // get neighbors
        let { coords, x, y, basinId, height: currentHeight } = neighbors.shift()
        
        let surveyedNeighbors = []
        
        if (!!x)  // north neighbor
          surveyedNeighbors.push(floorMap.get(`${x - 1}|${y}`))
        if (y < columnMax - 1)  // east neighbor
          surveyedNeighbors.push(floorMap.get(`${x}|${y + 1}`))
        if (x < rowMax - 1)  // south neighbor
          surveyedNeighbors.push(floorMap.get(`${x + 1}|${y}`))
        if (!!y)  // west neighbor
          surveyedNeighbors.push(floorMap.get(`${x}|${y - 1}`))

        neighbors = neighbors.concat( 
          surveyedNeighbors.filter( ({ height, basinId }) => height < MAX_ELEVATION && height > currentHeight && !basinId )
        )

        neighbors?.forEach( ({ coords }) => floorMap.get( coords ).basinId = refBasinId )
        
        isSurveyBasin = neighbors.length
        
      }
    })

  let basinSizes = Array
    .from( floorMap.values() )
    .filter( ({ basinId }) => !!basinId )
    .reduce( (basinSizes, { basinId }) => {
      basinSizes.set( basinId, 1 + (basinSizes.get(basinId) ?? 0))
      return basinSizes
    }, new Map() )

  let sumOfTopLargestBasins = Array
    .from( basinSizes.values() )
    .sort( (sizeA, sizeB) => sizeA > sizeB ? -1 : sizeA < sizeB ? 1 : 0 )
    .slice( 0, MAX_BASIN_RANKING )
    .reduce( (sizeProduct, currentSize) => sizeProduct *= currentSize, 1)

  return { totalRiskLevel, sumOfTopLargestBasins }
}

console.info(`${logHeaderPrefix} | Day ${challengeDayNo} | ${challengeTitle}`);

if (rawInputData) {
  const t1 = performance.now()
  
  let { 
    totalRiskLevel: p1, 
    sumOfTopLargestBasins: p2
  } = getFloorMap(rawInputData)

  console.info(`P1 : ${ p1 }`)  // 558
  console.info(`P2 : ${ p2 }`)  // 882942

  const t2 = performance.now()
  console.info(`T : ${t2 - t1} ms`)
}