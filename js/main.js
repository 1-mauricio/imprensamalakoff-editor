document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        toggleView(); // Se o token existir, exibe o editor
    } else {
        document.getElementById('loginContainer').style.display = 'block';
    }
});