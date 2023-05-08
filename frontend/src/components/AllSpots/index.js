import noImg from '../../No_Image_Available.jpg'
import './AllSpots.css';

const AllSpots = ({spots}) => {
  return (
    <div className="all-spots">
      {spots.map(spot => (
        <div className="spot-card">
         <img className="card-img" src={spot.previewImage === 'invalid' ? noImg : spot.previewImage} alt="preview" />
          <div className="spot-info">
            <div className="left-half-info">
              <div>
                <div>
                  <span>{spot.city}</span>, <span>{spot.state}</span>
                </div>
                <div>
                  <span>${spot.price}</span> night
                </div>
              </div>
            </div>
            <div className="right-half-info">
              <span>*{spot.avgRating}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
};


export default AllSpots;
