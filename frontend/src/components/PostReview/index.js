import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { postReviewThunk } from "../../store/reviews";
import { getSpotThunk } from "../../store/spots";
import "./PostReview.css";

const PostReview = ({spotId, userId}) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const sessionUser = useSelector(state => state.session.user);
  const [rating, setRating] = useState(0);
  const [activeRating, setActiveRating] = useState(rating);
  const [review, setReview] = useState("");
  const [errors, setErrors] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    const errorObj = {};
    if(review.length && review.length < 10) errorObj['textarea'] = "Review needs to be at least 10 characters long"
    if(rating <= 0) errorObj["rating"] = "rating needs to be selected"

    setErrors(errorObj);
  }, [review, rating]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if(Object.values(errors).length) setShowErrors(true);

    const reviewData = {
      spotId,
      userId,
      review,
      stars: rating
    };

    dispatch(postReviewThunk(reviewData, sessionUser))
    .then(() => dispatch(getSpotThunk(spotId)))

    closeModal();
  }
  // toggle between star filled or empty
  const filled = "fa-solid fa-star fa-lg"
  const empty = "fa-regular fa-star fa-lg";

  return (
    <div className="post-review-container">
      <h2>How was your stay?</h2>
      <p className="errors">{errors.textarea}</p>
      <textarea required minLength={10} value={review} onChange={(e) => setReview(e.target.value)} className="post-review-textbox" rows={5} placeholder="Leave your review here..." />
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
      <button className="btn login-btn" onClick={handleSubmit} disabled={Object.values(errors).length}>Submit Your Review</button>
    </div>
  )
};

export default PostReview;
