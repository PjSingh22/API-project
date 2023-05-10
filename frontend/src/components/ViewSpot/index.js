import { useEffect, useReducer, useState } from "react";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getSpotThunk } from "../../store/spots";
import { getSpotReviewsThunk } from "../../store/reviews";
import './ViewSpot.css';

const ViewSpot = ({defaultImg}) => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spotObj = useSelector(state => state.spots.singleSpot);
  const reviewsObj = useSelector(state => state.reviews.spot)
  const reviews = Object.values(reviewsObj);
  const { address, avgStarRating, city, country, description, lat, lng, name, numReviews, owner, price, spotImages, state } = spotObj;

  useEffect(() => {
    dispatch(getSpotReviewsThunk(spotId));
    dispatch(getSpotThunk(spotId))
  }, [dispatch]);

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
              <p><i className="fa-solid fa-star"></i> {avgStarRating} &#x2022; {numReviews} Reviews</p>
            </div>
            <button className="btn login-btn" onClick={() => alert('feature coming soon')}>Reserve</button>
          </div>
        </div>
        <div className="spot-reviews">
          <p style={{fontSize: "1.2em"}}><i className="fa-solid fa-star"></i> {avgStarRating} &#x2022; {numReviews} Reviews</p>
          {reviews.map(review => (
            <div className="spot__review">
              <p className="review-username">{review.User.firstName}</p>
              <p className="review-postDate">{review.createdAt}</p>
              <p className="review-desc">{review.review}</p>
            </div>
          ))}
        </div>
      </div>
    )
};

export default ViewSpot;
