import React from 'react';
import { NavLink, Link } from 'react-router-dom';
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
      <li className='external-links'>
        <a href='https://wellfound.com/u/prabhjot-singh-71' target='_blank' rel='noreferrer'>
          <i className="fab fa-angellist fa-lg"></i>
        </a>
        <a href='https://www.linkedin.com/in/prabhjot-singh-software-developer/' target='_blank' rel='noreferrer'>
          <i className="fab fa-linkedin-in fa-lg"></i>
        </a>
        <a href='https://github.com/PjSingh22' target='_blank' rel='noreferrer'>
          <i className="fab fa-github fa-lg"></i>
        </a>
        <a href='https://pjsingh22.github.io/portfolio-2023/' target='_blank' rel='noreferrer'>
          <i className="fas fa-folder fa-lg"></i>
        </a>
      </li>
      {isLoaded && (
        <li className='nav__right-side'>
         {sessionUser ? <Link to="/user/spots/create"><button className='nav__create-spot'>Create a New Spot</button></Link> : null}
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
