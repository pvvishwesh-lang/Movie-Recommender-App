import { useState } from 'react';

export default function SearchComponent({ onSearch }){
    const [query, setQuery] = useState("")
    return(
        <div className='SearchBar'>
            <input className='Searchinput' value={query} onChange={(e)=>setQuery(e.target.value)} />
            <button className='SearchButton' onClick={()=>onSearch(query)}>Search</button>
        </div>
    )
};