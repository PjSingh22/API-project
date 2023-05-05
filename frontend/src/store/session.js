import { csrfFetch } from "./csrf";
const SET_USER = 'session/SET_USER';
const LOGOUT_USER = 'session/LOGOUT_USER';

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
}

// export const logoutUserThunk = () => async (dispatch) => {

// }


const initialReducer = { user: null };

const sessionReducer = (state = initialReducer, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload }
    case LOGOUT_USER: {
      return { ...state, user: null }
    }
    default:
      return state;
  }
}

export default sessionReducer;
