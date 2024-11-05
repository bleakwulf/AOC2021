const fs = require('fs')
const logHeaderPrefix = 'AOC2021'
const challengeDayNo = '10'
const challengeTitle = 'Syntax Scoring'

const CHUNK_CLOSERS = new Map([
  [')', { opener: '(', errorScore: 3, autoCompleteScore: 1 }],
  [']', { opener: '[', errorScore: 57, autoCompleteScore: 2 }],
  ['}', { opener: '{', errorScore: 1197, autoCompleteScore: 3 }],
  ['>', { opener: '<', errorScore: 25137, autoCompleteScore: 4 }],
])

const AUTOCOMPLETE_MATRIX = Array
  .from( CHUNK_CLOSERS )
  .reduce( 
    (refMap, [ closer, { opener, autoCompleteScore }] ) => {
      refMap.set( opener, { closer, autoCompleteScore })
      return refMap
    }, 
    new Map()
  )

const CHUNK_OPENERS = Array
  .from( AUTOCOMPLETE_MATRIX )
  .map( ([ opener ]) => opener )

const AUTOCOMPLETE_MULTIPLIER = 5

let rawInputData

try {
  rawInputData = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
} catch (e) {
  console.log(`Error!`)
  console.error(e)
}

const isOpener = character => !!~CHUNK_OPENERS.indexOf(character)

const parseLine = inputLine => {
  const lineCharacters = Array.from(inputLine)

  const openers = [];
  let syntaxErrorScore = 0
  let autoCompleteScore = 0

  for( let charIndex = 0; charIndex < inputLine.length; charIndex++) {
    const character = lineCharacters.at(charIndex);

    if (isOpener(character)) {
      openers.push(character)
      continue;
    } 

    const { opener, errorScore } = CHUNK_CLOSERS.get(character)

    if (opener !== openers.at(-1)) {
      syntaxErrorScore = errorScore
      break;
    }

    openers.pop()
  }

  if (!syntaxErrorScore) 
    autoCompleteScore = openers
      .reduceRight( (totalAutoCompleteScore, opener) => {
        const { closer, autoCompleteScore } = AUTOCOMPLETE_MATRIX.get(opener)
        return totalAutoCompleteScore * AUTOCOMPLETE_MULTIPLIER + autoCompleteScore
      }, 0);

  return { inputLine, syntaxErrorScore, autoCompleteScore };
};

const solveP1 = inputData => inputData
  .reduce( ( totalScore, { syntaxErrorScore }) => totalScore + syntaxErrorScore, 0)

const solveP2 = inputData => {
  let autoCompleteScores = inputData
    .map( ({ autoCompleteScore }) => autoCompleteScore )
    .filter( autoCompleteScore => !!autoCompleteScore )
    .sort( (scoreA, scoreB ) => scoreA > scoreB ? 1 : scoreA < scoreB ? -1 : 0 )

  return autoCompleteScores
    .at( Math.floor(autoCompleteScores.length / 2) )
}

console.info(`${logHeaderPrefix} | Day ${challengeDayNo} | ${challengeTitle}`);

if (rawInputData) {
  const t1 = performance.now()
  const inputData  = rawInputData
    .split('\n')
    .map( lineData => parseLine(lineData) )

  console.info(`P1 : ${solveP1(inputData)}`)
  console.info(`P2 : ${solveP2(inputData)}`)

  const t2 = performance.now()
  console.info(`T : ${t2 - t1} ms`)
}