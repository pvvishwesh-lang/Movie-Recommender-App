import './SkeletonCard.css'
export default function SkeletonBody(){
    return(
        <div className='card-container'>
            <div className='poster-wrapper'>
                <div className='skeleton-poster'></div>
                <div className='poster-overlay'>
                    <div className='skeleton-title'></div>
                    <div className='skeleton-rating'></div>
                </div>
            </div>
        </div>
         
    )
}
