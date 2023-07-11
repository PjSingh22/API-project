import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getReservedSpotsThunk } from "../../store/spots";
import "./managereservations.css"

function ManageReservation() {
  const dispatch = useDispatch();
  const reservations = useSelector(state => state.spots.reservedSpots);
  const reservationsArr = Object.values(reservations);

  const dateConverter = (date) => {
    const dateArr = date.split('-');
    const year = dateArr[0];
    const month = dateArr[1];
    const day = dateArr[2].slice(0, 2);
    return `${month}/${day}/${year}`;
  }

  useEffect(() => {
    if (reservationsArr.length) return;
    dispatch(getReservedSpotsThunk());
  }, [dispatch])

  if (!reservationsArr.length) return (
    <div className="no-reservations">
      <h1>You have no reservations</h1>
    </div>
  );
  return (
    <div className="reservations">
      {reservationsArr.length ? reservationsArr.map(reservation => {

        const { previewImage, address, city, state } = reservation.Spot;
        const { startDate, endDate } = reservation;
        return (
          <div className="reservation-container">
            <div className="reservation-image" style={{backgroundImage: `url(${previewImage})`, width: '200px', height: '200px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain'}}></div>
            <div className="reservation-info">
              <div className="reservation-info__address">{address}, {city}, {state}</div>
              {/* convert start date to mm/dd/yyyy */}
              <div className="reservation-info__dates">Start Date: {dateConverter(startDate)}</div>
              <div className="reservation-info__dates">End Date: {dateConverter(endDate)}</div>
            </div>
            <div className="reservation-buttons">
              <button className="reservation-buttons__edit btn">Edit</button>
              <button className="reservation-buttons__delete btn">Delete</button>
            </div>
          </div>
        )
      }) : null}
    </div>
  )
}

export default ManageReservation;
