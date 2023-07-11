import { csrfFetch } from "./csrf";
const LOAD_SPOTS = "spots/LOAD_SPOTS";
const GET_SPOT = "spots/GET_SPOT";
const GET_USER_SPOTS = "spots/GET_USER_SPOTS";
const CREATE_SPOT = "spots/CREATE_SPOT";
const DELETE_SPOT = "spots/DELETE_SPOT";
const UPDATE_SPOT = "spots/UPDATE_SPOT";
const GET_RESERVED_SPOTS = "spots/GET_RESERVED_SPOTS";

const getReservedSpots = (spots) => {
  return {
    type: GET_RESERVED_SPOTS,
    spots
  }
}

const getSpot = (spot) => {
  return {
    type: GET_SPOT,
    spot
  }
}

const updateSpot = (spot) => {
  return {
    type: UPDATE_SPOT,
    spot
  }
}

const createSpot = (spot) => {
  return {
    type: CREATE_SPOT,
    spot
  }
}

const deleteSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId
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

export const getReservedSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/bookings/current");

  if (res.ok) {
    const spots = await res.json();
    dispatch(getReservedSpots(spots));
  } else {
    let errors = await res.json();
    return errors;
  }
}

export const updateSpotThunk = (spot) => async (dispatch) => {
  let res = await csrfFetch(`/api/spots/${spot.id}`, {
    method: "PUT",
    body: JSON.stringify(spot)
  });

  if (res.ok) {
    let spot = await res.json();
    dispatch(updateSpot(spot))
    return spot.id;
  } else {
    let errors = await res.json();
    return errors;
  }
}

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    dispatch(deleteSpot(spotId));
  }
}

export const createSpotThunk = (spot, images, ownerId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots`, {
    method: 'POST',
    body: JSON.stringify(spot)
  });

  if (res.ok) {
    const spot = await res.json();
    for(let i = 0; i < images.length; i++) {
      if (images[i].length) {
        await csrfFetch(`/api/spots/${spot.id}/images`, {
          method: "POST",
          body: JSON.stringify({
            url: images[i],
            preview: true
          })
        });
      }
    }
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

const initialState = { allSpots: {}, singleSpot: {}, reservedSpots: {} };

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RESERVED_SPOTS:
      let reservedSpotsState = {...state, reservedSpots: {}};
      console.log(action.spots.Bookings)
      if(action.spots.Bookings.length) {
        action.spots.Bookings.forEach(booking => {
          reservedSpotsState.reservedSpots[booking.Spot.id] = booking.Spot;
        })
      }
      // action.spots.forEach(spot => {
      //   reservedSpots.reservedSpots[spot.id] = spot;
      // })
      return reservedSpotsState;
    case LOAD_SPOTS:
      let allSpots = {};
      action.spots.forEach(spot => {
        allSpots[spot.id] = spot;
      })

      return { ...state, allSpots: allSpots, singleSpot: {}}
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
    case UPDATE_SPOT:
      let updateState = { ...state };
      updateState.allSpots[action.spot.id] = action.spot;
      return updateState;
    case DELETE_SPOT:
      let alteredState = { ...state, allSpots: { ...state.allSpots } };
      delete alteredState.allSpots[action.spotId];
      return alteredState;
    default:
      return state;
  }
};

export default spotsReducer;
