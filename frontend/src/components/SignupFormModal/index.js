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
  }, [email, username, confirmPassword, password])

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

  // const checkInputs = () => {
  //   const inputs = [email, username, firstName, lastName, password, confirmPassword];

  //   for (let i = 0; i < inputs.length; i++) {
  //     const input = inputs[i];

  //     if(!input.length) return true
  //   }
  //   return false;
  // }


  return (
    <div className="user-form signup-form form">
      <h1 style={{textAlign: 'center'}}>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            placeholder="Email"
            className="user-form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {(errors.email && showErrors) && <p>{errors.email}</p>}
        <label>
          <input
            placeholder="Username"
            className="user-form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required

          />
        </label>
        {(errors.username && showErrors) && <p className="errors">{errors.username}</p>}
        <label>
          <input
            placeholder="First Name"
            className="user-form-input"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {(errors.firstName && showErrors) && <p>{errors.firstName}</p>}
        <label>
          <input
            className="user-form-input"
            placeholder="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {(errors.lastName && showErrors) && <p>{errors.lastName}</p>}
        <label>
          <input
            className="user-form-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            maxLength={30}
          />
        </label>
        {(errors.password && showErrors) && <p>{errors.password}</p>}
        <label>
          <input
            className="user-form-input"
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            maxLength={30}
          />
        </label>
        {(errors.confirmPassword && showErrors) && <p className="errors">{errors.confirmPassword}</p>}
        <button className="login-btn btn" type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
