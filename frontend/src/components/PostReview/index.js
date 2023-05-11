import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { postReviewThunk } from "../../store/reviews";
import { getSpotThunk } from "../../store/spots";
import "./PostReview.css";

const PostReview = ({spotId, userId}) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [rating, setRating] = useState(0);
  const [activeRating, setActiveRating] = useState(rating);
  const [review, setReview] = useState("");
  const [errors, setErrors] = useState("");

  useEffect(() => {
    const errorObj = {};
    if(review.length < 10) errorObj['textarea'] = "Review needs to be at least 10 characters long"
    if(rating <= 0) errorObj["rating"] = "rating needs to be selected"

    setErrors(errorObj);
  }, [review, rating]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const reviewData = {
      spotId,
      userId,
      review,
      stars: rating
    };

    dispatch(postReviewThunk(reviewData));
    dispatch(getSpotThunk(spotId));
    closeModal();
  }

  const filled = "fa-solid fa-star fa-lg"
  const empty = "fa-regular fa-star fa-lg";

  return (
    <div className="post-review-container">
      <h2>How was your stay?</h2>
      <p className="errors">{errors.textarea}</p>
      <textarea value={review} onChange={(e) => setReview(e.target.value)} className="post-review-textbox" rows={5}  />
      <div className="post-review-star-rating">
        <div onMouseEnter={() => setActiveRating(1)} onMouseLeave={() => setActiveRating(rating)} onClick={() => setRating(1)}>
          <i className={activeRating >= 1 ? filled : empty }></i>
        </div>
        <div onMouseEnter={() => setActiveRating(2)} onMouseLeave={() => setActiveRating(rating)} onClick={() => setRating(2)}>
          <i className={activeRating >= 2 ? filled : empty }></i>
        </div>
        <div onMouseEnter={() => setActiveRating(3)} onMouseLeave={() => setActiveRating(rating)} onClick={() => setRating(3)}>
          <i className={activeRating >= 3 ? filled : empty }></i>
        </div>
        <div onMouseEnter={() => setActiveRating(4)} onMouseLeave={() => setActiveRating(rating)} onClick={() => setRating(4)}>
          <i className={activeRating >= 4 ? filled : empty }></i>
        </div>
        <div onMouseEnter={() => setActiveRating(5)} onMouseLeave={() => setActiveRating(rating)} onClick={() => setRating(5)}>
          <i className={activeRating >= 5 ? filled : empty }></i>
        </div>
      </div>
      <button onClick={handleSubmit} disabled={Object.values(errors).length}>Post</button>
    </div>
  )
};

export default PostReview;
