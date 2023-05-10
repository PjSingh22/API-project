import { csrfFetch } from "./csrf";

const GET_REVIEWS = "spots/GET_REVIEWS";

const getSpotReviews = (reviews) => {
  return {
    type: GET_REVIEWS,
    reviews
  }
};

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
