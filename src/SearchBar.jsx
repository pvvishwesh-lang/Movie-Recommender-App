import { useState } from 'react';
import './SearchBar.css'

export default function SearchComponent({ onSearch }){
    const [query, setQuery] = useState("")
    return(
        <div className='SearchBar'>
            <input className='Searchinput' placeholder='Search for a movie' value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => {if (e.key === 'Enter' && query.trim()) {onSearch(query);}}}/>
            <button className='SearchButton' onClick={()=> {if (query.trim()) onSearch(query)}}>Search</button>
        </div>
    )
};