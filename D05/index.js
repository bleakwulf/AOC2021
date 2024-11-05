const fs = require('fs')
const logHeaderPrefix = 'AOC2021'
const challengeDayNo = '05'
const challengeTitle = 'Hydrothermal Venture'

const SEGMENT_FILTER = {
  HV_CROSS_ONLY: 1
}

let rawInputData

try {
  rawInputData = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
} catch (e) {
  console.log(`Error!`)
  console.error(e)
}

const getSegmentCoordinateOverlaps = (rawData, filterMode = null) => {
  const ventCoords = new Map()
  
  const parsedCoords = Array
    .from( 
      rawData.matchAll(/(?<x1>(\d{1,})),(?<y1>(\d{1,})) \-> (?<x2>(\d{1,})),(?<y2>(\d{1,}))/gm), 
      ({ groups: { x1, y1, x2, y2 } }) => [ 
        [ x1, y1 ].map(Number), 
        [ x2, y2 ].map(Number)
      ]
    )
    .map( pair => pair.map( ([x, y]) => ({ x, y }) ) )
    .filter( ([ coord1, coord2 ]) => filterMode === SEGMENT_FILTER.HV_CROSS_ONLY 
      ? coord1.x === coord2.x || coord1.y === coord2.y
      : true 
    )
    .map( pair => pair
      .sort( (coord1, coord2) => coord1.x < coord2.x ? -1 
        : coord1.x > coord2.x ? 1 
        : coord1.y < coord2.y ? -1 
        : coord1.y > coord2.y ? 1 
        : 0 
      )
    )
    .map( ([ { x: x1, y: y1}, { x: x2, y: y2} ]) => {
      let segmentCoords = []
      let isHSegment = x1 === x2
      let isVSegment = y1 === y2
      let isDSegment = (!isHSegment && !isVSegment)
      
      let xIncrement = x1 > x2 ? -1 : x1 < x2 ? 1 : 0
      let yIncrement = y1 > y2 ? -1 : y1 < y2 ? 1 : 0
      
      for ( 
        let xCoord = x1, yCoord = y1;
        (isHSegment & yCoord !== y2)
        || (isVSegment & xCoord !== x2)
        || (isDSegment && xCoord !== x2 && yCoord !== y2);
        xCoord += xIncrement, yCoord += yIncrement
      ) {
        segmentCoords.push( [ xCoord, yCoord ])
      }
  
      //push final segment coordinates since this was the terminating condition of the loop above
      segmentCoords.push([ x2, y2 ])
      
      return segmentCoords
    })
    .flat()
  
  parsedCoords.forEach( ([ x, y ]) => {
    let coordRef = `${x}|${y}`
    ventCoords.set(coordRef, 1 + (ventCoords.get(coordRef) || 0))
  })
  
  return Array.from( ventCoords.values() )
    .filter( overlap => overlap > 1)
    .length
}

console.info(`${logHeaderPrefix} | Day ${challengeDayNo} | ${challengeTitle}`);

if (rawInputData) {
  const t1 = performance.now()
  
  console.info(`P1 : ${ getSegmentCoordinateOverlaps( rawInputData, SEGMENT_FILTER.HV_CROSS_ONLY ) }`)
  console.info(`P2 : ${ getSegmentCoordinateOverlaps( rawInputData ) }`)

  const t2 = performance.now()
  console.info(`T : ${t2 - t1 } ms`)
}