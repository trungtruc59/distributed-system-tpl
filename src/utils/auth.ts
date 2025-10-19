const TOKEN_KEY = 'token';

const isLogin = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};


const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};
const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem('getRefreshToken', refreshToken);
};
const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('getRefreshToken');
};

export { isLogin, getToken, setToken, setRefreshToken, clearToken };
