const submit = document.getElementById('submit')
const search = document.getElementById('search')
const section = document.getElementById('section')
const section2 = document.getElementById('section2')

let myWatchlist = []

const lookup = async (e) => {
    e.preventDefault()
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${search.value}&api_key=c8370278578be5adef5adc28cd4c442c`)
    const data = await res.json()
    
    section.innerHTML = ''

    const movieId = await Promise.all(data.results.map(async (movie) => {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=c8370278578be5adef5adc28cd4c442c`)
            const data = await res.json()
            return data
         })
    )

    const theMovie = movieId.map(data => {
        let {id, poster_path, title, vote_average, runtime, genres, overview} = data
        return `
            <div class="container" data-id="${id}">
                <div class="movie-details">
                    <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="missing poster">
                    <div class="movie-info">
                        <p id="movie-title">${title}<span><i class="fa-solid fa-star"></i>${vote_average}</span></p>
                        <div class="time-type">
                            <p>${runtime} mins</p>
                            <p>${genres[0].name}</p>
                            <button id="add-watchlist"><i class="fa-solid fa-circle-plus"></i>Add</button>
                        </div>
                        <p id="description">${overview}</p>
                    </div>
                </div>
            </div>
        `
    }).join('')

    section.innerHTML = theMovie

    myWatchlist = JSON.parse(localStorage.getItem('myMovieId'))

    if (!myWatchlist){
        myWatchlist = []
    }

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
    myWatchlist = JSON.parse(localStorage.getItem('myMovieId'))

    myWatchlist.map(async (id2) => {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id2}?api_key=c8370278578be5adef5adc28cd4c442c`)
        const data3 = await res.json()

        section2.innerHTML += `
            <div class="container" data-id="${id2}">
                <div class="movie-details">
                    <img src="https://image.tmdb.org/t/p/w500${data3.poster_path}" alt="missing poster">
                    <div class="movie-info">
                        <p id="movie-title">${data3.title}<span><i class="fa-solid fa-star"></i>${data3.vote_average}</span></p>
                        <div class="time-type">
                            <p>${data3.runtime} mins</p>
                            <p>${data3.genres[0].name}</p>
                            <button id="remove-watchlist"><i class="fa-solid fa-circle-minus"></i>Remove</button>
                        </div>
                        <p id="description">${data3.overview}</p>
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