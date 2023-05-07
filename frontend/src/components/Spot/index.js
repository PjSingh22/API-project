
const Spot = ({spot}) => {
  const { address, city, state, price, avgRating, previewImage } = spot;
  return (
    <div className="">
      {previewImage === 'invalid' ?
      <div className="spot-img">No Image Available</div>
      :
      <div className="spot-img">
        <img src={previewImage} alt="preview" />
      </div>
      }
      <div className="spot-info">
        <div className="left-half-info">
          <div>
            <span>{city}</span>, <span>{state}</span>
          </div>
        </div>
        <div className="right-half-info">
          <span>*{avgRating}</span>
        </div>
      </div>
    </div>
  )
};

export default Spot;
