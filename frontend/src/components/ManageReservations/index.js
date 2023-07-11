import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getReservedSpotsThunk } from "../../store/spots";
import "./managereservations.css"

function ManageReservation() {
  const dispatch = useDispatch();
  const reservations = useSelector(state => state.spots.reservedSpots);
  const reservationsArr = Object.values(reservations);

  useEffect(() => {
    if (reservationsArr.length) return;
    dispatch(getReservedSpotsThunk());
  }, [dispatch])

  return (
    <div>
      {reservationsArr.length ? reservationsArr.map(reservation => {
        const { previewImage, address, city, country, state } = reservation;
        return (
          <div className="reservation-container">
            <div className="reservation-image" style={{backgroundImage: `url(${previewImage})`, width: '300px', height: '300px', backgroundPosition: 'center', backgroundRepeat: 'none', backgroundSize: 'contain'}}></div>
            <div className="reservation-info">
              <div className="reservation-info__address">{address}, {city}, {state}</div>
            </div>
            <div className="reservation-buttons">
              <button className="reservation-buttons__edit">Edit</button>
              <button className="reservation-buttons__delete">Delete</button>
            </div>
          </div>
        )
      }) : null}
    </div>
  )
}

export default ManageReservation;
