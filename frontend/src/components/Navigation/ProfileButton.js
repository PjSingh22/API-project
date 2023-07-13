import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useModal } from "../../context/Modal";
import * as sessionActions from '../../store/session';
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import './ProfileButton.css';

function ProfileButton({ user }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/');
    closeMenu();
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if(!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className="user-btn btn" onClick={openMenu}>
      <i className="fas fa-bars"></i>
      <i className="fa-solid fa-user"></i>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        { user ? (
          <>
            <li>Hello, {user.username}</li>
            <li className="user-email">{user.email}</li>
            <li><button onClick={closeMenu} className="pb__manage-spots"><Link className="dropdown-link" style={{textDecoration: 'none'}} to='/user/spots'>Manage Spots</Link></button></li>
            <li><button onClick={closeMenu} className="pb__manage-spots"><Link className="dropdown-link" style={{textDecoration: 'none'}} to='/user/reservations'>Manage Reservations</Link></button></li>
            <li>
              <button className="logout-btn btn" onClick={logout}>Log Out</button>
            </li>
          </>
          ) : (
          <>
            <li>
              <OpenModalButton
                className="open-modal"
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
              />
            </li>
            <li>
              <OpenModalButton
                className="open-modal"
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
              />
            </li>
          </>
          )}
      </ul>
    </>
  );
}

export default ProfileButton;
