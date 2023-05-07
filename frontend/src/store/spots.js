import { csrfFetch } from "./csrf";
const LOAD_SPOTS = "spots/LOAD_SPOTS";

const loadSpots = (spots) => {
  return {
    type: LOAD_SPOTS,
    spots
  }
};

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
    default:
      return state;
  }
};

export default spotsReducer;
