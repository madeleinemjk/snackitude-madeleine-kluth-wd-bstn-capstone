const TOKEN_NAME = "user_token";

export function getToken() {
    return localStorage.getItem(TOKEN_NAME);
}

export function isLoggedIn() {
    const token = getToken();
    return token !== null;
}

export function clearToken() {
    localStorage.removeItem(TOKEN_NAME);
}

export function setToken(token) {
    return localStorage.setItem(TOKEN_NAME, token);
}

const exportedAuthFunctions = { TOKEN_NAME, getToken, isLoggedIn, clearToken, setToken };

export default exportedAuthFunctions;