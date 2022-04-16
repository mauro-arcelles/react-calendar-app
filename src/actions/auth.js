import Swal from 'sweetalert2';
import { fetchConToken, fetchSinToken } from '../helpers/fetch';
import { types } from '../types/types';
import { eventLogoutCleaner } from './events';

export const startLogin = (email, password) => {
  return async (dispatch) => {
    const resp = await fetchSinToken('auth', { email, password }, 'POST');
    const body = await resp.json();

    if (body.ok) {
      localStorage.setItem('token', body.token);
      localStorage.setItem('token-init-date', new Date().getTime());

      dispatch(login({
        uid: body.uid,
        name: body.name,
      }));

    } else {
      Swal.fire('Error', body.msg, 'error');
    }
  };
};

export const startRegister = (email, password, name) => {
  return async (dispatch) => {
    const resp = await fetchSinToken('auth/new', { email, password, name }, 'POST');
    const body = await resp.json();

    if (body.ok) {
      localStorage.setItem('token', body.token);
      localStorage.setItem('token-init-date', new Date().getTime());

      dispatch(login({
        uid: body.uid,
        name: body.name,
      }));

      Swal.fire('Registro', 'Usuario registrado correctamente', 'success');
    } else {
      Swal.fire('Error', body.msg, 'error');
    }
  };
};

export const startChecking = () => {
  return async (dispatch) => {
    const resp = await fetchConToken('auth/renew', {}, 'POST');
    const body = await resp.json();

    if (body.ok) {
      localStorage.setItem('token', body.token);
      localStorage.setItem('token-init-date', new Date().getTime());

      dispatch(login({
        uid: body.uid,
        name: body.name,
      }));

    } else {
      dispatch(checkingFinished());

    }
  };
};

export const startLogout = () => {
  return (dispatch) => {
    localStorage.removeItem('token');
    localStorage.removeItem('token-init-date');
    dispatch(logout());
    dispatch(eventLogoutCleaner());
  }
};

const checkingFinished = () => {
  return {
    type: types.authCheckingFinished
  };
};

const login = (user) => {
  return {
    type: types.authLogin,
    payload: user,
  };
};

const logout = () => {
  return {
    type: types.authLogout,
  };
};