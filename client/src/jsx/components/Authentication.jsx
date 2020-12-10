import jwtDecode from 'jwt-decode';

function authenticated(cookie) {
  if (cookie) {
    const expiration = jwtDecode(cookie).exp;
    return expiration > Math.round(Date.now() / 1000);
  }
  return false;
}

function getUserId(cookie) {
  if (cookie) {
    const token = jwtDecode(cookie);
    if (token.exp > Math.round(Date.now() / 1000)) {
      return token.id;
    }
  }
  return null;
}

function getUserName(cookie) {
  if (cookie) {
    const token = jwtDecode(cookie);
    if (token.exp > Math.round(Date.now() / 1000)) {
      return token.username;
    }
  }
  return null;
}

export { authenticated, getUserId, getUserName };
