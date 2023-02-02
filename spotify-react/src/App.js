import './App.css'
import {useEffect, useState} from 'react'
import axios from 'axios'

function App() {

  const CLIENT_ID = "f975adb8fada4e4b9787c25654230f45"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }

    setToken(token)

  }, [])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  const searchArtists = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: searchKey,
            type: "artist"
        }
    })

    setArtists(data.artists.items)
}

const renderArtists = () => {
  return artists.map(artist => (
      <div className="Artist-Gallery" key={artist.id}>
          {artist.images.length ? <img className="Artist-Images" src={artist.images[0].url} alt=""/> : <div>No Image</div>}
      </div>
  ))
}

    return (
      <div className="App">
        <header className="App-header">
          <h1>Spotify React</h1>
        </header>
        <section className="MainSection">
        {!token ?
              <button className="LoginButton"><a className="LoginAnchor"
                href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
              >
                Login to Spotify
              </a></button>
              : <div className="Functionality">
                  <form onSubmit={searchArtists}>
                    <input className="SearchBar" type="text" onChange={e => setSearchKey(e.target.value)}/>
                    <button type={"submit"}>Search</button>
                  </form>
                  <button onClick={logout}>Logout</button>
                </div>}
        </section>
        {renderArtists()}
      </div>
    );
}

export default App;