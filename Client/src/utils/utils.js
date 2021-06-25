function logout() {
    localStorage.removeItem('user');
};

export { logout }