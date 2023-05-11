import { csrfFetch } from "./csrf";

const GET_REVIEWS = "spots/GET_REVIEWS";
const POST_REVIEW = "spots/POST_REVIEW";

const getSpotReviews = (reviews) => {
  return {
    type: GET_REVIEWS,
    reviews
  }
};

const postReview = (review) => {
  return {
    type: POST_REVIEW,
    review
  }
};

export const postReviewThunk = (review) => async (dispatch) => {
  const { spotId } = review;
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify(review)
  });

  if (res.ok) {
    dispatch(getSpotReviewsThunk(spotId));
  } else {
    const errors = await res.json();
    return errors;
  }
}

export const getSpotReviewsThunk = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const reviews = await response.json();
  dispatch(getSpotReviews(reviews.Reviews));
}

const initialState = { spot: {}, user: {} };

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REVIEWS:
      const reviewsState = {};
      action.reviews.forEach(review => {
        reviewsState[review.id] = review;
      });
      return { ...state, spot: reviewsState}
      // return state;
    default:
      return state;
  }
}

export default reviewsReducer;
