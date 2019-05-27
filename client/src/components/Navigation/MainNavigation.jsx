import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth';
import './MainNavigation.css';

const MainNavigation = props => {
  return (
    <AuthContext.Consumer>
      {ctx => {
        return (
          <header className='main-navigation'>
            <div className='main-navigation__logo'>
              <h1>BookingEvents</h1>
            </div>
            <nav className='main-navigation__items'>
              <ul>
                {!ctx.token && (
                  <li>
                    <NavLink to='/auth'>Authenticate</NavLink>
                  </li>
                )}

                <li>
                  <NavLink to='/bookings'>Bookings</NavLink>
                </li>
                {ctx.token && (
                  <React.Fragment>
                    <li>
                      <NavLink to='/events'>Events</NavLink>
                    </li>
                    <li>
                      <button onClick={ctx.logout}>Logout</button>
                    </li>
                  </React.Fragment>
                )}
              </ul>
            </nav>
          </header>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default MainNavigation;
