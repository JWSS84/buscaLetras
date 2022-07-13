const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const apiURL = `https://api.lyrics.ovh`

const fetchData = async url => {
    const response = await fetch(url)
    return await response.json()
}

const getMoreSongs = async url => {
    const data = await fetchData(`https://cors-anywhere.herokuapp.com/ ${url}`) //fecth faz requisições ajax, assincronas sem precisar recarregar a página  
    insertSongsIntoPage(data)
}

const insertPrevAndNextButtons = ({ prev, next }) => {
    prevAndNextContainer.innerHTML = `
            ${ prev ? `<button class="btn" onClick="getMoreSongs('${ prev}')" >Anteriores</button> ` : ''}
            ${ next ? `<button class="btn" onClick="getMoreSongs('${ prev}')" >Próximas</button> ` : ''} 
            `
}

const insertSongsIntoPage = ({ data, prev, next }) => {
    songsContainer.innerHTML = data.map(({artist:{ name }, title}) => `
        <li class="song">
        <span class="song-artist"><strong>${name}</strong> - ${title}</span>
        <button class="btn" data-artist="${name}" data-song-title="${title}">Ver letra </button>
        </li>`).join('')   

    if (prev || next) {
        insertPrevAndNextButtons({ prev, next })
        return
    }
    prevAndNextContainer.innerHTML = ''
}

const fetchSongs = async term => {
    const data = await fetchData(`${apiURL}/suggest/${term}`) //fecth faz requisições ajax, assincronas sem precisar recarregar a página  
    insertSongsIntoPage(data)
}

const handleFormSubmit = event => {
    event.preventDefault() //caso for digitado não será enviado

    const searchTerm = searchInput.value.trim() 
    searchInput.value = ''
    searchInput.focus()
    //remove os espaços em branco e transforma em string
    if (!searchTerm) { //se o searchTerm foi uma string vazia abre uma mensagem de alerta
        songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um nome de música</li>`
        return
    }

    fetchSongs(searchTerm)
}

form.addEventListener('submit', handleFormSubmit)

const insertLyricsIntoPage = ({ lyrics, artist, songTitle }) => {
    songsContainer.innerHTML = `
    <li class="lyrics-container">
    <h2><strong>${songTitle}</strong> - ${artist}</h2>
    <p class="lyrics">${data.lyrics}</p>
    </li>
    `
}

const fetchLyrics = async(artist, songTitle) => {
    const data = await fetchData(`${apiURL}/v1/${artist}/${songTitle}`)
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')

    insertLyricsIntoPage({ lyrics, artist, songTitle})
    
}

const handleSongsContainerClick =  event => {
    const clickedElement = event.target

    if(clickedElement.tagName === 'BUTTON'){
        const artist = clickedElement.getAtribute('data-artist')
        const songTitle = clickedElement.getAtribute('data-song-title')

        prevAndNextContainer
        fetchLyrics(artist, songTitle)
    }
}

songsContainer.addEventListener('click', handleSongsContainerClick)