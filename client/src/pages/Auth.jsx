import React, { Component } from 'react';

import './Auth.css';
import AuthContext from '../context/auth';

class Auth extends Component {
  constructor(props) {
    super(props);

    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  static contextType = AuthContext;

  state = { isLogin: true };

  switchMode = () => {
    this.setState(prevState => {
      return {
        isLogin: !prevState.isLogin
      };
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || email.trim().length === 0) {
      return;
    }

    let req = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    if (!this.state.isLogin) {
      req = {
        query: `
          mutation {
            createUser(user: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `
      };
    }

    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body: JSON.stringify(req),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('failed');
        }
        return res.json();
      })
      .then(data => {
        if (data.data.login.token) {
          this.context.login(
            data.data.login.token,
            data.data.login.userId,
            data.data.login.tokenExpiration
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className='auth-form'>
        <div className='form-control'>
          <label htmlFor='email'>E-mail</label>
          <input type='email' id='email' ref={this.emailEl} />
        </div>
        <div className='form-control'>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' ref={this.passwordEl} />
        </div>
        <div className='form-actions'>
          <button>Submit</button>
          <button type='button' onClick={this.switchMode}>
            Switch to {this.state.isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </form>
    );
  }
}

export default Auth;
