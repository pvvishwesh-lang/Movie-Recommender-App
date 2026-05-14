import { Badge } from 'react-bootstrap';
import { Stack } from 'react-bootstrap';
import './Moviecard.css'
export default function Body({ movie_details }){
    return(
        <div className='card-container'>
            <img className='Poster1' src={ movie_details.image } alt="Poster"></img>
            <div className='card-body'>
                <h1 className='Title'>{ movie_details.title }</h1>
                <Stack className='genre-stack' direction='horizontal' gap={2}>
                    {movie_details.genres.map((genre, index)=>(
                        <Badge className='genre-badge' key={index}  bg='danger'>{genre}</Badge>
                    ))}
                </Stack>
                <p className='Description'>{ movie_details.description }</p>
                <p className='rating'>Rating: { movie_details.rating }/10</p>
            </div>
        </div>
         
    )
}
