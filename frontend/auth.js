// Configuration de l'API (à adapter selon votre configuration backend)

const AUTH_ENDPOINT = `${window.API_BASE_URL}/auth`;

// Éléments du DOM
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const errorMessage = document.getElementById('error-message');
const loginButton = document.querySelector('.login-button');

// Afficher/masquer le mot de passe
togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

// Gestion de la soumission du formulaire
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Réinitialiser les messages d'erreur
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
    
    // Récupérer les valeurs du formulaire
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const rememberMe = document.querySelector('input[name="remember"]').checked;
    
    // Validation des champs
    if (!username || !password) {
        showError('Veuillez remplir tous les champs.');
        return;
    }
    
    // Désactiver le bouton et afficher l'animation de chargement
    loginButton.disabled = true;
    loginButton.classList.add('button-loading');
    
    try {
        // Appel à l'API d'authentification
        const response = await fetch(`${AUTH_ENDPOINT}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-TenantID': 'default_db_gestionecole'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(data.message || 'Échec de l\'authentification');
            throw new Error(data.message || 'Échec de l\'authentification');
        }
        
        if(data.status === 'success'){
                 // Stocker le token JWT
            localStorage.setItem('authToken', data.Token);
            localStorage.setItem('tenants', JSON.stringify(data.tenants));
            localStorage.setItem('XTenantID', data.XTenantID);
            localStorage.setItem('role', data.role);
            localStorage.setItem('idtenant', data.tenants.id);
            
            // Rediriger en fonction du rôle
             window.getroute(data.role);
        }else{
            showError(data.message || 'Échec de l\'authentification');
        }
        
            
     
        
    } catch (error) {
        console.error('Erreur lors de l\'authentification:', error);
        showError(error.message || 'Une erreur est survenue lors de la connexion.');
    } finally {
        // Réactiver le bouton et masquer l'animation de chargement
        loginButton.disabled = false;
        loginButton.classList.remove('button-loading');
    }
});

// Fonction pour afficher les messages d'erreur
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    
    // Masquer le message après 5 secondes
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
}
