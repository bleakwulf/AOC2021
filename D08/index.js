const fs = require('fs')
const logHeaderPrefix = 'AOC2021'
const challengeDayNo = '08'
const challengeTitle = 'Seven Segment Search'

let rawInputData, inputData

try {
  rawInputData = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
} catch (e) {
  console.log(`Error!`)
  console.error(e)
}

const solveP1 = rawData => [
    // outputs of 1 (2-segments)
    Array.from(
      rawData.matchAll(/(?<=\|.*)(\b\w{2}\b)/gim)
    ).length,
    
    // outputs of 7 (3-segments)
    Array.from(
      rawData.matchAll(/(?<=\|.*)(\b\w{3}\b)/gim)
    ).length,
    
    // outputs of 4 (4-segments)
    Array.from(
      rawData.matchAll(/(?<=\|.*)(\b\w{4}\b)/gim)
    ).length,
    
    // outputs of 8 (7-segments)
    Array.from(
      rawData.matchAll(/(?<=\|.*)(\b\w{7}\b)/gim)
    ).length
  ]
  .reduce( (totalCount, digitCount) => totalCount += digitCount, 0)

const sortCodes = numberCodes => numberCodes.map( 
  numberCode => Array.from(numberCode).sort().join('') 
)

const mapSegments = inputs => {
  let [ code1 ] = inputs.filter( input => input.length === 2)
  let [ code7 ] = inputs.filter( input => input.length === 3)
  let [ code4 ] = inputs.filter( input => input.length === 4)
  let [ code8 ] = inputs.filter( input => input.length === 7)

  // find segmentA by 1 vs. 7
  let [ segmentA ] = Array.from( code7 ).filter( segmentCode => !~code1.indexOf(segmentCode ))

  // find segmentG by 1+4+7 vs. 9
  let codeRef = Array.from( new Set( code1.concat(code7).concat(code4) ) )
  let [ gSegmentRef ] = inputs
    .filter( numberCode => numberCode.length === 6 
      && codeRef.every( segmentCode => !!~numberCode.indexOf(segmentCode) ) 
    )
  let [ segmentG ] = Array.from( gSegmentRef ).filter( segmentCode => !~codeRef.indexOf(segmentCode ))

  // find segmentE by 9 vs. 8
  let [ segmentE ] = Array.from( code8 )
    .filter( segmentCode => !~gSegmentRef.indexOf(segmentCode ))

  // find segmentD by 7+G vs. 3
  codeRef = Array.from( new Set( code7.concat(segmentG) ) )
  let [ dSegmentRef ] = inputs
    .filter( input => input.length === 5 && codeRef.every( segmentCode => !!~input.indexOf(segmentCode)))
  let [ segmentD ] = Array.from( dSegmentRef ).filter( segmentCode => !~codeRef.indexOf(segmentCode ))

  // find segmentB by 1+D vs. 4
  codeRef = Array.from( new Set( code1.concat(segmentD) ) )
  let [ segmentB ] = Array.from( code4 )
    .filter( segmentCode => !~codeRef.indexOf(segmentCode ))
  
  // find segmentF using existing segments of 6
  codeRef = [ segmentA, segmentB, segmentD, segmentE, segmentG ]
  let [ fSegmentRef ] = inputs
    .filter( input => input.length === 6 && codeRef.every( segmentCode => !!~input.indexOf(segmentCode)))
  let [ segmentF ] = Array.from( fSegmentRef ).filter( segmentCode => !~codeRef.indexOf(segmentCode ))

  // find segmentC using 1
  let [ segmentC ] = Array.from( code1 ).filter( segmentCode => segmentCode !== segmentF )

  return new Map(
    sortCodes([
      [ 
        segmentA, 
        segmentB, 
        segmentC, 
        segmentE, 
        segmentF, 
        segmentG
      ],
      [ 
        segmentC, 
        segmentF 
      ], 
      [ 
        segmentA, 
        segmentC, 
        segmentD, 
        segmentE, 
        segmentG 
      ], 
      [ 
        segmentA, 
        segmentC, 
        segmentD, 
        segmentF, 
        segmentG 
      ],
      [ 
        segmentB, 
        segmentC, 
        segmentD, 
        segmentF
      ], 
      [ 
        segmentA, 
        segmentB, 
        segmentD, 
        segmentF, 
        segmentG
      ], 
      [ 
        segmentA, 
        segmentB, 
        segmentD, 
        segmentE, 
        segmentF, 
        segmentG
      ], 
      [ 
        segmentA, 
        segmentC, 
        segmentF
      ],
      [ 
        segmentA, 
        segmentB, 
        segmentC, 
        segmentD, 
        segmentE, 
        segmentF, 
        segmentG
      ],  
      [ 
        segmentA, 
        segmentB, 
        segmentC, 
        segmentD, 
        segmentF, 
        segmentG
      ]
    ]).map( (code, index) => [ code, index ])
  )
  
}

const solveP2 = rawData => rawData
  .split('\n')
  .map( rawPatternLog => { 
    const [ inputs, outputs ] = [ 
      Array.from(
        rawPatternLog.matchAll(/(?<digitCode>(\b\w{1,}\b))(?=.*\|)/gim),
        ( { groups: { digitCode } } ) => digitCode.trim()
      ), 
      Array.from(
        rawPatternLog.matchAll(/(?<=\|.*)(?<digitCode>(\b\w{1,}\b))/gim),
        ( { groups: { digitCode } } ) => digitCode.trim()
      )
    ]
    
    const [ inputMap, outputCodes ] = [
      mapSegments(inputs), 
      sortCodes(outputs)
    ]

    return +outputCodes
      .map( outputCode => inputMap.get( outputCode ) )
      .join('')
  })
  .reduce( ( total, outputValue ) => total += outputValue, 0 )

console.info(`${logHeaderPrefix} | Day ${challengeDayNo} | ${challengeTitle}`);

if (rawInputData) {
  const t1 = performance.now()

  console.info(`P1 : ${ solveP1( rawInputData ) }`)  // 456
  console.info(`P2 : ${ solveP2( rawInputData ) }`)  // 1091609

  const t2 = performance.now()
  console.info(`T : ${t2 - t1} ms`)
}