import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteSpotThunk } from '../../store/spots';
import "./DeleteButton.css";

const DeleteButton = ({spotId}) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const deleteHandler = () => {
    dispatch(deleteSpotThunk(spotId))
    closeModal();
  }

  return (
    <div className='delete-modal'>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot?</p>
      <div className='delete-buttons'>
        <button className='btn yes-btn login-btn' onClick={deleteHandler}>Yes (Delete Spot)</button>
        <button className='btn no-btn' onClick={closeModal}>No (Keep Spot)</button>
      </div>
    </div>
  )
};

export default DeleteButton;
