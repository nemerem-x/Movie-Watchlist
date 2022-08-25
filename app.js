const submit = document.getElementById('submit')
const search = document.getElementById('search')
const section = document.getElementById('section')
const section2 = document.getElementById('section2')

let myWatchlist = []

const lookup = async (e) => {
    e.preventDefault()
    const response = await fetch(`http://www.omdbapi.com/?s=${search.value}&apikey=91eddb76`)
    const data = await response.json()

    if (!data.ok){
        // throw Error('errrrorrrr')
        section.innerHTML = '<p>No movie</p>'
    }

    const movieId = data.Search.map(movie => movie.imdbID)

    section.innerHTML = ''

    let searchResults = await Promise.all(movieId.map(async (id) => {
            const res = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=91eddb76`)
            const data2 = await res.json()
            return data2
        })
    )

    let postHtml = searchResults.map( data2 => {
        let {imdbID, Poster, Title, imdbRating, Runtime, Genre, Plot} = data2
        return `
            <div class="container" data-id="${imdbID}">
                <div class="movie-details">
                    <img src="${Poster}" alt="missing poster">
                    <div class="movie-info">
                        <p id="movie-title">${Title}<span><i class="fa-solid fa-star"></i>${imdbRating}</span></p>
                        <div class="time-type">
                            <p>${Runtime}</p>
                            <p>${Genre}</p>
                            <button id="add-watchlist"><i class="fa-solid fa-circle-plus"></i>Add</button>
                        </div>
                        <p id="description">${Plot}</p>
                    </div>
                </div>
            </div>
        `
    }).join('')

    section.innerHTML = postHtml
    
    myWatchlist = JSON.parse(localStorage.getItem('myMovieId'))

    if (!myWatchlist){
        myWatchlist = []
    }

    let myIDs = []
    let intersection = []
    const container2 = document.querySelectorAll('.container')
    const addBtns = document.querySelectorAll('#add-watchlist')
    
    container2.forEach(contain => {
        let id = contain.getAttribute('data-id')
        // container whose id is in the Array, your btn should be green
        let checkArray = myWatchlist.indexOf(id) !== -1

        if(checkArray){
            btn = contain.childNodes[1].children[1].children[1].children[2]
            btn.innerHTML = `<i class="fa-solid fa-check"></i>Watchlist`
            btn.addEventListener('click', () => {
                document.location.href = 'watchlist.html'
            })
        }
    })

    addBtns.forEach(addBtn => {
        addBtn.addEventListener('click', (e) => {
            let container = e.currentTarget.parentElement.parentElement.parentElement.parentElement
            let data_id = container.getAttribute('data-id')

            if (!myWatchlist.includes(data_id)) {
                myWatchlist.push(data_id)
                addBtn.innerHTML = `<i class="fa-solid fa-check"></i>Watchlist`
                addBtn.addEventListener('click', () => {
                    document.location.href = 'watchlist.html'
                })
            }

            localStorage.setItem('myMovieId', JSON.stringify(myWatchlist))
        })
    })
}

if (submit) {
    submit.addEventListener('click', lookup)
}

function pageLoad(){
        // localStorage.clear()
    myWatchlist = JSON.parse(localStorage.getItem('myMovieId'))

    myWatchlist.map(async (id2) => {
        const res = await fetch(`http://www.omdbapi.com/?i=${id2}&apikey=91eddb76`)
        const data3 = await res.json()

        section2.innerHTML += `
            <div class="container" data-id="${id2}">
                <div class="movie-details">
                    <img src="${data3.Poster}" alt="missing poster">
                    <div class="movie-info">
                        <p id="movie-title">${data3.Title}<span><i class="fa-solid fa-star"></i>${data3.imdbRating}</span></p>
                        <div class="time-type">
                            <p>${data3.Runtime}</p>
                            <p>${data3.Genre}</p>
                            <button id="remove-watchlist"><i class="fa-solid fa-circle-minus"></i>Remove</button>
                        </div>
                        <p id="description">${data3.Plot}</p>
                    </div>
                </div>
            </div>
        `
        const removeBtns = document.querySelectorAll('#remove-watchlist')

        removeBtns.forEach(removeBtn => {
            removeBtn.addEventListener('click', (e) => {
                const container = e.currentTarget.parentElement.parentElement.parentElement.parentElement
                const data_id = container.getAttribute('data-id')
                
                container.classList.add('remove')

                let index = myWatchlist.indexOf(data_id)
                
                myWatchlist.splice(index, 1)

                localStorage.setItem('myMovieId', JSON.stringify(myWatchlist))
            })
        })
    })
}