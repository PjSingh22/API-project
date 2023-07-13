import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import "./reservationmodal.css"
import { useSelector } from "react-redux";
import { createReservedSpotThunk } from "../../store/spots";

function ReservationModal({ spot }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();
  const user = useSelector(state => state.session.user)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      spotId: spot.id,
      userId: user.id,
      startDate,
      endDate
    }

    return dispatch(createReservedSpotThunk(body))
      .then((data) => {
        setStartDate("");
        setEndDate("");
        closeModal();
        alert("Reservation Successful!")
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          console.log("reservation errors", data.errors);
          setErrors(data.errors);
        }
      })

  }
  return (
    <div className="new-reservation-container">
      {Object.values(errors).length > 0 && (
        <div className="errors-container">
          {Object.values(errors).map((error, idx) => (
            <div style={{color: 'red'}} key={idx}>{error}</div>
          ))}
        </div>
      )}
      <form className="new-reservation-form" onSubmit={handleSubmit}>
        <div className="dates-container">
          <div className="dates-container__start-date">
            <label htmlFor="start-date">Start Date</label>
            <input onChange={(e) => setStartDate(e.target.value)} type="date" name="start-date" id="start-date" />
          </div>
          <div className="dates-container__end-date">
            <label htmlFor="end-date">End Date</label>
            <input onChange={(e) => setEndDate(e.target.value)} type="date" name="end-date" id="end-date" />
          </div>
        </div>
        <button className="btn login-btn" type="submit">Book</button>
      </form>
    </div>
  )
}

export default ReservationModal;
