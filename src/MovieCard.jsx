import { Badge } from 'react-bootstrap';
import { Stack } from 'react-bootstrap';
import './Moviecard.css'
export default function Body({ movie_details, onSelect, isSelected }){
    return(
        <div className={`card-container ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(movie_details)}>
            <div className='poster-wrapper'>
                <img className='Poster1' src={ movie_details.image } alt="Poster"></img>
            </div>
            <div className='card-body'>
                <p className='Title'>{ movie_details.title }</p>
                <p className='rating'>Rating: { movie_details.rating }/10</p>
            </div>
        </div>
         
    )
}
