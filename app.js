const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const apiURL = `https://api.lyrics.ovh`// api de letras de musicas gratuitas

const insertSongsIntoPage = songsInfo => {
    songsContainer.innerHTML = songsInfo.data.map(song => 
        `<li class="song">
        <span class="song-artist">
        <strong>${song.artist.name}</strong> - 
        ${song.title}</span>
        <button class="btn"
         data-artist="${song.artist.name}"
         data-song-title="${song.title}
         >
         Ver letras
         </button>
        </li>`
        ).join('')

        if (songsInfo.prev || songsInfo.next) {
            prevAndNextContainer.innerHTML = 
            `
            ${songsInfo.next ? `<button>Próximas</button> ` : ''}
            `

        } else {
            
        }
}

const fetchSongs = async term => {
    const response =  await fetch(`${apiURL}/suggest/${term}`)
    const data = await response.json() //fecth faz requisições ajax, assincronas sem precisar recarregar a página  
   
    insertSongsIntoPage(data) 
}

form.addEventListener('submit', event => {
    event.preventDefault()//caso for digitado não será enviado
    
    const searchTerm = searchInput.value.trim() //remove os espaços em branco e transforma em string
    if (!searchTerm) {//se o searchTerm foi uma string vazia abre uma mensagem de alerta
     songsContainer.innerHTML =`<li class="warning-message">"Por favor, digite um nome de música"</li>`
     return
    }
        
    fetchSongs(searchTerm)
})
