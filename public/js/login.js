/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
      withCredentials: true,
    });
    const token = res.data.token;
    console.log(res);
    if (res.status === 200) {
      showAlert('success', 'Logged in successfully!');
      localStorage.setItem('jwt', token);
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout',
      withCredentials: true,
    });
    if (res.status === 200) {
      localStorage.removeItem('jwt');
      location.reload(true);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
