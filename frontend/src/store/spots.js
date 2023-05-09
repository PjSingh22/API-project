import { csrfFetch } from "./csrf";
const LOAD_SPOTS = "spots/LOAD_SPOTS";
const GET_SPOT = "spots/GET_SPOT";
const GET_USER_SPOTS = "spots/GET_USER_SPOTS";

const getSpot = (spot) => {
  return {
    type: GET_SPOT,
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

export const currentUserSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/current`);
  const spots = await res.json();
  console.log('spots from thunk', spots);
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
