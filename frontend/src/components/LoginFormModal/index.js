import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const demoUserName = "demo@user.io";
  const demoPassword = "password";

  const demoUser = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential: demoUserName, password: demoPassword }))
    .then(closeModal)
    .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
    .then(closeModal)
    .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
    );
  };

  return (
    <div className="user-form login-form form">
      <h1 style={{textAlign: 'center'}}>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            className="user-form-input"
            placeholder="Username or Email"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            className="user-form-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p className="errors">{errors.credential}</p>}
        <button className="login-btn btn" type="submit">Log In</button>
      </form>
      <button className="demo-user btn" onClick={demoUser}>Demo User</button>
    </div>
  );
}

export default LoginFormModal
