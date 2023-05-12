import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import { useModal } from "../../context/Modal";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  // const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const { closeModal } = useModal();

  // implement useEffect to disable button if invalid input fields
  useEffect(() => {
    const inputErrors = {};
    if (!email.includes('@')) inputErrors["email"] = "Enter valid email";
    setErrors(inputErrors);
    if (username.length < 4) inputErrors["username"] = "needs to be more than 4 characters"
    if (!password.length || !confirmPassword.length) inputErrors["password"] = 'field cant be empty'
    if (password.length < 6) inputErrors['password'] = "password needs to be greater than 6 characters"
  }, [email, username])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(errors).length) return setShowErrors(true);
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  const isDisabled = Object.keys(errors).length ? "login-btn disabled" : "login-btn btn"

  return (
    <div className="user-form signup-form form">
      <h1 style={{textAlign: 'center'}}>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {(errors.email && showErrors) && <p>{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required

          />
        </label>
        {(errors.username && showErrors) && <p className="errors">{errors.username}</p>}
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {(errors.firstName && showErrors) && <p>{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {(errors.lastName && showErrors) && <p>{errors.lastName}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        {(errors.password && showErrors) && <p>{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        {(errors.confirmPassword && showErrors) && <p>{errors.confirmPassword}</p>}
        <button className={isDisabled}  type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
