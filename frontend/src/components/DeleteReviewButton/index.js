import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReviewThunk } from '../../store/reviews';
import { getSpotThunk } from '../../store/spots';
import './DeleteReviewButton.css';

const DeleteReviewButton = ({reviewId, spotId}) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const deleteHandler = () => {
    dispatch(deleteReviewThunk(reviewId, spotId))
    .then(dispatch(getSpotThunk(spotId)))
    .then(closeModal());
  }

  return (
    <div className='delete-modal'>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this comment?</p>
      <div className='delete-buttons'>
        <button className='btn yes-btn' onClick={deleteHandler}>Yes</button>
        <button className='btn no-btn' onClick={closeModal}>No</button>
      </div>
    </div>
  )
};

export default DeleteReviewButton;
