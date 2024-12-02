import { toast } from 'react-toastify';
import { sendPostJsonRequest, handleResponse } from './resHandler';
import cookie from 'cookie';

export const handleSignUp = async (data, signupCallback) => {
  const response = await sendPostJsonRequest('/api/users', data);
  return handleResponse(response, signupCallback);
};

export const handleLogIn = async (email, password, loginCallback) => {
  const response = await sendPostJsonRequest('/api/login', { email, password }, {}, { credentials: 'include' });
  return handleResponse(response, loginCallback);
};

export const handleLogOut = async logoutCallBack => {
  const response = await sendPostJsonRequest('/api/logout');
  return handleResponse(response, logoutCallBack);
};

export const getFieldFromCookie = field => {
  const cookies = cookie.parse(document.cookie || '');
  return cookies[field];
};
