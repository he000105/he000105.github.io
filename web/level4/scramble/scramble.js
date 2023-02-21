/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
 function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const data=[
  "emergency", "position","television","stairs",
  "stocking","pillow","planter","leaves","fence",
  "garden","delivery","dinner","happy","white"]
    
const scrambled = data.map(w=>shuffle(w))
const maxPoints = 10
const maxStrikes = 3
let doneInit = false
    
localStorage.setItem('data', data)
    
      
function PointsStrikes (props) {
 return  (<div className="row justify-content-between">
          <div className="col-3"><h1>Points {props.points}</h1></div>
          <div className="col-3"><h1>Strikes {props.strikes}</h1></div>
          </div>)
        
}
    
function Scrambles(props){
  return (
    <React.Fragment>
      <h1 className="font-weight-bold word" id="activeWord">{props.scrambles}</h1>    
    </React.Fragment>)
}
      
function Pass(props){
  if(props.pass > 0 ){
    return (<React.Fragment>
      <button type="submit"  className="btn mt-3 btn-danger"
      onClick={props.onClick} >{props.pass} Passes Remaining</button>
      </React.Fragment>)
    }
    return null 
}
    
function Message (props) {
  let message = props.message
  if(message != null){
    let className = "alert " + message.class
  return <div  className={className}>{message.text}</div>}
}

function createMessage(type){
  let message = {}
  if(type == "correct"){
    message.text = "Correct. Next."
    message.class = "alert alert-success"
  }
  else if(type == "wrong"){
    message.text = "Wrong. Try again."
    message.class = "alert alert-danger"
  }
  else if(type == "pass"){
    message.text = "Skipped the word."
    message.class = "alert alert-info"
  }return message
}
    
function resetLS(){
  localStorage.setItem('points', 0)
  localStorage.setItem('strikes',0)
  localStorage.setItem('pass', 3)
  localStorage.setItem('index', 0)
}
    
function clearLS(){
  localStorage.removeItem('points')
  localStorage.removeItem('strikes')
  localStorage.removeItem('pass')
  localStorage.removeItem('index')
  localStorage.removeItem('data')
}
        

function App () {
const [points, setPoints] = React.useState(0)
const [strikes, setStrikes] = React.useState(0)
const [pass, setPass] = React.useState(3)
const [message, setMessage] = React.useState('')
const [index, setIndex] = React.useState(0)
const [scrambles, setScrambles] = React.useState(scrambled[index])

        
if(!doneInit){
  clearLS()
}

React.useEffect(()=>{
  if(points > 0){
    setIndex(index+1)
    setMessage(createMessage("correct"))
    localStorage.setItem('index', index)
  }
},[points])
    
 
React.useEffect(()=>{
  if(strikes > 0){
    setMessage(createMessage("wrong"))
  } else{
    setMessage('')
  }
},[strikes+1])
    

React.useEffect(()=>{
  if(pass<3){
    setIndex(index+1)
      setMessage(createMessage("pass"))}        
},[pass])
    

React.useEffect(()=>{
  if(doneInit){
    setScrambles(scrambled[index])
}
  else{      
    doneInit = !doneInit 
  }
},[index])
    
    

/**Input and Check */
function FormHandler (e){
  e.preventDefault()
  let guess = input.value
  if(guess.toLowerCase() == data[index]){
    setPoints(points + 1)
    localStorage.setItem('points', points)}
  else{
    setStrikes(strikes + 1)
    localStorage.setItem('strikes', strikes)}
}
   
/** Pass remain */
function PassHandler (e){
  e.preventDefault()
  if(pass > 0){
    setPass(pass-1)
    localStorage.setItem('pass', (pass))}
}

/** Restart button */
function Redo(props){
  if(points==maxPoints){
    return (<button type="submit"  onClick={props.onClick} className="btn mt-3 btn-primary">Do you want to play again?</button> )
  }else if(strikes==maxStrikes){
    return (<button type="submit" onClick={props.onClick} className="btn mt-3 btn-primary">Do you want to play again?</button> )
  }return null
}
          
function RedoHandler(){
  resetLS()
  setPoints(0)
  setStrikes(0)
  setIndex(0)
  setPass(3)
  setMessage('')
}

return (
<React.Fragment>
 <h1 className="mt-5">Welcome to Scramble.</h1>
 <div className="container">
 <PointsStrikes points={points} strikes= {strikes}/>
 <Message message = {message}/>
 <Scrambles scrambles = {scrambles} />
 <form onSubmit={FormHandler}>
    <input id="input" type="text"/>
 </form>
 <div className="d-flex col justify-content-between">
 <Pass pass={pass} onClick={PassHandler} />
 <Redo onClick={RedoHandler}/>
 </div>
</div>
</React.Fragment>)
 }
      
      
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App/>)
      
      
      