// Gestion des Classes
const API_CLASSE = `${window.API_BASE_URL}/classe`;

let classes = [];
let currentClasse = null;

// Afficher la date courante
document.getElementById('currentDate').textContent = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// Charger les classes au démarrage
document.addEventListener('DOMContentLoaded', function () {
    checkAuth();
    loadClasses();
    
    // Recherche en temps réel
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filteredClasses = classes.filter(classe => {
                return classe.nom.toLowerCase().includes(searchTerm) ||
                       (classe.niveau && classe.niveau.toLowerCase().includes(searchTerm));
            });
            renderClasses(filteredClasses);
        });
    }
});

// Charger toutes les classes
async function loadClasses() {
    try {
        showLoading();
        const response = await fetch(`${API_CLASSE}/getAll`, {
            method: 'GET',
            headers: getAuthHeadersUser()
        });

        const data = await response.json();

        if (data.status === 'success') {
            classes = data.message || [];
            renderClasses(classes);
            updateStats();
        } else {
            showMessage('Erreur lors du chargement des classes', 'danger');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur', 'danger');
    } finally {
        hideLoading();
    }
}

// Afficher les classes dans le tableau
function renderClasses(data) {
    const tbody = document.getElementById('classesTableBody');
    
    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-chalkboard"></i>
                        <h3>Aucune classe trouvée</h3>
                        <p>Commencez par ajouter une nouvelle classe</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = data.map(classe => `
        <tr>
            <td><strong>${classe.nom || '-'}</strong></td>
            <td>${classe.niveau || '-'}</td>
            <td>
                <span class="badge badge-info">
                    ${classe.inscriptions ? classe.inscriptions.length : 0} élèves
                </span>
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-primary" onclick="viewClasseDetails('${classe.id}')" 
                            title="Voir détails">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="openEditModal('${classe.id}')" 
                            title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteClasse('${classe.id}')" 
                            title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Mettre à jour les statistiques
function updateStats() {
    const totalClassesEl = document.getElementById('totalClasses');
    if (totalClassesEl) {
        totalClassesEl.textContent = classes.length;
    }
}

// Ouvrir le modal d'ajout
function openAddModal() {
    currentClasse = null;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus"></i> Nouvelle Classe';
    resetForm('classeForm');
    openModal('classeModal');
}

// Ouvrir le modal de modification
async function openEditModal(id) {
    try {
        showLoading();
        const response = await fetch(`${API_CLASSE}/getOne/${id}`, {
            method: 'GET',
            headers: getAuthHeadersUser()
        });

        const data = await response.json();

        if (data.status === 'success') {
            currentClasse = data.message;
            document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Modifier Classe';
            
            // Remplir le formulaire
            document.getElementById('nom').value = currentClasse.nom || '';
            document.getElementById('niveau').value = currentClasse.niveau || '';
            
            openModal('classeModal');
        } else {
            showMessage('Erreur lors du chargement de la classe', 'danger');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur', 'danger');
    } finally {
        hideLoading();
    }
}

// Sauvegarder une classe
async function saveClasse() {
    // Validation
    const nom = document.getElementById('nom').value.trim();
    const niveau = document.getElementById('niveau').value.trim();
    
    if (!nom) {
        showMessage('Le nom de la classe est obligatoire', 'warning');
        return;
    }

    const classeData = {
        nom: nom,
        niveau: niveau
    };

    try {
        showLoading();
        let url, method;
        
        if (currentClasse && currentClasse.id) {
            // Modification
            url = `${API_CLASSE}/update/${currentClasse.id}`;
            method = 'PUT';
            classeData.id = currentClasse.id;
        } else {
            // Ajout
            url = `${API_CLASSE}/save`;
            method = 'POST';
        }

        const response = await fetch(url, {
            method: method,
            headers: getAuthHeadersUser(),
            body: JSON.stringify(classeData)
        });

        const data = await response.json();

        if (data.status === 'success') {
            showMessage(
                currentClasse ? 'Classe modifiée avec succès' : 'Classe créée avec succès',
                'success'
            );
            closeModal('classeModal');
            loadClasses();
        } else {
            showMessage(data.message || 'Erreur lors de la sauvegarde', 'danger');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur', 'danger');
    } finally {
        hideLoading();
    }
}

// Supprimer une classe
async function deleteClasse(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette classe ? Cette action est irréversible.')) {
        return;
    }

    try {
        showLoading();
        const response = await fetch(`${API_CLASSE}/delete/${id}`, {
            method: 'DELETE',
            headers: getAuthHeadersUser()
        });

        const data = await response.json();

        if (data.status === 'success') {
            showMessage('Classe supprimée avec succès', 'success');
            loadClasses();
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

// Voir les détails d'une classe
async function viewClasseDetails(id) {
    try {
        showLoading();
        const response = await fetch(`${API_CLASSE}/getOne/${id}`, {
            method: 'GET',
            headers: getAuthHeadersUser()
        });

        const data = await response.json();

        if (data.status === 'success') {
            const classe = data.message;
            alert(`Détails de la classe:\n\nNom: ${classe.nom}\nNiveau: ${classe.niveau || 'Non spécifié'}`);
        } else {
            showMessage('Erreur lors du chargement des détails', 'danger');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur', 'danger');
    } finally {
        hideLoading();
    }
}

// Exporter les classes
function exportClasses() {
    if (classes.length === 0) {
        showMessage('Aucune donnée à exporter', 'warning');
        return;
    }
    
    const exportData = classes.map(c => ({
        'Nom': c.nom,
        'Niveau': c.niveau || ''
    }));
    
    exportToCSV(exportData, 'classes');
}

// Gestionnaire pour le bouton d'export
const exportBtn = document.getElementById('exportBtn');
if (exportBtn) {
    exportBtn.addEventListener('click', exportClasses);
}
