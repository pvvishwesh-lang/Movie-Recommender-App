import Body from './MovieCard'
import 'bootstrap/dist/css/bootstrap.min.css'
import SearchComponent from './SearchBar'
import { useState , useEffect } from 'react';
import './App.css'
export default function App(){
  const [query,setQuery] = useState("")
  const [movie, setMovie] =useState([])
  const [genre, setGenre] = useState(null)
  const [isLoading,setIsLoading]=useState(false)
  const [isSearched, setSearched]=useState(false)
  const [error, setError] = useState(null)
  const [isDark, setDark] = useState(true)

  useEffect(()=>{
   const setTheme=async()=>{ 
    console.log('isDark:', isDark)
    document.body.classList[isDark ? 'remove' : 'add']('light-mode')
  };
  setTheme();
  },[isDark]);

  useEffect(()=>{
    const fetchData=async()=>{
      try{
        const response=await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_API_KEY}`);
        const result=await response.json();
        const genreMap={}
        result.genres.forEach(g=>genreMap[g.id]=g.name)
        setGenre(genreMap)
      }
      catch (error){
        console.error('Couldnt get the genre data due to the following error: ',error);
        setIsLoading(false);
        setError(true);
      }
    };
    fetchData();
  },[]);

  const handleSearch=async(searchTerm)=>{
    try{
      setError(false)
      setQuery(searchTerm)
      setIsLoading(true)
      const response=await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_API_KEY}&query=${searchTerm}`)
      const data=await response.json()
      setIsLoading(false)
      setSearched(true)
      setMovie(data.results.slice(0,10))
    }
    catch (error){
      console.error('Couldnt get the genre data due to the following error: ',error);
      setIsLoading(false);
      setError(true);
    }
  }
  return (
    <div className={isDark ? 'dark' : 'light'} style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', width: '100%' }}>
    <div className='header'>
      <h1 className='WebPageTitle'>Movie Recommender</h1>
      <button className='theme-toggle' onClick={() => setDark(!isDark)}>{isDark ? '☀️' : '🌙'}</button>
    </div>
    <SearchComponent onSearch={handleSearch} />
    {isSearched && isLoading && <p className='Searching'>Searching...</p>}
    {!isSearched && !isLoading && <p className='SearchForMovie'>Search for a movie above</p>}
    {isSearched && !isLoading && movie.length > 0 &&
    <div className='results'>
      {movie.map((m,index)=>(
      <Body key={index} movie_details={{
        title: m.title,
        image: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
        genres: genre ? m.genre_ids.map(id=>genre[id]).filter(Boolean):m.genre_ids,
        description: m.overview,
        rating: m.vote_average 
      }} />
      ))}
    </div>
    } 
    {isSearched && !isLoading && movie.length==0 && <p className='NoResults'>No results found for {query}</p>}
    {error && <p className='ErrorMessage'>Something went wrong. Please try again.</p>}
    </div>
  )
}