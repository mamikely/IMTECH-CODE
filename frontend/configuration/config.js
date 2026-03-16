// Configuration de base de l'API
const API_BASE_URL = 'http://localhost:8080/api';
window.API_BASE_URL = API_BASE_URL;



// Fonction de déconnexion
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tenants');
    localStorage.removeItem('XTenantID');
    localStorage.removeItem('role');
    window.location.href = '../index.html';
}

// Fonction utilitaire pour obtenir les en-têtes d'authentification
function getAuthHeadersAdmin() {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-TenantID': 'default_db_gestionecole',
        'Authorization': `Bearer ${token}`
    };
}
function getAuthHeadersUser() {
    const token = localStorage.getItem('authToken');
     const tenanid = localStorage.getItem('XTenantID')
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-TenantID': `${tenanid}`,
        'Authorization': `Bearer ${token}`
    };
}
// get aut user  
// function getAuthHeadersUser() {
//     const tokenUser = localStorage.getItem('authToken');
//     return {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         'X-TenantID': XTenantID ,
//         'Authorization': `Bearer ${tokenUser}`
//     };
// }
// Options standards pour fetch avec authentification
function getFetchOptions(method, body = null) {
    const options = {
        method: method,
        headers: getAuthHeadersUser()
    };
    if (body !== null && body !== undefined) {
        options.body = JSON.stringify(body);
    }
    return options;
}
function getFetchOptionsAdmin(method, body = null) {
    const options = {
        method: method,
        headers: getAuthHeadersAdmin()
    };
    if (body !== null && body !== undefined) {
        options.body = JSON.stringify(body);
    }
    return options;
}

// Options standards pour fetch avec authentification puor user 
// function getFetchOptionsUser(method, body = null) {
//     const options = {
//         method: method,
//         headers: getAuthHeadersUser()
//     };
//     if (body !== null && body !== undefined) {
//         options.body = JSON.stringify(body);
//     }
//     return options;
// }

function getroute(role){
    if (role === 'SUPERADMIN') {
        window.location.href = 'superadmin/tenants.html';
    } else if (role === 'ADMIN') {
        window.location.href = 'admin/classes.html';
    }  else if (role === 'PARENT') {
        window.location.href = 'parent/eleves.html';
    } else if (role === 'SECRETAIRE') {
        window.location.href = 'secretaire/eleves.html';
    } else if (role === 'ECONOMAT') {
        window.location.href = 'economat/paiements.html';
    }else {
        window.location.href = '../index.html';
    }
}

function verificationConnecter(){
    document.addEventListener('DOMContentLoaded', function () {
        const token = localStorage.getItem('authToken');
        const role = localStorage.getItem('role');
        if (token) {
            getroute(role);
        }
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('logout')) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    });
}

// Fonction pour vérifier l'authentification
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '../index.html';
        return false;
    }
    return true;
}

// Fonction pour afficher un message
function showMessage(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 15px 20px;
        border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000; animation: slideIn 0.3s ease; max-width: 400px;
    `;
    
    const colors = {
        success: { bg: '#d1fae5', color: '#065f46', border: '#10b981' },
        danger: { bg: '#fee2e2', color: '#991b1b', border: '#ef4444' },
        warning: { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' },
        info: { bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' }
    };
    
    const style = colors[type] || colors.info;
    alertDiv.style.backgroundColor = style.bg;
    alertDiv.style.color = style.color;
    alertDiv.style.borderLeft = `4px solid ${style.border}`;
    
    document.body.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// Export CSV
function exportToCSV(data, filename) {
    if (!data || data.length === 0) {
        showMessage('Aucune donnée à exporter', 'warning');
        return;
    }
    const headers = Object.keys(data[0]);
    let csv = headers.join(',') + '\n';
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            if (value === null || value === undefined) return '';
            const stringValue = String(value);
            return stringValue.includes(',') || stringValue.includes('"') 
                ? `"${stringValue.replace(/"/g, '""')}"` 
                : stringValue;
        });
        csv += values.join(',') + '\n';
    });
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showMessage('Export CSV réussi !', 'success');
}

// Formatage de date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

// Formatage de datetime
function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

// Fonctions utilitaires pour les modals
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Fermer modal en cliquant sur l'overlay
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Fonctions utilitaires pour les formulaires
function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) form.reset();
}

function fillForm(formId, data) {
    const form = document.getElementById(formId);
    if (!form) return;
    Object.keys(data).forEach(key => {
        const element = form.elements[key];
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = data[key];
            } else if (element.type === 'date' && data[key]) {
                const date = new Date(data[key]);
                element.value = date.toISOString().split('T')[0];
            } else {
                element.value = data[key] || '';
            }
        }
    });
}

function getFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return {};
    const formData = {};
    const elements = form.elements;
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.name) {
            if (element.type === 'checkbox') {
                formData[element.name] = element.checked;
            } else if (element.type === 'number') {
                formData[element.name] = element.value ? parseFloat(element.value) : null;
            } else {
                formData[element.name] = element.value || null;
            }
        }
    }
    return formData;
}

function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    if (!isValid) {
        showMessage('Veuillez remplir tous les champs obligatoires', 'warning');
    }
    return isValid;
}

// Loading indicator
function showLoading() {
    let loader = document.getElementById('globalLoader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'globalLoader';
        loader.innerHTML = '<div class="spinner"></div>';
        loader.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex; justify-content: center;
            align-items: center; z-index: 9999;
        `;
        document.body.appendChild(loader);
    }
    loader.style.display = 'flex';
}

function hideLoading() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.style.display = 'none';
}

// Animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3b82f6;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .error { border-color: #ef4444 !important; }
`;
document.head.appendChild(style);

// Exposer les fonctions globalement
window.logout = logout;
window.getAuthHeadersAdmin = getAuthHeadersAdmin;
window.getFetchOptions = getFetchOptions;
window.getroute = getroute;
window.verificationConnecter = verificationConnecter;
window.checkAuth = checkAuth;
window.showMessage = showMessage;
window.exportToCSV = exportToCSV;
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.openModal = openModal;
window.closeModal = closeModal;
window.resetForm = resetForm;
window.fillForm = fillForm;
window.getFormData = getFormData;
window.validateForm = validateForm;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.getFetchOptionsAdmin=getFetchOptionsAdmin;
