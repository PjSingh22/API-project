import { csrfFetch } from "./csrf";
const SET_USER = 'session/SET_USER';
const LOGOUT_USER = 'session/LOGOUT_USER';
const GET_USER_SPOTS = "session/GET_USER_SPOTS";

const fetchUser = (user) => {
  return {
    type: SET_USER,
    payload: user
  }
};

const logoutUser = () => {
  return {
    type: LOGOUT_USER
  }
}

const currentUserSpots = (spots) => {
  return {
    type: GET_USER_SPOTS,
    spots
  }
}

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(fetchUser(data.user));
  return response;
};

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch('/api/session', {
    method: "POST",
    body: JSON.stringify({
      credential,
      password
    })
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(fetchUser(data.user));
    return response;
  }
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(logoutUser());
  return response;
};

export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(fetchUser(data.user));
  return response;
};

export const currentUserSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/current`);
  const spots = await res.json();
  dispatch(currentUserSpots(spots.Spots));
}

const initialReducer = { user: null, spots: {} };

const sessionReducer = (state = initialReducer, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload }
    case LOGOUT_USER: {
      return { ...state, user: null, spots: {} }
    }
    case GET_USER_SPOTS:
       const newSpots = {}
       action.spots.forEach(spot => {
        newSpots[spot.id] = spot;
       });
       return { ...state, spots: newSpots }
    default:
      return state;
  }
}

export default sessionReducer;
