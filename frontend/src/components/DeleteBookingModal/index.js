import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReservedSpotThunk } from '../../store/spots';

const DeleteBookingModal = ({bookingId, spotId}) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteReservedSpotThunk(bookingId))
    closeModal();
  }

  return (
    <div className='delete-modal'>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this booking?</p>
      <div className='delete-buttons'>
        <button className='btn login-btn yes-btn' onClick={handleDelete}>Yes (Delete Booking)</button>
        <button className='btn no-btn' onClick={closeModal}>No (Keep Booking)</button>
      </div>
    </div>
  )
};

export default DeleteBookingModal;
