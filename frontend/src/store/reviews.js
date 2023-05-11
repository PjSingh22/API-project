import { csrfFetch } from "./csrf";

const GET_REVIEWS = "spots/GET_REVIEWS";

const getSpotReviews = (reviews) => {
  return {
    type: GET_REVIEWS,
    reviews
  }
};

export const deleteReviewThunk = (reviewId, spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE"
  });

  if (res.ok) {
    dispatch(getSpotReviewsThunk(spotId))
  } else {
    const errors = await res.ok();
    return errors;
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
