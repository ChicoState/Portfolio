import jwt_decode from "jwt-decode";

function authenticated(cookie) {
  if (cookie) {
    let expiration = jwt_decode(cookie).exp;
    return expiration > Math.round((Date.now() / 1000));
  }
  return false;
}

function getUserId(cookie) {
  if (cookie) {
    let token = jwt_decode(cookie);
    if (token.exp > Math.round((Date.now() / 1000))) {
      return token.id;
    }
  }
  return null; 
}

function getUserName(cookie) {
  if (cookie) {
    let token = jwt_decode(cookie);
    if (token.exp > Math.round((Date.now() / 1000))) {
      return token.username;
    }
  }
  return null; 
}

/*
function requireAuth(nextState, replace, next) {
  if (!authenticated) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    });
  }
  next();
}
*/

export {
  authenticated,
  getUserId,
  getUserName
}