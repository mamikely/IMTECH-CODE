// Gestion des Inscriptions
const API_INSCRIPTION = `${window.API_BASE_URL}/inscriptions`;
const API_CLASSE = `${window.API_BASE_URL}/classe`;
const API_ANNEESCOLAIRE = `${window.API_BASE_URL}/anneescolaire`;

let inscriptions = [];
let currentInscription = null;

document.getElementById('currentDate').textContent = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

document.addEventListener('DOMContentLoaded', function () {
    loadInscriptions();
    loadClasseOptions();
    loadAnneeScolaireOptions();
    const role = localStorage.getItem('role');
    
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = inscriptions.filter(item => {
            // Filtre simple sur le nom de l'élève, la classe ou l'année scolaire
            const nomEleve = item.eleve && item.eleve.nom ? item.eleve.nom.toLowerCase() : '';
            const classeNom = item.classe && item.classe.nom ? item.classe.nom.toLowerCase() : '';
            const annee = item.anneeScolaire && item.anneeScolaire.anneeScolaire ? item.anneeScolaire.anneeScolaire.toLowerCase() : '';
            return nomEleve.includes(searchTerm) ||
                   classeNom.includes(searchTerm) ||
                   annee.includes(searchTerm) ||
                   (item.type && item.type.toLowerCase().includes(searchTerm));
        });
        renderInscriptions(filtered);
    });
});

async function loadInscriptions() {
    try {
        showLoading();
        const response = await fetch(`${API_INSCRIPTION}/getAll`, getFetchOptions('GET'));
        const data = await response.json();
        // Backend renvoie un objet avec la propriété "resultat" contenant la liste
        if (response.ok && data && Array.isArray(data.resultat)) {
            inscriptions = data.resultat;
            renderInscriptions(inscriptions);
        } else {
            showMessage('Erreur lors du chargement des inscriptions', 'danger');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur', 'danger');
    } finally {
        hideLoading();
    }
}

function renderInscriptions(data) {
    const tbody = document.getElementById('inscriptionsTableBody');
    const role = localStorage.getItem('role');
    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-clipboard-list"></i>
                        <h3>Aucun(e) inscription trouvé(e)</h3>
                        <p>Commencez par ajouter un(e) nouveau(elle) inscription</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    tbody.innerHTML = data.map(item => `
        <tr>
                        <td>${item.eleve ? item.eleve.nom : '-'}</td>
            <td>${item.classe ? item.classe.nom : '-'}</td>
            <td>${item.anneeScolaire ? item.anneeScolaire.anneeScolaire : '-'}</td>
            <td>${item.type || '-'}</td>
            <td>${formatDate(item.dateAffectation)}</td>
            <td>
                <div class="table-actions">
                    ${role !== 'PARENT' ? `
                        <button class="btn btn-sm btn-warning" onclick="openEditModal('${item.id}')" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteInscription('${item.id}')" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddModal() {
    currentInscription = null;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus"></i> Nouvelle Inscription';
    resetForm('inscriptionsForm');
    
    openModal('inscriptionsModal');
}

function openEditModal(id) {
    currentInscription = inscriptions.find(item => item.id === id);
    if (!currentInscription) return;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Modifier Inscription';
    fillForm('inscriptionsForm', currentInscription);
    
    openModal('inscriptionsModal');
}

async function saveInscription() {
    if (!validateForm('inscriptionsForm')) return;
    const formData = getFormData('inscriptionsForm');
    
    try {
        showLoading();
        let url, method;
        if (currentInscription) {
            // Mise à jour classique avec body JSON
            url = `${API_INSCRIPTION}/update`;
            method = 'PUT';
            formData.id = currentInscription.id;
            const options = getFetchOptions(method, formData);
            console.log('Requête inscription (UPDATE) => URL :', url, 'Headers :', options.headers, 'Body :', formData);
            var response = await fetch(url, options);
        } else {
            // Création via paramètres dans l'URL : /matricule/idclasse/idAnnescolaire/type
            const matricule = formData.id_eleve;
            const idClasse = formData.id_classe;
            const idAnneeScolaire = formData.id_annescolaire;
            const type = formData.type;

            url = `${API_INSCRIPTION}/save/${encodeURIComponent(matricule)}/${encodeURIComponent(idClasse)}/${encodeURIComponent(idAnneeScolaire)}/${encodeURIComponent(type)}`;
            method = 'POST';

            const options = {
                method: method,
                headers: getAuthHeadersUser()
            };
            console.log('Requête inscription (SAVE) => URL :', url, 'Headers :', options.headers);
            var response = await fetch(url, options);
        }
        const data = await response.json();
        if (data.status === 'success') {
            showMessage(currentInscription ? 'Inscription modifié(e) avec succès' : 'Inscription ajouté(e) avec succès', 'success');
            closeModal('inscriptionsModal');
            loadInscriptions();
        } else if (data.status === 'exist') {
            showMessage('Cet(te) inscription existe déjà', 'warning');
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

async function deleteInscription(id) {
    const confirmed = await confirmDelete('Êtes-vous sûr de vouloir supprimer cet(te) inscription ?');
    if (!confirmed) return;
    try {
        showLoading();
        const response = await fetch(`${API_INSCRIPTION}/delete/${id}`, getFetchOptions('DELETE'));
        const data = await response.json();
        if (data.status === 'success') {
            showMessage('Inscription supprimé(e) avec succès', 'success');
            loadInscriptions();
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

function exportInscriptionCSV() {
    if (inscriptions.length === 0) {
        showMessage('Aucune donnée à exporter', 'warning');
        return;
    }
    const exportData = inscriptions.map(item => ({
                'Élève': item.eleve ? item.eleve.nom : '',
        'Classe': item.classe ? item.classe.nom : '',
        'Année Scolaire': item.anneeScolaire ? item.anneeScolaire.anneeScolaire : '',
        'Type': item.type || '',
        'Date': formatDate(item.dateAffectation)
    }));
    exportToCSV(exportData, 'inscriptions');
}

// Chargement des options de classes pour le select id_classe
async function loadClasseOptions() {
    const select = document.getElementById('id_classe');
    if (!select) return;

    try {
        const response = await fetch(`${API_CLASSE}/getAll`, getFetchOptions('GET'));
        const data = await response.json();
        if (data.status === 'success') {
            const classes = data.message || [];
            select.innerHTML = '<option value="">-- Sélectionner une classe --</option>';
            classes.forEach(classe => {
                const option = document.createElement('option');
                option.value = classe.id;
                option.textContent = classe.nom || '';
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erreur lors du chargement des classes pour le select:', error);
    }
}

// Chargement des options d'années scolaires pour le select id_annescolaire
async function loadAnneeScolaireOptions() {
    const select = document.getElementById('id_annescolaire');
    if (!select) return;

    try {
        const response = await fetch(`${API_ANNEESCOLAIRE}/getAll`, getFetchOptions('GET'));
        const data = await response.json();
        if (data.status === 'success') {
            const annees = data.message || [];
            select.innerHTML = '<option value="">-- Sélectionner une année scolaire --</option>';
            annees.forEach(annee => {
                const option = document.createElement('option');
                option.value = annee.id;
                option.textContent = annee.anneeScolaire || '';
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erreur lors du chargement des années scolaires pour le select:', error);
    }
}
