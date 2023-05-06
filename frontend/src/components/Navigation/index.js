import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);


  return (
    <ul id='nav-links'>
      <li>
        <NavLink style={{display: 'flex', alignItems: 'center', gap: '5px'  ,textDecoration: 'none', fontFamily: "Poppins", color: 'rgb(255,56,92)', fontSize: "30px"}} exact to="/">
          <i className="fas fa-suitcase-rolling" style={{color: "#ff385c"}}></i>
            <h1 style={{fontSize: '30px'}}>Tripbnb</h1>
          </NavLink>
      </li>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
