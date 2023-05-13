import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Spot.css'
const Spot = ({spot}) => {
  const { id, city, state, price, avgRating, previewImage, name } = spot;
  const [showToolTip, setShowToolTip] = useState(false);
  const defaultImg = "https://www.gannett-cdn.com/presto/2019/10/11/PNAS/adf1101a-0f8c-404f-9df3-5837bf387dfd-1_Exterior_House_Beautiful_Whole_Home_Concept_House_Castle_Homes_Photo_Reed_Brown_Photography.jpg?crop=5619,3161,x0,y104&width=660&height=372&format=pjpg&auto=webp"

  const linkStyle = {
    display: 'grid',
    gridAutoRows: "300px",
    marginBottom: "40px",
    width: "100%",
    textDecoration: "none",
    color:"black"
  }

  let toolTipStyle = showToolTip ? "tooltip visible" : "tooltip";
  return (
    <Link to={`/spots/${id}`} key={id} style={linkStyle}>
      <div className='spot-card' onMouseEnter={() => setShowToolTip(true)} onMouseLeave={() => setShowToolTip(false)}>
        <p className={toolTipStyle}>{name}</p>
        <img className="card-img" src={previewImage === 'invalid' ? defaultImg : previewImage} alt="preview" />
        <div className="spot-info">
          <div className="left-half-info">
            <div>
              <div>
                <span>{city}</span>, <span>{state}</span>
              </div>
              <div>
                <span> ${price}</span> night
              </div>
            </div>
          </div>
          <div className="right-half-info">
            {avgRating ? <span className='star-rating'><i className="fa-solid fa-star"></i>{parseFloat(avgRating).toFixed(1)}</span> : "New"}
          </div>
        </div>
      </div>
    </Link>
  )
};

export default Spot;
