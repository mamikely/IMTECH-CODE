// Gestion des Paiements
const API_PAIEMENT = `${window.API_BASE_URL}/paiements`;
const API_INSCRIPTION = `${window.API_BASE_URL}/inscriptions`;

let paiements = [];
let inscriptions = [];
let anneeScolaires = [];
let currentPaiement = null;

document.getElementById('currentDate').textContent = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

document.addEventListener('DOMContentLoaded', function () {
    checkAuth();
    loadPaiements();
    loadInscriptions();
    loadAnneesScolaires();
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = paiements.filter(p => {
                const eleveNom = p.inscription && p.inscription.eleve ? 
                    `${p.inscription.eleve.nom} ${p.inscription.eleve.prenom}`.toLowerCase() : '';
                return eleveNom.includes(searchTerm) ||
                       (p.mois && p.mois.toLowerCase().includes(searchTerm)) ||
                       (p.type && p.type.toLowerCase().includes(searchTerm));
            });
            renderPaiements(filtered);
        });
    }
});

async function loadPaiements() {
    try {
        showLoading();
        const response = await fetch(API_PAIEMENT, {
            method: 'GET',
            headers: getAuthHeadersUser()
        });
        if (!response.ok) throw new Error('Erreur réseau');
        
        const paiements = await response.json();
        renderPaiements(paiements);
        updateStats(paiements);
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur: ' + error.message, 'danger');
    } finally {
        hideLoading();
    }
}

async function loadAnneesScolaires() {
    try {
        const response = await fetch(`${window.API_BASE_URL}/anneescolaire/getAll`, {
            method: 'GET',
            headers: getAuthHeadersUser()
        });
        const data = await response.json();
        if (data.status === 'success') {
            anneeScolaires = data.message || [];
            populateAnneeScolaireSelect();
        }
    } catch (error) {
        console.error('Erreur chargement des années scolaires:', error);
    }
}

function populateAnneeScolaireSelect() {
    const select = document.getElementById('anneeScolaireId');
    if (!select) return;
    
    // Sauvegarder la valeur sélectionnée
    const selectedValue = select.value;
    
    // Vider et reconstruire la liste
    select.innerHTML = '<option value="">Sélectionner une année scolaire</option>';
    
    anneeScolaires.forEach(annee => {
        const option = document.createElement('option');
        option.value = annee.id;
        option.textContent = annee.anneeScolaire || `Année ${annee.id}`;
        select.appendChild(option);
    });
    
    // Restaurer la valeur sélectionnée si elle existe toujours
    if (selectedValue && anneeScolaires.some(a => a.id === selectedValue)) {
        select.value = selectedValue;
    }
}

async function loadInscriptions() {
    try {
        const response = await fetch(`${API_INSCRIPTION}/getAll`, {
            method: 'GET',
            headers: getAuthHeadersUser()
        });
        const data = await response.json();
        if (data.status === 'success') {
            inscriptions = data.message || [];
            populateInscriptionSelect();
        }
    } catch (error) {
        console.error('Erreur chargement inscriptions:', error);
    }
}

function populateInscriptionSelect() {
    const select = document.getElementById('inscriptionId');
    if (!select) return;
    
    select.innerHTML = '<option value="">Sélectionner une inscription</option>';
    inscriptions.forEach(insc => {
        if (insc.eleve && insc.classe) {
            const option = document.createElement('option');
            option.value = insc.id;
            option.textContent = `${insc.eleve.nom} ${insc.eleve.prenom} - ${insc.classe.nom}`;
            select.appendChild(option);
        }
    });
}

function renderPaiements(data) {
    const tbody = document.getElementById('paiementsTableBody');
    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-money-bill-wave"></i>
                        <h3>Aucun paiement trouvé</h3>
                        <p>Commencez par ajouter un nouveau paiement</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = data.map(p => `
        <tr>
            <td>${p.inscription && p.inscription.eleve ? 
                `${p.inscription.eleve.nom} ${p.inscription.eleve.prenom}` : '-'}</td>
            <td>${p.inscription && p.inscription.classe ? p.inscription.classe.nom : '-'}</td>
            <td>${p.amount ? p.amount.toLocaleString('fr-FR') + ' Ar' : '-'}</td>
            <td>${p.mois || '-'}</td>
            <td>${formatDate(p.datePaiement)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-warning" onclick="openEditModal('${p.id}')" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deletePaiement('${p.id}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function updateStats() {
    const totalElement = document.getElementById('totalPaiements');
    const montantElement = document.getElementById('montantTotal');
    
    if (totalElement) {
        totalElement.textContent = paiements.length;
    }
    
    if (montantElement) {
        const total = paiements.reduce((sum, p) => sum + (p.amount || 0), 0);
        montantElement.textContent = total.toLocaleString('fr-FR') + ' Ar';
    }
}

function openAddModal() {
    currentPaiement = null;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus"></i> Nouveau Paiement';
    resetForm('paiementForm');
    openModal('paiementModal');
}

async function openEditModal(id) {
    try {
        showLoading();
        const response = await fetch(`${API_PAIEMENT}/getOne/${id}`, {
            method: 'GET',
            headers: getAuthHeadersUser()
        });
        const data = await response.json();
        if (data.status === 'success') {
            currentPaiement = data.message;
            document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Modifier Paiement';
            
            if (currentPaiement.inscription) {
                document.getElementById('inscriptionId').value = currentPaiement.inscription.id;
            }
            document.getElementById('amount').value = currentPaiement.amount || '';
            document.getElementById('mois').value = currentPaiement.mois || '';
            document.getElementById('type').value = currentPaiement.type || '';
            if (currentPaiement.datePaiement) {
                const date = new Date(currentPaiement.datePaiement);
                document.getElementById('datePaiement').value = date.toISOString().split('T')[0];
            }
            
            openModal('paiementModal');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur lors du chargement du paiement', 'danger');
    } finally {
        hideLoading();
    }
}

async function savePaiement() {
    const matricule = document.getElementById('matricule').value;
    const anneeScolaireId = document.getElementById('anneeScolaireId').value;
    const amount = document.getElementById('amount').value;
    const mois = document.getElementById('mois').value;
    const type = document.getElementById('type').value;
    
    if (!matricule || !anneeScolaireId || !amount) {
        showMessage('Veuillez remplir tous les champs obligatoires', 'warning');
        return;
    }
    
    const paiementData = {
        amount: parseInt(amount),
        mois: mois,
        type: type,
        datePaiement: new Date().toISOString().split('T')[0] // Date du jour par défaut
    };
    
    try {
        showLoading();
        let url, method;
        if (currentPaiement) {
            url = `${API_PAIEMENT}/update/${currentPaiement.id}`;
            method = 'PUT';
        } else {
            url = `${API_PAIEMENT}/save/${matricule}/${anneeScolaireId}`;
            method = 'POST';
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeadersUser()
            },
            body: JSON.stringify(paiementData)
        });
        
        if (response.ok) {
            if (method === 'POST') {
                showMessage('Paiement enregistré avec succès', 'success');
            } else {
                showMessage('Paiement modifié avec succès', 'success');
            }
            closeModal('paiementModal');
            loadPaiements();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de l\'enregistrement');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage(error.message || 'Erreur lors de la sauvegarde du paiement', 'danger');
    } finally {
        hideLoading();
    }
}

async function deletePaiement(id) {
    if (!confirm('Voulez-vous vraiment supprimer ce paiement ? Cette action est irréversible.')) {
        return;
    }
    
    try {
        showLoading();
        const response = await fetch(`${API_PAIEMENT}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeadersUser()
        });
        
        if (response.ok) {
            showMessage('Paiement supprimé avec succès', 'success');
            loadPaiements();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage(error.message || 'Erreur lors de la suppression du paiement', 'danger');
    } finally {
        hideLoading();
    }
}

function exportPaiementsCSV() {
    if (paiements.length === 0) {
        showMessage('Aucune donnée à exporter', 'warning');
        return;
    }
    const exportData = paiements.map(p => ({
        'Élève': p.inscription && p.inscription.eleve ? 
            `${p.inscription.eleve.nom} ${p.inscription.eleve.prenom}` : '',
        'Classe': p.inscription && p.inscription.classe ? p.inscription.classe.nom : '',
        'Montant': p.amount || '',
        'Mois': p.mois || '',
        'Type': p.type || '',
        'Date': formatDate(p.datePaiement)
    }));
    exportToCSV(exportData, 'paiements');
}

const exportBtn = document.getElementById('exportBtn');
if (exportBtn) {
    exportBtn.addEventListener('click', exportPaiementsCSV);
}
