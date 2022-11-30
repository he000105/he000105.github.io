// retrieve HTML elements
const $form = document.getElementById('form')
const $date = document.getElementById('date')
const $recent = document.getElementById('recent')

// create a colors data array
// array of object
// each object is a new search 
let colors = []

// build recent 
// build out recent search
function buildRecent () {
  const html = []
    // use for loop to get each color
    // from colors array
    // create template for each color
    for (let i = 0; i < colors.length; i++) {
      // to get each color: colors[i]
      const color = colors[i]
      html.push(`
      <div class="
          list-group-item
          d-flex
          align-items-center
          p-3
          mb-3">
        <div class="square" style="background-color: ${color.hex}"></div>
        <div class="me-auto">
          <p>
            <strong>${color.hex}</strong><br>
            <em>${color.date}</em>
          </p>
        </div>
        <button class="btn btn-close"
          data-index="${i}"></button>
      </div>`)
    }

    $recent.innerHTML = html.join('')
}

// add listener to form
// will make fetch request to API
$form.addEventListener('submit', 
  async function (e) {
    e.preventDefault()

    // making async request using fetch
    // will return a promise
    // two method for waiting:
      // .then().then()
      // async and await
    
    // make fetch request to get response
    // API expects date to be format like:
    // YYYY-MM-DD
    const response = await fetch('https://coloroftheday-api.herokuapp.com/api?date=' + $date.value)

    // use the response to get json
    const json = await response.json()

    // console.log(json)

    // add new json data to colors array
    colors.push(json)

    // store colors array to local storage
    localStorage.setItem('colors', JSON.stringify(colors))

    buildRecent()
  })

// adding event listener to recent
// using event delegation to listen for 
// close button
$recent.addEventListener('click', 
  function (e) {
    // check if close button was clicked
    if (e.target.classList.contains('btn-close')) {
      // get index from custom data attribute
      const index = e.target.dataset.index
      
      // remove color from colors array
      colors.splice(index, 1)

      // update local storage
      localStorage.setItem('colors', JSON.stringify(colors))

      // rebuild the search
      buildRecent()
    }
  })

// check if data is stored in local storage
const ls = localStorage.getItem('colors')

if (ls) {
  // override colors array with data 
  // store in local storage
  // convert local storage data to array 
  colors = JSON.parse(ls)
}

buildRecent()