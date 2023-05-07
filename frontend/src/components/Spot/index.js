
const Spot = ({spot}) => {
  const { address, city, state, price, avgRating, previewImage } = spot;
  return (
    <div>
      <img src={previewImage} />
      <div className="spot-info">

      </div>
    </div>
  )
};

export default Spot;
