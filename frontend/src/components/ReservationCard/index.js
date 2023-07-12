import './reservationcard.css'

function ReservationCard({ reservation }) {
   const { previewImage, address, city, state } = reservation.Spot;
    const { startDate, endDate } = reservation;

  const pastResevation = () => {
    const convertedEndDate = new Date(endDate);
    const today = new Date();
    return convertedEndDate < today;
  }

  const dateConverter = (date) => {
    const dateArr = date.split('-');
    const year = dateArr[0];
    const month = dateArr[1];
    const day = dateArr[2].slice(0, 2);
    return `${month}/${day}/${year}`;
  }
  return (
    <div className="reservation-container">
      <div className="reservation-image" >
        <img src={previewImage} alt="preview" />
      </div>
      <div className="reservation-info">
        <div className="reservation-info__address">
          <div className="reservation-address__main">{address}</div>
          <div className="reservation-address__city">{city}, {state}</div>
        </div>
        {/* convert start date to mm/dd/yyyy */}
        <div className="reservation-info__dates">Start Date: {dateConverter(startDate)}</div>
        <div className="reservation-info__dates">End Date: {dateConverter(endDate)}</div>
      </div>
      <div className="reservation-buttons">
        {pastResevation() ? <button className="reservation-buttons__review btn">Leave a Review</button> : (
          <>
            <button className="reservation-buttons__edit btn">Edit</button>
            <button className="reservation-buttons__delete btn">Delete</button>
          </>
        )}
      </div>
    </div>
  )
}

export default ReservationCard;
