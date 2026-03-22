// Gestion des Notes
const API_NOTE = `${window.API_BASE_URL}/notes`;

let notes = [];
let currentNote = null;

document.getElementById('currentDate').textContent = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

document.addEventListener('DOMContentLoaded', function () {
    loadNotes();
    
    
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = notes.filter(item => {
            true
        });
        renderNotes(filtered);
    });
});

async function loadNotes() {
    try {
        showLoading();
        const response = await fetch(`${API_NOTE}/getAll`, getFetchOptions('GET'));
        const data = await response.json();
        if (data.status === 'success') {
            notes = data.message || [];
            renderNotes(notes);
        } else {
            showMessage('Erreur lors du chargement des notes', 'danger');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur', 'danger');
    } finally {
        hideLoading();
    }
}

function renderNotes(data) {
    const tbody = document.getElementById('notesTableBody');
    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-star"></i>
                        <h3>Aucun(e) note trouvé(e)</h3>
                        <p>Commencez par ajouter un(e) nouveau(elle) note</p>
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
            <td>${item.examen ? item.examen.libelle : '-'}</td>
            <td>${item.valeur || '-'}</td>
            <td>${item.appreciation || '-'}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-warning" onclick="openEditModal('${item.id}')" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteNote('${item.id}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddModal() {
    currentNote = null;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus"></i> Nouvelle Note';
    resetForm('notesForm');
    
    openModal('notesModal');
}

function openEditModal(id) {
    currentNote = notes.find(item => item.id === id);
    if (!currentNote) return;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Modifier Note';
    fillForm('notesForm', currentNote);
    
    openModal('notesModal');
}

async function saveNote() {
    if (!validateForm('notesForm')) return;
    const formData = getFormData('notesForm');
    
    try {
        showLoading();
        let url, method;
        if (currentNote) {
            url = `${API_NOTE}/update`;
            method = 'PUT';
            formData.id = currentNote.id;
        } else {
            url = `${API_NOTE}/save`;
            method = 'POST';
        }
        const response = await fetch(url, getFetchOptions(method, formData));
        const data = await response.json();
        if (data.status === 'success') {
            showMessage(currentNote ? 'Note modifié(e) avec succès' : 'Note ajouté(e) avec succès', 'success');
            closeModal('notesModal');
            loadNotes();
        } else if (data.status === 'exist') {
            showMessage('Cet(te) note existe déjà', 'warning');
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

async function deleteNote(id) {
    const confirmed = await confirmDelete('Êtes-vous sûr de vouloir supprimer cet(te) note ?');
    if (!confirmed) return;
    try {
        showLoading();
        const response = await fetch(`${API_NOTE}/delete/${id}`, getFetchOptions('DELETE'));
        const data = await response.json();
        if (data.status === 'success') {
            showMessage('Note supprimé(e) avec succès', 'success');
            loadNotes();
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

function exportNoteCSV() {
    if (notes.length === 0) {
        showMessage('Aucune donnée à exporter', 'warning');
        return;
    }
    const exportData = notes.map(item => ({
                'Élève': item.eleve ? item.eleve.nom : '',
        'Matière': item.matiere ? item.matiere.nom : '',
        'Examen': item.examen ? item.examen.libelle : '',
        'Valeur': item.valeur || '',
        'Appréciation': item.appreciation || ''
    }));
    exportToCSV(exportData, 'notes');
}
