import Body from './MovieCard'
import 'bootstrap/dist/css/bootstrap.min.css'
import SearchComponent from './SearchBar'
import { useState , useEffect, useRef } from 'react';
import './App.css'
import { Badge } from 'react-bootstrap';
import SkeletonBody from './SkeletonCard';
export default function App(){
  const [query,setQuery] = useState("")
  const [movie, setMovie] =useState([])
  const [genre, setGenre] = useState(null)
  const [isLoading,setIsLoading]=useState(false)
  const [isSearched, setSearched]=useState(false)
  const [error, setError] = useState(null)
  const [isDark, setDark] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [topMovies,setTopMovies]=useState([])
  const detailRef = useRef(null)
  const [aiPrompt,setAiPrompt]=useState("")
  const [aiLoading,setAiLoading]=useState(false)
  const [aiResults,setAiResults]=useState([])
  useEffect(()=>{
    if (selectedMovie && detailRef.current){
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  },[selectedMovie])

  useEffect(()=>{
   const setTheme=async()=>{ 
    document.body.classList[isDark ? 'remove' : 'add']('light-mode')
  };
  setTheme();
  },[isDark]);

  const aiHandle=async()=>{
    try{
      setAiLoading(true)
      const response=await fetch(`https://movie-recommender-app-7qz4.onrender.com/recommend`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:aiPrompt,movie:selectedMovie?.title || null})})
      const data=await response.json()
      setAiResults(data.recommendations)
    }
    catch(error){
      console.error('AI recommendation error:', error)
    }
    finally{
      setAiLoading(false)
    }
  }

  useEffect(()=>{
    const fetchData=async()=>{
      try{
        const genreResponse=await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_API_KEY}`);
        const topResponse=await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${import.meta.env.VITE_API_KEY}`);
        const genreResult=await genreResponse.json();
        const topResult=await topResponse.json();
        const genreMap={}
        genreResult.genres.forEach(g=>genreMap[g.id]=g.name)
        setGenre(genreMap)
        setTopMovies(topResult.results)
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
    <div className={isDark ? 'dark' : 'light'}>
    <div className='header'>
      <div></div>
      <h1 className='WebPageTitle'>Movie Recommender</h1>
      <button className='theme-toggle' onClick={() => setDark(!isDark)}>{isDark ? '☀️' : '🌙'}</button>
    </div>
    <p className='tagline'>Discover your next favorite film</p>
    <SearchComponent onSearch={handleSearch} />
    {isLoading && (
      <div className='results'>
        {[...Array(5)].map((_, index) => (
            <SkeletonBody key={index} />
        ))}
      </div>
    )}
    {!isSearched && !isLoading && 
    <div className='top-movies'> 
      <h2 className='top-title'>Top Rated Movies</h2>
      <div className='results'>
        {topMovies.slice(0,10).map((m,index)=>(
        <Body key={index} index={index} movie_details={{
          title: m.title,
          image: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
          genres: genre ? m.genre_ids.map(id=>genre[id]).filter(Boolean):m.genre_ids,
          description: m.overview,
          rating: m.vote_average.toFixed(1)
        }} 
          isSelected={selectedMovie?.title===m.title}
          onSelect={(movie)=> 
          selectedMovie?.title===movie.title ? setSelectedMovie(null) : setSelectedMovie(movie)
          } />
        ))}
      </div>
    </div>
    }
    {isSearched && !isLoading && movie.length > 0 &&
    <div className='results-wrapper'>
      <div className='results'>
        {movie.map((m,index)=>(
        <Body key={index} index={index} movie_details={{
          title: m.title,
          image: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
          genres: genre ? m.genre_ids.map(id=>genre[id]).filter(Boolean):m.genre_ids,
          description: m.overview,
          rating: m.vote_average.toFixed(1)
        }} 
          isSelected={selectedMovie?.title===m.title}
          onSelect={(movie)=> 
          selectedMovie?.title===movie.title ? setSelectedMovie(null) : setSelectedMovie(movie)
          } />
        ))}
      </div>
    </div>
    }
    {selectedMovie && (
    <div className='detail-panel' ref={detailRef}>
      <button className='close-btn' onClick={() => setSelectedMovie(null)}>✕</button>
      <img className='detail-poster' src={selectedMovie.image} alt={selectedMovie.title} />
      <div className='detail-info'>
        <h2 className='detail-title'>{selectedMovie.title}</h2>
        <div className='detail-genres'>
          {selectedMovie.genres.map((genre, index) => (
            <Badge key={index} bg='danger' className='genre-badge'>{genre}</Badge>
          ))}
        </div>
        <p className='detail-description'>{selectedMovie.description}</p>
        <p className='detail-rating'> {selectedMovie.rating}/10</p>
      </div>
    </div>
)}
    <div className='ai-section'>
      <h2 className='ai-title'>AI Recommendations</h2>
      <div className='AiPromptBar'>
        <input className='AiPrompt' placeholder='Enter your prompt here.' value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} onKeyDown={(e) => {if (e.key === 'Enter' && aiPrompt.trim()) {aiHandle(aiPrompt)};}}/>
        <button className='AiSearchButton' onClick={()=> {if (aiPrompt.trim()) {aiHandle(aiPrompt)}}}>Recommend</button>
      </div>
      {aiLoading && <p className='Searching'>Getting recommendations...</p>}
      {aiResults.length > 0 && (<div className='ai-results'> {aiResults.map((result,index)=>(<p key={index}>{result}</p>))}</div>) }
    </div> 
    {isSearched && !isLoading && movie.length==0 && <p className='NoResults'>No results found for {query}</p>}
    {error && <p className='ErrorMessage'>Something went wrong. Please try again.</p>}
    </div>
  )
}