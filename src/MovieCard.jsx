import './Moviecard.css'
export default function Body({ movie_details, onSelect, isSelected, index}){
    return(
        <div className={`card-container ${isSelected ? 'selected' : ''}`} style={{animationDelay:`${index*0.1}s`}} onClick={() => onSelect(movie_details)}>
            <div className='poster-wrapper'>
                <img className='Poster1' src={ movie_details.image } alt="Poster"></img>
            </div>
            <div className='poster-overlay'>
                    <p className='Title'>{ movie_details.title }</p>
                    <p className='rating'>{ movie_details.rating }/10</p>
            </div>
        </div>
         
    )
}
