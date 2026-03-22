// Gestion des Trimestres
const API_TRIMESTRE = `${window.API_BASE_URL}/trimestres`;

let trimestres = [];
let currentTrimestre = null;

document.getElementById('currentDate').textContent = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

document.addEventListener('DOMContentLoaded', function () {
    loadTrimestres();
    
    
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = trimestres.filter(item => {
            (item.libelle && item.libelle.toLowerCase().includes(searchTerm))
        });
        renderTrimestres(filtered);
    });
});

async function loadTrimestres() {
    try {
        showLoading();
        const response = await fetch(`${API_TRIMESTRE}/getAll`, getFetchOptions('GET'));
        const data = await response.json();
        if (data.status === 'success') {
            trimestres = data.message || [];
            renderTrimestres(trimestres);
        } else {
            showMessage('Erreur lors du chargement des trimestres', 'danger');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur', 'danger');
    } finally {
        hideLoading();
    }
}

function renderTrimestres(data) {
    const tbody = document.getElementById('trimestresTableBody');
    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-calendar-week"></i>
                        <h3>Aucun(e) trimestre trouvé(e)</h3>
                        <p>Commencez par ajouter un(e) nouveau(elle) trimestre</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    tbody.innerHTML = data.map(item => `
        <tr>
                        <td>${item.libelle || '-'}</td>
            <td>${formatDate(item.dateDebut)}</td>
            <td>${formatDate(item.dateFin)}</td>
            <td>${item.anneeScolaire ? item.anneeScolaire.anneeScolaire : '-'}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-warning" onclick="openEditModal('${item.id}')" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTrimestre('${item.id}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddModal() {
    currentTrimestre = null;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus"></i> Nouveau Trimestre';
    resetForm('trimestresForm');
    
    openModal('trimestresModal');
}

function openEditModal(id) {
    currentTrimestre = trimestres.find(item => item.id === id);
    if (!currentTrimestre) return;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Modifier Trimestre';
    fillForm('trimestresForm', currentTrimestre);
    
    openModal('trimestresModal');
}

async function saveTrimestre() {
    if (!validateForm('trimestresForm')) return;
    const formData = getFormData('trimestresForm');
    
    try {
        showLoading();
        let url, method;
        if (currentTrimestre) {
            url = `${API_TRIMESTRE}/update`;
            method = 'PUT';
            formData.id = currentTrimestre.id;
        } else {
            url = `${API_TRIMESTRE}/save`;
            method = 'POST';
        }
        const response = await fetch(url, getFetchOptions(method, formData));
        const data = await response.json();
        if (data.status === 'success') {
            showMessage(currentTrimestre ? 'Trimestre modifié(e) avec succès' : 'Trimestre ajouté(e) avec succès', 'success');
            closeModal('trimestresModal');
            loadTrimestres();
        } else if (data.status === 'exist') {
            showMessage('Cet(te) trimestre existe déjà', 'warning');
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

async function deleteTrimestre(id) {
    const confirmed = await confirmDelete('Êtes-vous sûr de vouloir supprimer cet(te) trimestre ?');
    if (!confirmed) return;
    try {
        showLoading();
        const response = await fetch(`${API_TRIMESTRE}/delete/${id}`, getFetchOptions('DELETE'));
        const data = await response.json();
        if (data.status === 'success') {
            showMessage('Trimestre supprimé(e) avec succès', 'success');
            loadTrimestres();
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

function exportTrimestreCSV() {
    if (trimestres.length === 0) {
        showMessage('Aucune donnée à exporter', 'warning');
        return;
    }
    const exportData = trimestres.map(item => ({
                'Libellé': item.libelle || '',
        'Date Début': formatDate(item.dateDebut),
        'Date Fin': formatDate(item.dateFin),
        'Année Scolaire': item.anneeScolaire ? item.anneeScolaire.anneeScolaire : ''
    }));
    exportToCSV(exportData, 'trimestres');
}
