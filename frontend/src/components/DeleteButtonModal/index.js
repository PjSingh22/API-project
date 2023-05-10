import { useState } from 'react';
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
    window.location.reload(false);
  }

  return (
    <div>
      <h2>Are you sure you want to delete this spot?</h2>
      <div className='delete-buttons'>
        <button className='btn' onClick={deleteHandler}>Yes</button>
        <button className='btn' onClick={closeModal}>No</button>
      </div>
    </div>
  )
};

export default DeleteButton;
