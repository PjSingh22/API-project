import { Link } from 'react-router-dom';
import './AllSpots.css';

const AllSpots = ({spots}) => {
  const defaultImg = "https://www.gannett-cdn.com/presto/2019/10/11/PNAS/adf1101a-0f8c-404f-9df3-5837bf387dfd-1_Exterior_House_Beautiful_Whole_Home_Concept_House_Castle_Homes_Photo_Reed_Brown_Photography.jpg?crop=5619,3161,x0,y104&width=660&height=372&format=pjpg&auto=webp"

  const linkStyle = {
    display: 'grid',
    gridAutoRows: "300px",
    marginBottom: "40px",
    width: "100%",
    textDecoration: "none",
    color:"black"
  }
  return (
    <div className="all-spots">
      {spots.map(spot => (
        <Link to={`/spots/${spot.id}`} key={spot.id} style={linkStyle}>
          <div className='spot-card'>
          <img className="card-img" src={spot.previewImage === 'invalid' ? defaultImg : spot.previewImage} alt="preview" />
            <div className="spot-info">
              <div className="left-half-info">
                <div>
                  <div>
                    <span>{spot.city}</span>, <span>{spot.state}</span>
                  </div>
                  <div>
                    <span> ${spot.price}</span> night
                  </div>
                </div>
              </div>
              <div className="right-half-info">
                <span><i className="fa-solid fa-star"></i>{spot.avgRating}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
};


export default AllSpots;
