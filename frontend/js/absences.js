// Gestion des Absences
const API_ABSENCE = `${window.API_BASE_URL}/absences`;

let absences = [];
let currentAbsence = null;

document.getElementById('currentDate').textContent = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

document.addEventListener('DOMContentLoaded', function () {
    loadAbsences();
    
    
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = absences.filter(item => {
            true
        });
        renderAbsences(filtered);
    });
});

async function loadAbsences() {
    try {
        showLoading();
        const response = await fetch(`${API_ABSENCE}/getAll`, getFetchOptions('GET'));
        const data = await response.json();
        if (data.status === 'success') {
            absences = data.message || [];
            renderAbsences(absences);
        } else {
            showMessage('Erreur lors du chargement des absences', 'danger');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur', 'danger');
    } finally {
        hideLoading();
    }
}

function renderAbsences(data) {
    const tbody = document.getElementById('absencesTableBody');
    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-user-clock"></i>
                        <h3>Aucun(e) absence trouvé(e)</h3>
                        <p>Commencez par ajouter un(e) nouveau(elle) absence</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    tbody.innerHTML = data.map(item => `
        <tr>
                        <td>${item.eleve ? item.eleve.nom : '-'}</td>
            <td>${item.matiere ? item.matiere.nom : '-'}</td>
            <td>${formatDate(item.date)}</td>
            <td>${item.type || '-'}</td>
            <td>${item.justifiee ? '<span class="badge badge-success">Oui</span>' : '<span class="badge badge-danger">Non</span>'}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-warning" onclick="openEditModal('${item.id}')" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAbsence('${item.id}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddModal() {
    currentAbsence = null;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus"></i> Nouvelle Absence';
    resetForm('absencesForm');
    
    openModal('absencesModal');
}

function openEditModal(id) {
    currentAbsence = absences.find(item => item.id === id);
    if (!currentAbsence) return;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Modifier Absence';
    fillForm('absencesForm', currentAbsence);
    
    openModal('absencesModal');
}

async function saveAbsence() {
    if (!validateForm('absencesForm')) return;
    const formData = getFormData('absencesForm');
    
    try {
        showLoading();
        let url, method;
        if (currentAbsence) {
            url = `${API_ABSENCE}/update`;
            method = 'PUT';
            formData.id = currentAbsence.id;
        } else {
            url = `${API_ABSENCE}/save`;
            method = 'POST';
        }
        const response = await fetch(url, getFetchOptions(method, formData));
        const data = await response.json();
        if (data.status === 'success') {
            showMessage(currentAbsence ? 'Absence modifié(e) avec succès' : 'Absence ajouté(e) avec succès', 'success');
            closeModal('absencesModal');
            loadAbsences();
        } else if (data.status === 'exist') {
            showMessage('Cet(te) absence existe déjà', 'warning');
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

async function deleteAbsence(id) {
    const confirmed = await confirmDelete('Êtes-vous sûr de vouloir supprimer cet(te) absence ?');
    if (!confirmed) return;
    try {
        showLoading();
        const response = await fetch(`${API_ABSENCE}/delete/${id}`, getFetchOptions('DELETE'));
        const data = await response.json();
        if (data.status === 'success') {
            showMessage('Absence supprimé(e) avec succès', 'success');
            loadAbsences();
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

function exportAbsenceCSV() {
    if (absences.length === 0) {
        showMessage('Aucune donnée à exporter', 'warning');
        return;
    }
    const exportData = absences.map(item => ({
                'Élève': item.eleve ? item.eleve.nom : '',
        'Matière': item.matiere ? item.matiere.nom : '',
        'Date': formatDate(item.date),
        'Type': item.type || '',
        'Justifiée': item.justifiee || ''
    }));
    exportToCSV(exportData, 'absences');
}
