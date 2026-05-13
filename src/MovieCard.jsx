import { Badge } from 'react-bootstrap';
import { Stack } from 'react-bootstrap';
import './Moviecard.css'
export default function Body({ movie_details }){
    return(
        <div className='card-container'>
            <img className='Poster1' src={ movie_details.image } alt="Indiana Jones and the raiders of the lost ark"></img>
            <div className='card-body'>
                <h1 className='Title'><b><i>{ movie_details.title }</i></b></h1>
                <Stack direction='horizontal' gap={2}>
                    {movie_details.genres.map((genre, index)=>(
                        <Badge key={index}  bg='light' text='dark'>{genre}</Badge>
                    ))}
                </Stack>
                <p className='Description'>{ movie_details.description }</p>
                <p className='rating'>RATING: { movie_details.rating }</p>
            </div>
        </div>
         
    )
}
