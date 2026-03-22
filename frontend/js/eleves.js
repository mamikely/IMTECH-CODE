// Gestion des Élèves
const API_ELEVE = `${window.API_BASE_URL}/eleve`;

let eleves = [];
let currentEleve = null;

// Afficher la date courante
document.getElementById('currentDate').textContent = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// Charger les élèves au démarrage
document.addEventListener('DOMContentLoaded', function () {
    loadEleves();
    
    const role = localStorage.getItem('role');

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // Recherche en temps réel pour les rôles autres que PARENT
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            if (role === 'PARENT') {
                // Pour le parent, on ne fait la recherche que sur clic du bouton
                return;
            }
            const searchTerm = e.target.value.toLowerCase();
            const filteredEleves = eleves.filter(eleve => {
                return eleve.nom.toLowerCase().includes(searchTerm) ||
                       eleve.prenom.toLowerCase().includes(searchTerm) ||
                       (eleve.matricule && eleve.matricule.toLowerCase().includes(searchTerm)) ||
                       (eleve.numero && eleve.numero.toLowerCase().includes(searchTerm));
            });
            
            // Mise à jour du tableau
            renderEleves(filteredEleves);
        });
    }

    // Pour le rôle PARENT : lancer la recherche au clic sur le bouton
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredEleves = eleves.filter(eleve => {
                return eleve.nom.toLowerCase().includes(searchTerm) ||
                       eleve.prenom.toLowerCase().includes(searchTerm) ||
                       (eleve.matricule && eleve.matricule.toLowerCase().includes(searchTerm)) ||
                       (eleve.numero && eleve.numero.toLowerCase().includes(searchTerm));
            });

            // Mise à jour du tableau avec uniquement les résultats
            renderEleves(filteredEleves);

            // Pour le parent : afficher ou cacher le tableau en fonction du résultat
            if (role === 'PARENT') {
                const tableContainer = document.querySelector('.table-container');
                if (tableContainer) {
                    if (searchTerm && filteredEleves.length > 0) {
                        tableContainer.style.display = 'block';
                    } else {
                        tableContainer.style.display = 'none';
                    }
                }
            }
        });
    }
});

// Charger tous les élèves
async function loadEleves() {
    try {
        showLoading();
        const response = await fetch(`${API_ELEVE}/getAll`, {
            method: 'GET',
            headers: getAuthHeadersUser()
        });

        const data = await response.json();

        if (data.status === 'success') {
            eleves = data.message || [];
            renderEleves(eleves);
            updateStats();
        } else {
            showMessage('Erreur lors du chargement des élèves', 'danger');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur', 'danger');
    } finally {
        hideLoading();
    }
}

// Afficher les élèves dans le tableau
function renderEleves(data) {
    const tbody = document.getElementById('elevesTableBody');
    const role = localStorage.getItem('role');
    
    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <h3>Aucun élève trouvé</h3>
                        <p>Commencez par ajouter un nouvel élève</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = data.map(eleve => `
        <tr>
            <td>${eleve.numero || '-'}</td>
            <td>${eleve.matricule || '-'}</td>
            <td><strong>${eleve.nom} ${eleve.prenom}</strong></td>
            <td>${formatDate(eleve.dateNaissance)}</td>
            <td>${eleve.telephoneParent || eleve.telPere || eleve.telMere || '-'}</td>
            <td>
                <span class="badge ${eleve.status === 'Actif' ? 'badge-success' : 'badge-warning'}">
                    ${eleve.status || 'Inactif'}
                </span>
            </td>
            <td>
                <div class="table-actions">
                    ${role !== 'PARENT' && eleve.status !== 'Actif' ? `
                        <button class="btn btn-sm btn-success" onclick="activerEleve('${eleve.id}')" 
                                title="Activer l'élève">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                    ${role !== 'PARENT' ? `
                        <button class="btn btn-sm btn-warning" onclick="openEditModal('${eleve.id}')" 
                                title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                    ` : ''}
                    ${role !== 'PARENT' ? `
                        <button class="btn btn-sm btn-danger" onclick="deleteEleve('${eleve.id}')" 
                                title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// Mettre à jour les statistiques
function updateStats() {
    document.getElementById('totalEleves').textContent = eleves.length;
    const actifs = eleves.filter(e => e.status === 'Actif').length;
    document.getElementById('elevesActifs').textContent = actifs;
    document.getElementById('elevesInactifs').textContent = eleves.length - actifs;
}

// Ouvrir le modal d'ajout
function openAddModal() {
    currentEleve = null;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-user-plus"></i> Nouvel Élève';
    resetForm('eleveForm');
    openModal('eleveModal');
}

// Ouvrir le modal de modification
function openEditModal(id) {
    currentEleve = eleves.find(e => e.id === id);
    if (!currentEleve) return;

    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-user-edit"></i> Modifier Élève';
    
    // Remplir le formulaire
    fillForm('eleveForm', currentEleve);
    
    openModal('eleveModal');
}

// Sauvegarder un élève
async function saveEleve() {
    if (!validateForm('eleveForm')) {
        return;
    }

    const formData = getFormData('eleveForm');
    
    // Convertir les valeurs numériques
    formData.raintampo = parseInt(formData.raintampo) || 0;
    formData.raintampoLahy = parseInt(formData.raintampoLahy) || 0;
    formData.raintampoVavy = parseInt(formData.raintampoVavy) || 0;
    formData.raintampoFaha = parseInt(formData.raintampoFaha) || 0;

    try {
        showLoading();
        
        let url, method;
        if (currentEleve) {
            // Modification
            url = `${API_ELEVE}/update`;
            method = 'PUT';
            formData.id = currentEleve.id;
            formData.numero = currentEleve.numero;
            formData.numeroEconomat = currentEleve.numeroEconomat;
            formData.status = currentEleve.status;
        } else {
            // Ajout
            url = `${API_ELEVE}/save`;
            method = 'POST';
        }

        const response = await fetch(url, {
            method: method,
            headers: getAuthHeadersUser(),
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.status === 'success') {
            showMessage(
                currentEleve ? 'Élève modifié avec succès' : 'Élève ajouté avec succès',
                'success'
            );
            closeModal('eleveModal');
            loadEleves();
        } else if (data.status === 'exist') {
            showMessage('Un élève avec ce matricule existe déjà', 'warning');
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

// Activer un élève
async function activerEleve(id) {
    try {
        showLoading();
        const response = await fetch(`${API_ELEVE}/update/status/${id}`, {
            method: 'PUT',
            headers: getAuthHeadersUser()
        });

        const data = await response.json();

        if (data.status === 'success') {
            showMessage('Élève activé avec succès', 'success');
            loadEleves();
        } else {
            showMessage(data.message || 'Erreur lors de l\'activation', 'danger');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur', 'danger');
    } finally {
        hideLoading();
    }
}

// Supprimer un élève
async function deleteEleve(id) {
    const confirmed = await confirmDelete(
        'Êtes-vous sûr de vouloir supprimer cet élève ? Cette action est irréversible.'
    );
    
    if (!confirmed) return;

    try {
        showLoading();
        const response = await fetch(`${API_ELEVE}/delete/${id}`, {
            method: 'DELETE',
            headers: getAuthHeadersUser()
        });

        const data = await response.json();

        if (data.status === 'success') {
            showMessage('Élève supprimé avec succès', 'success');
            loadEleves();
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

// Exporter en CSV
function exportElevesCSV() {
    if (eleves.length === 0) {
        showMessage('Aucune donnée à exporter', 'warning');
        return;
    }

    // Préparer les données pour l'export
    const exportData = eleves.map(eleve => ({
        'Numéro': eleve.numero || '',
        'Matricule': eleve.matricule || '',
        'Code Unique': eleve.codeunique || '',
        'Numéro Economat': eleve.numeroEconomat || '',
        'Nom': eleve.nom || '',
        'Prénom': eleve.prenom || '',
        'Date Naissance': formatDate(eleve.dateNaissance),
        'Lieu Naissance': eleve.lieuNaissance || '',
        'Adresse': eleve.adresse || '',
        'Église': eleve.eglise || '',
        'Père': eleve.pere || '',
        'Profession Père': eleve.professionPere || '',
        'Téléphone Père': eleve.telPere || '',
        'Mère': eleve.mere || '',
        'Profession Mère': eleve.professionMere || '',
        'Téléphone Mère': eleve.telMere || '',
        'Adresse Parents': eleve.adresseParent || '',
        'Téléphone Parents': eleve.telephoneParent || '',
        'Tuteur': eleve.nomTutaire || '',
        'Téléphone Tuteur': eleve.telTutaire || '',
        'Statut': eleve.status || ''
    }));

    exportToCSV(exportData, 'eleves');
}
