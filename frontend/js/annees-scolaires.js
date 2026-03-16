// Gestion des AnneeScolaires
const API_ANNEESCOLAIRE = `${window.API_BASE_URL}/anneescolaire`;

let anneeScolaires = [];
let currentAnneeScolaire = null;

document.getElementById('currentDate').textContent = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

document.addEventListener('DOMContentLoaded', function () {
    loadAnneeScolaires();
    
    
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = anneeScolaires.filter(item => {
            return (item.anneeScolaire && item.anneeScolaire.toLowerCase().includes(searchTerm));
        });
        renderAnneeScolaires(filtered);
    });
});

async function loadAnneeScolaires() {
    try {
        showLoading();
        const response = await fetch(`${API_ANNEESCOLAIRE}/getAll`, getFetchOptions('GET'));
        const data = await response.json();
        if (data.status === 'success') {
            anneeScolaires = data.message || [];
            renderAnneeScolaires(anneeScolaires);
        } else {
            showMessage('Erreur lors du chargement des anneescolaires', 'danger');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur', 'danger');
    } finally {
        hideLoading();
    }
}

function renderAnneeScolaires(data) {
    const tbody = document.getElementById('anneescolaireTableBody');
    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-calendar-alt"></i>
                        <h3>Aucun(e) anneescolaire trouvé(e)</h3>
                        <p>Commencez par ajouter un(e) nouveau(elle) anneescolaire</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    tbody.innerHTML = data.map(item => `
        <tr>
                        <td>${item.anneeScolaire || '-'}</td>
            <td>${item.inscriptions || 0}</td>
            <td>${item.tarifs || 0}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-warning" onclick="openEditModal('${item.id}')" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAnneeScolaire('${item.id}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddModal() {
    currentAnneeScolaire = null;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus"></i> Nouvelle Année';
    resetForm('anneescolaireForm');
    
    openModal('anneescolaireModal');
}

function openEditModal(id) {
    currentAnneeScolaire = anneeScolaires.find(item => item.id === id);
    if (!currentAnneeScolaire) return;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Modifier AnneeScolaire';
    fillForm('anneescolaireForm', currentAnneeScolaire);
    
    openModal('anneescolaireModal');
}

async function saveAnneeScolaire() {
    if (!validateForm('anneescolaireForm')) return;
    const formData = getFormData('anneescolaireForm');
    
    try {
        showLoading();
        let url, method;
        if (currentAnneeScolaire) {
            url = `${API_ANNEESCOLAIRE}/update`;
            method = 'PUT';
            formData.id = currentAnneeScolaire.id;
        } else {
            url = `${API_ANNEESCOLAIRE}/save`;
            method = 'POST';
        }
        const response = await fetch(url, getFetchOptions(method, formData));
        const data = await response.json();
        if (data.status === 'success') {
            showMessage(currentAnneeScolaire ? 'AnneeScolaire modifié(e) avec succès' : 'AnneeScolaire ajouté(e) avec succès', 'success');
            closeModal('anneescolaireModal');
            loadAnneeScolaires();
        } else if (data.status === 'exist') {
            showMessage('Cet(te) anneescolaire existe déjà', 'warning');
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

async function deleteAnneeScolaire(id) {
    const confirmed = await confirmDelete('Êtes-vous sûr de vouloir supprimer cet(te) anneescolaire ?');
    if (!confirmed) return;
    try {
        showLoading();
        const response = await fetch(`${API_ANNEESCOLAIRE}/delete/${id}`, getFetchOptions('DELETE'));
        const data = await response.json();
        if (data.status === 'success') {
            showMessage('AnneeScolaire supprimé(e) avec succès', 'success');
            loadAnneeScolaires();
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

function exportAnneeScolaireCSV() {
    if (anneeScolaires.length === 0) {
        showMessage('Aucune donnée à exporter', 'warning');
        return;
    }
    const exportData = anneeScolaires.map(item => ({
                'Année Scolaire': item.anneeScolaire || '',
        "Nombre d'Inscriptions": item.inscriptions || '',
        'Nombre de Tarifs': item.tarifs || ''
    }));
    exportToCSV(exportData, 'anneeScolaires');
}
