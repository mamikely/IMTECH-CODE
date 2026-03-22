// Gestion des Utilisateurs
const tenantId = localStorage.getItem('XTenantID');
console.log('Utilisateur - tenantId courant :', tenantId);
const API_UTILISATEUR = `${window.API_BASE_URL}/users`;

let utilisateurs = [];
let currentUtilisateur = null;

document.getElementById('currentDate').textContent = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

document.addEventListener('DOMContentLoaded', function () {
    checkAuth();
    loadUtilisateurs();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = utilisateurs.filter(u => {
                return (u.username && u.username.toLowerCase().includes(searchTerm)) ||
                       (u.role && u.role.toLowerCase().includes(searchTerm));
            });
            renderUtilisateurs(filtered);
        });
    }
});

async function loadUtilisateurs() {
    try {
        showLoading();
        const response = await fetch(`${API_UTILISATEUR}/getAll/${encodeURIComponent(tenantId)}`, getFetchOptionsAdmin('GET'));
        const data = await response.json();

        // Le backend renvoie directement un tableau d'utilisateurs
        if (response.ok && Array.isArray(data)) {
            utilisateurs = data;
            renderUtilisateurs(utilisateurs);
        } else {
            showMessage('Erreur lors du chargement des utilisateurs', 'danger');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur', 'danger');
    } finally {
        hideLoading();
    }
}

function renderUtilisateurs(data) {
    const tbody = document.getElementById('utilisateursTableBody');
    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-user-cog"></i>
                        <h3>Aucun utilisateur trouvé</h3>
                        <p>Commencez par ajouter un nouvel utilisateur</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    tbody.innerHTML = data.map(u => `
        <tr>
            <td>${u.username || '-'}</td>
            <td>${u.role || '-'}</td>
       
         
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-warning" onclick="openEditModal('${u.id}')" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUtilisateur('${u.id}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddModal() {
    currentUtilisateur = null;
    const titleEl = document.getElementById('modalTitle');
    if (titleEl) {
        titleEl.innerHTML = '<i class="fas fa-user-plus"></i> Nouvel Utilisateur';
    }
    resetForm('utilisateurForm');
    openModal('utilisateurModal');
}

function openEditModal(id) {
    currentUtilisateur = utilisateurs.find(u => u.id === id);
    if (!currentUtilisateur) return;
    const titleEl = document.getElementById('modalTitle');
    if (titleEl) {
        titleEl.innerHTML = '<i class="fas fa-user-edit"></i> Modifier Utilisateur';
    }
    fillForm('utilisateurForm', currentUtilisateur);
    // On ne remplit pas le mot de passe existant pour des raisons de sécurité
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.value = '';
        passwordInput.required = false; // en édition, mot de passe facultatif
    }
    openModal('utilisateurModal');
}

async function saveUtilisateur() {
    if (!validateForm('utilisateurForm')) return;
    const formData = getFormData('utilisateurForm');

    try {
        showLoading();
        // Endpoint de création: POST /users/register/{tenantId}
        const url = `${API_UTILISATEUR}/register/${tenantId}`;
        const method = 'POST';

        const payload = {
            username: formData.username,
            password: formData.password,
            role: formData.role
        };

        const response = await fetch(url, getFetchOptionsAdmin(method, payload));
        

        if (response.ok) {
            showMessage('Utilisateur ajouté avec succès', 'success');
            closeModal('utilisateurModal');
            loadUtilisateurs();
        } else {
            showMessage(data.message || 'Erreur lors de l\'enregistrement', 'danger');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur', 'danger');
    } finally {
        hideLoading();
    }
}

async function deleteUtilisateur(id) {
    const confirmed = await confirmDelete('Êtes-vous sûr de vouloir supprimer cet utilisateur ?');
    if (!confirmed) return;
    try {
        showLoading();
        const response = await fetch(`${API_UTILISATEUR}/delete/${id}`, getFetchOptionsAdmin('DELETE'));
        const data = await response.json();
        if (data.status === 'success') {
            showMessage('Utilisateur supprimé avec succès', 'success');
            loadUtilisateurs();
        } else {
            showMessage(data.message || 'Erreur lors de la suppression', 'danger');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur', 'danger');
    } finally {
        hideLoading();
    }
}
