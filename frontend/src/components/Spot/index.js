import { Link } from 'react-router-dom';
const Spot = ({spot, defaultImg}) => {
  const { id, city, state, price, avgRating, previewImage } = spot;

  const linkStyle = {
    display: 'grid',
    gridAutoRows: "300px",
    marginBottom: "40px",
    width: "100%",
    textDecoration: "none",
    color:"black"
  }
  return (
    <Link to={`/spots/${id}`} key={id} style={linkStyle}>
      <div className='spot-card'>
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
            <span><i className="fa-solid fa-star"></i>{avgRating}</span>
          </div>
        </div>
      </div>
    </Link>
  )
};

export default Spot;
