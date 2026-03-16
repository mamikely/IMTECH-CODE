// Gestion des Examens
const API_EXAMEN = `${window.API_BASE_URL}/examens`;

let examens = [];
let currentExamen = null;

document.getElementById('currentDate').textContent = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

document.addEventListener('DOMContentLoaded', function () {
    loadExamens();
    
    
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = examens.filter(item => {
            (item.libelle && item.libelle.toLowerCase().includes(searchTerm))
        });
        renderExamens(filtered);
    });
});

async function loadExamens() {
    try {
        showLoading();
        const response = await fetch(`${API_EXAMEN}/getAll`, getFetchOptions('GET'));
        const data = await response.json();
        if (data.status === 'success') {
            examens = data.message || [];
            renderExamens(examens);
        } else {
            showMessage('Erreur lors du chargement des examens', 'danger');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur', 'danger');
    } finally {
        hideLoading();
    }
}

function renderExamens(data) {
    const tbody = document.getElementById('examensTableBody');
    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-file-alt"></i>
                        <h3>Aucun(e) examen trouvé(e)</h3>
                        <p>Commencez par ajouter un(e) nouveau(elle) examen</p>
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
            <td>${item.trimestre ? item.trimestre.libelle : '-'}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-warning" onclick="openEditModal('${item.id}')" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteExamen('${item.id}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddModal() {
    currentExamen = null;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus"></i> Nouvel Examen';
    resetForm('examensForm');
    
    openModal('examensModal');
}

function openEditModal(id) {
    currentExamen = examens.find(item => item.id === id);
    if (!currentExamen) return;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Modifier Examen';
    fillForm('examensForm', currentExamen);
    
    openModal('examensModal');
}

async function saveExamen() {
    if (!validateForm('examensForm')) return;
    const formData = getFormData('examensForm');
    
    try {
        showLoading();
        let url, method;
        if (currentExamen) {
            url = `${API_EXAMEN}/update`;
            method = 'PUT';
            formData.id = currentExamen.id;
        } else {
            url = `${API_EXAMEN}/save`;
            method = 'POST';
        }
        const response = await fetch(url, getFetchOptions(method, formData));
        const data = await response.json();
        if (data.status === 'success') {
            showMessage(currentExamen ? 'Examen modifié(e) avec succès' : 'Examen ajouté(e) avec succès', 'success');
            closeModal('examensModal');
            loadExamens();
        } else if (data.status === 'exist') {
            showMessage('Cet(te) examen existe déjà', 'warning');
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

async function deleteExamen(id) {
    const confirmed = await confirmDelete('Êtes-vous sûr de vouloir supprimer cet(te) examen ?');
    if (!confirmed) return;
    try {
        showLoading();
        const response = await fetch(`${API_EXAMEN}/delete/${id}`, getFetchOptions('DELETE'));
        const data = await response.json();
        if (data.status === 'success') {
            showMessage('Examen supprimé(e) avec succès', 'success');
            loadExamens();
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

function exportExamenCSV() {
    if (examens.length === 0) {
        showMessage('Aucune donnée à exporter', 'warning');
        return;
    }
    const exportData = examens.map(item => ({
                'Libellé': item.libelle || '',
        'Date Début': formatDate(item.dateDebut),
        'Date Fin': formatDate(item.dateFin),
        'Trimestre': item.trimestre ? item.trimestre.libelle : ''
    }));
    exportToCSV(exportData, 'examens');
}
