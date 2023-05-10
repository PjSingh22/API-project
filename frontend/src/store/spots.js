import { csrfFetch } from "./csrf";
const LOAD_SPOTS = "spots/LOAD_SPOTS";
const GET_SPOT = "spots/GET_SPOT";
const GET_USER_SPOTS = "spots/GET_USER_SPOTS";
const CREATE_SPOT = "spots/CREATE_SPOT";

const getSpot = (spot) => {
  return {
    type: GET_SPOT,
    spot
  }
}

const createSpot = (spot) => {
  return {
    type: CREATE_SPOT,
    spot
  }
}

const currentUserSpots = (spots) => {
  return {
    type: GET_USER_SPOTS,
    spots
  }
}

const loadSpots = (spots) => {
  return {
    type: LOAD_SPOTS,
    spots
  }
};

export const createSpotThunk = (spot) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots`, {
    method: 'POST',
    body: JSON.stringify(spot)
  });

  if (res.ok) {
    const spot = await res.json();
    dispatch(createSpot(spot));
    return spot.id;
  } else {
    let errors = await res.json();
    return errors;
  }
}

export const currentUserSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/current`);
  const spots = await res.json();
  dispatch(currentUserSpots(spots.Spots));
}

export const getSpotThunk = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  const spot = await response.json();

  dispatch(getSpot(spot));
}

export const loadSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');
  const data = await response.json();
  dispatch(loadSpots(data.Spots))
}

const initialState = { allSpots: {}, singleSpot: {} };

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      let allSpots = {};
      action.spots.forEach(spot => {
        allSpots[spot.id] = spot;
      })

      return { ...state, allSpots: allSpots}
    case CREATE_SPOT:
      return { ...state, allSpots: { ...state.allSpots, [action.spot.id]: action.spot }}
    case GET_SPOT:
      return { ...state, singleSpot: action.spot}
    case GET_USER_SPOTS:
      let newState = { allSpots: {}, singleSpot: {} };
      const newSpots = {}
      action.spots.forEach(spot => {
       newSpots[spot.id] = spot;
      });
      newState.allSpots = newSpots;
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
