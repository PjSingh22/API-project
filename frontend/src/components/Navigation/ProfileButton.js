import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import './ProfileButton.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
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
            {/* <li>{user.firstName} {user.lastName}</li> */}
            <li>{user.email}</li>
            <li><button className="pb__manage-spots"><Link style={{textDecoration: 'none', color: 'black'}} to='/user/spots'>Manage Spots</Link></button></li> {/*TODO: place a link inside li */}
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
