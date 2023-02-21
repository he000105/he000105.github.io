const dataset = [
  { word: 'AFTER', clue: 'Behind in place' },
  { word: 'BADGES', clue: 'Boy Scouts earn them' },
  { word: 'COLA', clue: 'Soft drink' },
  { word: 'DULL', clue: 'Blunt'},
  { word: 'EGO', clue: 'It may be bruised or inflated'},
  { word: 'FADE', clue: 'Grow dimmer'},
  { word: 'GATE', clue: 'Stadium entrance'},
  { word: 'HERO', clue: 'Medal of Honor recipient'},
  { word: 'ILLUME', clue: 'Shed light on' }
]

function Score ({ score }) {
  return (
    <div className="row mb-5">
      <div className="col">
        <h2 className="display-4 text-center">
          Score <br />
          {score}
        </h2>
      </div>
    </div>
  )
}

function Clue ({ clue, word }) {
  return (
    <div className="row mb-5">
      <div className="col text-center">
        <h2>{clue}</h2>
        <p><em>{word.length} Letters | Starts with {word[0]}</em></p>
      </div>
    </div>
  )
}

function Response ({ message }) {
  const className = `alert alert-info ${message ? 'visible' : 'invisible'}`
  return (
    <div className="row mb-5">
      <div className="col">
        <div className={className}>{message || '&nbsp;' }</div>
      </div>
    </div>
  )
}

function Form ({ onGuess }) {
  const [guess, setGuess] = React.useState('')

  function changeHandler (e) {
    setGuess(e.target.value)
  }

  function submitHandler (e) {
    e.preventDefault()
    onGuess(guess)
    setGuess('')
  }

  return (
    <div className="row mb-5">
      <div className="col-6 offset-3">
        <form className="form" onSubmit={submitHandler}>
          <input type="text" value={guess} onChange={changeHandler} className="form-control text-uppercase" />
        </form>
      </div>
    </div>
  )
}

function Button ({ text, variant, onButtonClick }) {
  const className = `btn btn-${variant}`

  function clickHandler () {
    onButtonClick()
  }

  return (
    <div className="row">
      <div className="col d-flex justify-content-center">
        <button type="button" className={className} onClick={clickHandler}>{text}</button>
      </div>
    </div>
  )
}

function Skip ({ onSkip }) {

  function clickHandler () {
    onSkip()
  }

  return (
    <div className="row">
      <div className="col d-flex justify-content-center">
        <button type="button" className="btn btn-danger" onClick={clickHandler}>Skip</button>
      </div>
    </div>
  )
}

function Play () {

  function clickHandler () {
    console.log('Play Again')
  }

  return (
    <div className="row">
      <div className="col d-flex justify-content-center">
        <button type="button" className="btn btn-primary" onClick={clickHandler}>Play Again</button>
      </div>
    </div>
  )
}

function App () {
  const [puzzles, setPuzzles] = useLocalStorage('puzzles', dataset)
  const [score, setScore] = useLocalStorage('score', 0)
  const [message, setMessage] = useLocalStorage('message', '')
  const [puzzle, setPuzzle] = useLocalStorage('puzzle', puzzles[0])
  const [active, setActive] = useLocalStorage('active', true)

  function onGuessHandler (guess) {
    if (guess.toUpperCase() === puzzle.word) {
      setScore(prevScore => prevScore + 1)

      if (puzzles.length > 1) {
        setMessage('Correct. Next puzzle.')
        setPuzzles(puzzles.slice(1))
      } else {
        gameOver()
      }
    } else {
      setMessage('Wrong. Try again.')
    }
  }

  function onSkipHandler () {
    if (puzzles.length > 1) {
      setMessage('Skipped. Next puzzle.')
      setPuzzles(puzzles.slice(1))
    } else {
      gameOver()
    }
  }

  function gameOver () {
    setMessage(`No more puzzles. Your final score is ${score}.`)
    setActive(false)
  }

  function onPlayHandler () {
    setMessage('')
    setActive(true)
    setScore(0)
    setPuzzles(dataset)
  }

  React.useEffect(() => {
    setPuzzle(puzzles[0])
  }, [JSON.stringify(puzzles)])

  React.useEffect(() => {
    localStorage.setItem('crossword', JSON.stringify({
      active,
      puzzles,
      puzzle,
      score,
      message
    }))
  })

  function useLocalStorage (key, defaultValue) {
    const ls = JSON.parse(localStorage.getItem('crossword'))

    return React.useState(ls ? ls[key] : defaultValue) 
  }
  
  return (
    <div className="container p-5">
      <Score score={score} />
      {active && <Clue clue={puzzle.clue} word={puzzle.word} />}
      <Response message={message} />
      {active && <Form onGuess={onGuessHandler} />}
      {active && <Button text="Skip" variant="danger" onButtonClick={onSkipHandler} />}
      {!active && <Button text="Play Again?" variant="primary" onButtonClick={onPlayHandler} />}
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)