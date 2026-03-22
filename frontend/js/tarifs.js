// Gestion des Tarifs
const API_TARIF = `${window.API_BASE_URL}/tarifs`;

let tarifs = [];
let currentTarif = null;

document.getElementById('currentDate').textContent = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

document.addEventListener('DOMContentLoaded', function () {
    loadTarifs();
    
    
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = tarifs.filter(item => {
            (item.type && item.type.toLowerCase().includes(searchTerm))
        });
        renderTarifs(filtered);
    });
});

async function loadTarifs() {
    try {
        showLoading();
        const response = await fetch(`${API_TARIF}/getAll`, getFetchOptions('GET'));
        const data = await response.json();
        if (data.status === 'success') {
            tarifs = data.message || [];
            renderTarifs(tarifs);
        } else {
            showMessage('Erreur lors du chargement des tarifs', 'danger');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur', 'danger');
    } finally {
        hideLoading();
    }
}

function renderTarifs(data) {
    const tbody = document.getElementById('tarifsTableBody');
    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-tag"></i>
                        <h3>Aucun(e) tarif trouvé(e)</h3>
                        <p>Commencez par ajouter un(e) nouveau(elle) tarif</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    tbody.innerHTML = data.map(item => `
        <tr>
                        <td>${item.type || '-'}</td>
            <td>${item.montant || '-'}</td>
            <td>${item.classe ? item.classe.nom : '-'}</td>
            <td>${item.anneeScolaire ? item.anneeScolaire.anneeScolaire : '-'}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-warning" onclick="openEditModal('${item.id}')" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTarif('${item.id}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddModal() {
    currentTarif = null;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus"></i> Nouveau Tarif';
    resetForm('tarifsForm');
    
    openModal('tarifsModal');
}

function openEditModal(id) {
    currentTarif = tarifs.find(item => item.id === id);
    if (!currentTarif) return;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Modifier Tarif';
    fillForm('tarifsForm', currentTarif);
    
    openModal('tarifsModal');
}

async function saveTarif() {
    if (!validateForm('tarifsForm')) return;
    const formData = getFormData('tarifsForm');
    
    try {
        showLoading();
        let url, method;
        if (currentTarif) {
            url = `${API_TARIF}/update`;
            method = 'PUT';
            formData.id = currentTarif.id;
        } else {
            url = `${API_TARIF}/save`;
            method = 'POST';
        }
        const response = await fetch(url, getFetchOptions(method, formData));
        const data = await response.json();
        if (data.status === 'success') {
            showMessage(currentTarif ? 'Tarif modifié(e) avec succès' : 'Tarif ajouté(e) avec succès', 'success');
            closeModal('tarifsModal');
            loadTarifs();
        } else if (data.status === 'exist') {
            showMessage('Cet(te) tarif existe déjà', 'warning');
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

async function deleteTarif(id) {
    const confirmed = await confirmDelete('Êtes-vous sûr de vouloir supprimer cet(te) tarif ?');
    if (!confirmed) return;
    try {
        showLoading();
        const response = await fetch(`${API_TARIF}/delete/${id}`, getFetchOptions('DELETE'));
        const data = await response.json();
        if (data.status === 'success') {
            showMessage('Tarif supprimé(e) avec succès', 'success');
            loadTarifs();
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

function exportTarifCSV() {
    if (tarifs.length === 0) {
        showMessage('Aucune donnée à exporter', 'warning');
        return;
    }
    const exportData = tarifs.map(item => ({
                'Type': item.type || '',
        'Montant': item.montant || '',
        'Classe': item.classe ? item.classe.nom : '',
        'Année Scolaire': item.anneeScolaire ? item.anneeScolaire.anneeScolaire : ''
    }));
    exportToCSV(exportData, 'tarifs');
}
