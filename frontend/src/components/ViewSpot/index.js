import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getSpotThunk } from "../../store/spots";
import { getSpotReviewsThunk } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import DeleteReviewButton from "../DeleteReviewButton";
import PostReview from "../PostReview";
import './ViewSpot.css';

const ViewSpot = ({defaultImg}) => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spotObj = useSelector(state => state.spots.singleSpot);
  const userObj = useSelector(state => state.session.user);
  // const ratingListener = useSelector(state => state.spots.singleSpot.avgStarRating);
  const reviewsObj = useSelector(state => state.reviews.spot);
  const reviews = Object.values(reviewsObj);
  const { avgStarRating, city, country, description, name, numReviews, owner, price, spotImages, state } = spotObj;
  // const [rating, setRating] = useState(ratingListener);
  // console.log(reviewsObj)
  const showAddRevBtn = () => {
    if (userObj) {

      if (userObj?.id === owner?.id) return false;

      if (userObj?.id !== owner?.id ) {
        for (let review in reviewsObj) {
          if (reviewsObj[review].userId === userObj.id) {
            return false;
          }
        }
      }

      return true;
    }
  };

  const showBtn = showAddRevBtn();

  useEffect(() => {
    dispatch(getSpotReviewsThunk(spotId));
    dispatch(getSpotThunk(spotId))
  }, [dispatch, spotId]);

  // TODO: refactor this to look simpler. change to use reviews variable and check for spotId
  if(!spotObj.spotImages || (Object.values(spotObj).length === 0 && Object.values(reviewsObj).length === 0)) {
    return null;
  }
    return (
      <div className="view-container">
        <div className="spot-header">
          <p style={{fontSize: '25px'}} className="spot__main-title">{name}</p>
          <p className="spot__header-info">{city}, {state}, {country}</p>
        </div>
        <div className="spot-images">
          <div className="main-img">
            <img src={spotImages[0] ? spotImages[0].url : defaultImg} alt="home" />
          </div>
          <div className="other-imgs">
            <img src={spotImages[1] ? spotImages[1].url : defaultImg} alt="home" />
            <img src={spotImages[2] ? spotImages[2].url : defaultImg} alt="home" />
            <img src={spotImages[3] ? spotImages[3].url : defaultImg} alt="home" />
            <img src={spotImages[4] ? spotImages[4].url : defaultImg} alt="home" />
          </div>
        </div>
        <div className="spot__spot-info">
          <div className="spot-info-left">
            <p style={{fontSize: "1.3eem"}}>Hosted by {owner.firstName} {owner.lastName}</p>
            <p className="spot__desc">{description}</p>
          </div>
          <div className="spot-info-right">
            <div className="upper-info">
              <p className="spot-info__price">${price} night</p>
              {/* put this and the one below in own component */}
              {numReviews === 0 ?
              <p style={{fontSize: "1.2em"}}><i className="fa-solid fa-star"></i> {numReviews ?  parseFloat(avgStarRating).toFixed(1) : "New"}</p>
              :
              <p style={{fontSize: "1.2em"}}><i className="fa-solid fa-star"></i> {parseFloat(avgStarRating).toFixed(1)} &#x2022; {numReviews} {numReviews === 1 ? "Review" : "Reviews" }</p>}
            </div>
            <button className="btn login-btn" onClick={() => alert('feature coming soon')}>Reserve</button>
          </div>
        </div>
        {userObj ? showBtn ? <button className="add-rev-btn"><OpenModalButton
          className="create-rev-btn btn"
          buttonText="Create a review"
          modalComponent={<PostReview spotId={spotObj?.id} userId={userObj?.id} />}
        /></button> : null : null }
        <div className="spot-reviews">
           {numReviews === 0 ? <p style={{fontSize: "1.2em"}}><i className="fa-solid fa-star"></i> {numReviews ?  parseFloat(avgStarRating).toFixed(1) : "New"}</p>
           :
           <p style={{fontSize: "1.2em"}}><i className="fa-solid fa-star"></i> {parseFloat(avgStarRating).toFixed(1)} &#x2022; {numReviews} {numReviews === 1 ? "Review" : "Reviews" }</p>}

          { (reviews.length <= 0 && owner?.id !== userObj?.id) ? <p>Be the first to post a review!</p> : reviews.reverse().map(review => {
            const convertedDate = new Date(review.createdAt).toDateString().split(" ");
            const postedDate = `${convertedDate[1]} ${convertedDate[3]}`
            return (
            <div className="spot__review">
              <p className="review-username">{review.User?.firstName}</p>
              <p className="review-postDate">{postedDate}</p>
              <p className="review-desc">{review.review}</p>
              {userObj?.id === review.User?.id ? <button className="delete-rev-btn"><OpenModalButton className="delete-rev-btn btn" buttonText="Delete review" modalComponent={<DeleteReviewButton reviewId={review.id} spotId={spotObj.id} />} /></button> : null}
            </div>
          )})}
        </div>
      </div>
    )
};

export default ViewSpot;
