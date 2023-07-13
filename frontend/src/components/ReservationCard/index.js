import { useHistory } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton';
import DeleteBookingModal from '../DeleteBookingModal';
import UpdateReservation from "../UpdateReservationModal";
import './reservationcard.css'

function ReservationCard({ reservation }) {
  const history = useHistory();
  // const { address, city, state } = reservation.Spot;
  const { startDate, endDate } = reservation;

  const handleRoute = (e) => {
    if (e.target.className.includes('upcoming-btns') || e.target.className.includes('open-modal')) return;
    history.push(`/spots/${reservation.Spot.id}`);
  }

  const pastResevation = () => {
    const convertedEndDate = new Date(endDate);
    const convertedStartDate = new Date(startDate);
    const today = new Date();
    return convertedEndDate < today || convertedStartDate <= today;
  }

  const dateConverter = (date) => {
    const dateArr = date.split('-');
    const year = dateArr[0];
    const month = dateArr[1];
    const day = dateArr[2].slice(0, 2);
    return `${month}/${day}/${year}`;
  }

  if (!reservation) return null;
  return (
    <div onClick={(e) => handleRoute(e)} className="reservation-container">
      <div className="reservation-image" >
        <img src={reservation?.Spot?.previewImage} alt="preview" />
      </div>
      <div className="reservation-info">
        <div className="reservation-info__address">
          <div className="reservation-address__main">{reservation?.Spot?.address}</div>
          <div className="reservation-address__city">{reservation?.Spot?.city}, {reservation?.Spot?.state}</div>
        </div>
        {/* convert start date to mm/dd/yyyy */}
        <div className="reservation-info__dates">Start Date: {dateConverter(startDate)}</div>
        <div className="reservation-info__dates">End Date: {dateConverter(endDate)}</div>
      </div>
      <div className="reservation-buttons">
        {pastResevation() ? <button className="reservation-buttons__review btn" onClick={(e) => handleRoute(e)}>Leave a Review</button> : (
          <>
            <button className="reservation-buttons__edit upcoming-btns btn"><OpenModalButton className="reservation-buttons__edit btn" buttonText="Edit" modalComponent={<UpdateReservation reservation={reservation} />} /></button>
            <button className="reservation-buttons__delete upcoming-btns btn">
              <OpenModalButton className="reservation-buttons__delete upcoming-btns" buttonText="Delete" modalComponent={<DeleteBookingModal bookingId={reservation?.id} spotId={reservation?.Spot?.id} />} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ReservationCard;
