import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getReservedSpotsThunk } from "../../store/spots";
import ReservationCard from "../ReservationCard";
import "./managereservations.css"

function ManageReservation() {
  const dispatch = useDispatch();
  const reservations = useSelector(state => state.spots.reservedSpots);
  const reservationsArr = Object.values(reservations);
  const pastReservations = reservationsArr.filter(reservation => {
    const { endDate } = reservation;
    const { startDate } = reservation;
    const convertedEndDate = new Date(endDate);
    const convertedStartDate = new Date(startDate);
    const today = new Date();
    return convertedEndDate < today || convertedStartDate <= today;
  });

  const dateConverter = (date) => {
    const convertedDate = new Date(date);
    const month = convertedDate.getMonth() + 1;
    const day = convertedDate.getDate();
    const year = convertedDate.getFullYear();
    return `${month}/${day}/${year}`;
  }
  const upcomingReservations = reservationsArr.filter(reservation => {
    const { startDate } = reservation;
    const convertedStartDate = new Date(startDate);
    const today = new Date();

    return convertedStartDate >= today;
  });

  useEffect(() => {
    // if (reservationsArr.length) return;
    dispatch(getReservedSpotsThunk());
  }, [dispatch])

  if (!reservationsArr.length) return (
    <div className="no-reservations">
      <h1>You have no reservations</h1>
    </div>
  );
  return (
    <div className="reservations-container">
      <div className="reservations__upcoming">
        <h1>Upcoming Reservations</h1>
        {upcomingReservations.map(reservation => {
          return <ReservationCard reservation={reservation} key={reservation.id} />
        })}
      </div>
      <div className="reservations__past">
        <h1>Past Reservations</h1>
        {pastReservations.map(reservation => {
          return <ReservationCard reservation={reservation} key={reservation.id} />
        })}
      </div>
    </div>
  )
}

// {reservationsArr.length ? reservationsArr.map(reservation => {

//   const { previewImage, address, city, state } = reservation.Spot;
//   const { startDate, endDate } = reservation;
//   return (
//     <div className="reservation-container">
//       <div className="reservation-image" >
//         <img src={previewImage} alt="preview" />
//       </div>
//       <div className="reservation-info">
//         <div className="reservation-info__address">
//           <div className="reservation-address__main">{address}</div>
//           <div className="reservation-address__city">{city}, {state}</div>
//         </div>
//         {/* convert start date to mm/dd/yyyy */}
//         <div className="reservation-info__dates">Start Date: {dateConverter(startDate)}</div>
//         <div className="reservation-info__dates">End Date: {dateConverter(endDate)}</div>
//       </div>
//       <div className="reservation-buttons">
//         <button className="reservation-buttons__edit btn">Edit</button>
//         <button className="reservation-buttons__delete btn">Delete</button>
//       </div>
//     </div>
//   )
// }) : null}

export default ManageReservation;
