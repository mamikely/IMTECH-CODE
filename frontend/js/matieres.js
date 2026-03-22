// Gestion des Matieres
const API_MATIERE = `${window.API_BASE_URL}/matieres`;

let matieres = [];
let currentMatiere = null;

document.getElementById('currentDate').textContent = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

document.addEventListener('DOMContentLoaded', function () {
    loadMatieres();
    
    
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = matieres.filter(item => {
            (item.nom && item.nom.toLowerCase().includes(searchTerm)) || (item.coefficient && item.coefficient.toLowerCase().includes(searchTerm))
        });
        renderMatieres(filtered);
    });
});

async function loadMatieres() {
    try {
        showLoading();
        const response = await fetch(`${API_MATIERE}/getAll`, {
            method: 'GET',
            headers: getAuthHeadersUser()
        });
        const data = await response.json();
        if (data.status === 'success') {
            matieres = data.message || [];
            renderMatieres(matieres);
        } else {
            showMessage('Erreur lors du chargement des matieres', 'danger');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur', 'danger');
    } finally {
        hideLoading();
    }
}

function renderMatieres(data) {
    const tbody = document.getElementById('matieresTableBody');
    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-book"></i>
                        <h3>Aucun(e) matiere trouvé(e)</h3>
                        <p>Commencez par ajouter un(e) nouveau(elle) matiere</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    tbody.innerHTML = data.map(item => `
        <tr>
                        <td>${item.nom || '-'}</td>
            <td>${item.coefficient || '-'}</td>
            <td>${item.classe ? item.classe.nom : '-'}</td>
            <td>${item.description || '-'}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-warning" onclick="openEditModal('${item.id}')" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteMatiere('${item.id}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddModal() {
    currentMatiere = null;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus"></i> Nouvelle Matière';
    resetForm('matieresForm');
    
    openModal('matieresModal');
}

function openEditModal(id) {
    currentMatiere = matieres.find(item => item.id === id);
    if (!currentMatiere) return;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Modifier Matiere';
    fillForm('matieresForm', currentMatiere);
    
    openModal('matieresModal');
}

async function saveMatiere() {
    if (!validateForm('matieresForm')) return;
    const formData = getFormData('matieresForm');
    
    try {
        showLoading();
        let url, method;
        if (currentMatiere) {
            url = `${API_MATIERE}/update`;
            method = 'PUT';
            formData.id = currentMatiere.id;
        } else {
            url = `${API_MATIERE}/save`;
            method = 'POST';
        }
        const response = await fetch(url, {
            method: method,
            headers: getAuthHeadersUser(),
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.status === 'success') {
            showMessage(currentMatiere ? 'Matiere modifié(e) avec succès' : 'Matiere ajouté(e) avec succès', 'success');
            closeModal('matieresModal');
            loadMatieres();
        } else if (data.status === 'exist') {
            showMessage('Cet(te) matiere existe déjà', 'warning');
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

async function deleteMatiere(id) {
    const confirmed = await confirmDelete('Êtes-vous sûr de vouloir supprimer cet(te) matiere ?');
    if (!confirmed) return;
    try {
        showLoading();
        const response = await fetch(`${API_MATIERE}/delete/${id}`, {
            method: 'DELETE',
            headers: getAuthHeadersUser()
        });
        const data = await response.json();
        if (data.status === 'success') {
            showMessage('Matiere supprimé(e) avec succès', 'success');
            loadMatieres();
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

function exportMatiereCSV() {
    if (matieres.length === 0) {
        showMessage('Aucune donnée à exporter', 'warning');
        return;
    }
    const exportData = matieres.map(item => ({
                'Nom': item.nom || '',
        'Coefficient': item.coefficient || '',
        'Classe': item.classe ? item.classe.nom : '',
        'Description': item.description || ''
    }));
    exportToCSV(exportData, 'matieres');
}
