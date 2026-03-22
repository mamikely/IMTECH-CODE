// URL de base de l'API
const API_BASE_URL_ECOLE = `${window.API_BASE_URL}/ecole`;
var urlLogo = null;

/* ================== CONFIG ================== */
const GITHUB_TOKEN = "";
const USERNAME = "fetrasoatanjonait";
const REPO = "IMTECH";
const BRANCH = "main";
const FOLDER = "images"; // dossier dans le repo
/* ============================================ */


function afficherImage(url) {
    document.getElementById("logoPreview").innerHTML = `
              <img src="${url}" alt="Image GitHub">
   
    `;
}


// État de l'application
let tenants = [];
let tenantToDelete = null;
let currentTenantId = null;

// Éléments du DOM
const tenantsTableBody = document.getElementById('tenantsTableBody');
const searchInput = document.getElementById('searchInput');
const tenantForm = document.getElementById('tenantForm');
const saveButton = document.getElementById('saveTenantBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Fonctions utilitaires
const showToast = (message, type = 'success') => {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('i');
    
    // Mettre à jour le message
    toastMessage.textContent = message;
    
    // Mettre à jour les couleurs et l'icône en fonction du type
    const toastContainer = toast.firstElementChild;
    if (type === 'success') {
        toastContainer.className = 'bg-white rounded-lg shadow-lg p-4 max-w-sm border-l-4 border-green-500';
        toastIcon.className = 'fas fa-check-circle text-xl';
        toastIcon.parentElement.className = 'text-green-500 mr-3';
    } else if (type === 'error') {
        toastContainer.className = 'bg-white rounded-lg shadow-lg p-4 max-w-sm border-l-4 border-red-500';
        toastIcon.className = 'fas fa-exclamation-circle text-xl';
        toastIcon.parentElement.className = 'text-red-500 mr-3';
    } else if (type === 'warning') {
        toastContainer.className = 'bg-white rounded-lg shadow-lg p-4 max-w-sm border-l-4 border-yellow-500';
        toastIcon.className = 'fas fa-exclamation-triangle text-xl';
        toastIcon.parentElement.className = 'text-yellow-500 mr-3';
    }
    
    // Afficher le toast
    toast.classList.remove('hidden');
    
    // Masquer le toast après 5 secondes
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 5000);
};

// Gestion des modaux
const openTenantModal = () => {
    document.getElementById('tenantModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

const closeTenantModal = () => {
    document.getElementById('tenantModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    resetTenantForm();
};

const openDeleteModal = (id) => {
    tenantToDelete = id;
    document.getElementById('deleteModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

const closeDeleteModal = () => {
    document.getElementById('deleteModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    tenantToDelete = null;
};

// Gestion des couleurs
const setupColorPickers = () => {
    const colorInputs = ['couleurHeader', 'couleurBody', 'couleurFooter'];
    
    colorInputs.forEach(id => {
        const input = document.getElementById(id);
        const valueDisplay = document.getElementById(`${id}Value`);
        
        if (input && valueDisplay) {
            input.addEventListener('input', (e) => {
                valueDisplay.textContent = e.target.value.toUpperCase();
            });
        }
    });
};

// Gestion du formulaire
const resetTenantForm = () => {
    document.getElementById('tenantForm').reset();
    document.getElementById('tenantId').value = '';
    currentTenantId = null;
    
    // Réinitialiser les couleurs
    document.getElementById('couleurHeader').value = '#4361ee';
    document.getElementById('couleurBody').value = '#f8f9fa';
    document.getElementById('couleurFooter').value = '#2b2d42';
    
    // Mettre à jour les affichages de valeur
    document.getElementById('headerColorValue').textContent = '#4361ee';
    document.getElementById('bodyColorValue').textContent = '#f8f9fa';
    document.getElementById('footerColorValue').textContent = '#2b2d42';
    
    // Réinitialiser l'aperçu du logo
    const logoPreview = document.getElementById('logoPreview');
    logoPreview.innerHTML = '<span class="text-gray-400 text-sm">Aperçu du logo</span>';
    logoPreview.style.backgroundImage = 'none';
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    setupColorPickers();
    
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('authToken');
    if (!token) {
        // Rediriger vers la page de connexion si non authentifié
        window.location.href = 'index.html';
        return;
    }
    
    // Vérifier les autorisations (optionnel, selon vos besoins)
    const role = localStorage.getItem('role');
    if (role !== 'SUPERADMIN') {
        showToast('Vous n\'avez pas les droits pour accéder à cette page', 'error');
        // Rediriger vers le tableau de bord après un court délai
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        return;
    }
    
    // Charger les écoles si l'utilisateur est authentifié et autorisé
    loadTenants();
    
    // Gestionnaire d'événement pour l'aperçu du logo
    document.getElementById('logo').addEventListener('input', (e) => {
        const logoUrl = e.target.value;
        const logoPreview = document.getElementById('logoPreview');
        
        if (logoUrl) {
            logoPreview.innerHTML = '';
            logoPreview.style.backgroundImage = `url('${logoUrl}')`;
            logoPreview.style.backgroundSize = 'contain';
            logoPreview.style.backgroundPosition = 'center';
            logoPreview.style.backgroundRepeat = 'no-repeat';
        } else {
            logoPreview.innerHTML = '<span class="text-gray-400 text-sm">Aperçu du logo</span>';
            logoPreview.style.backgroundImage = 'none';
        }
    });
    
    // Fermer les modaux en cliquant à l'extérieur
    window.onclick = (event) => {
        const tenantModal = document.getElementById('tenantModal');
        const deleteModal = document.getElementById('deleteModal');
        
        if (event.target === tenantModal) {
            closeTenantModal();
        }
        
        if (event.target === deleteModal) {
            closeDeleteModal();
        }
    };
});

// Écouteurs d'événements
document.addEventListener('DOMContentLoaded', () => {
    // Gestion de la soumission du formulaire
    saveButton.addEventListener('click', saveTenant);
    
    // Gestion de la confirmation de suppression
    confirmDeleteBtn.addEventListener('click', confirmDelete);
    
    // Recherche en temps réel
    searchInput.addEventListener('input', filterTenants);
    
    // Initialisation des sélecteurs de couleur
    initColorPickers();
});

// Charger la liste des tenants
async function loadTenants() {
    try {
        // Afficher l'état de chargement
        tenantsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                    <div class="flex flex-col items-center justify-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
                        <span>Chargement des écoles...</span>
                    </div>
                </td>
            </tr>
        `;
        
        // Ajouter un timestamp pour éviter le cache
        const timestamp = new Date().getTime();
        const response = await fetch(`${API_BASE_URL_ECOLE}/getAll?t=${timestamp}`, {
            headers: getAuthHeadersAdmin(),
            cache: 'no-store' // Désactiver le cache
        });
        const data = await response.json();
        
        if (data.status === 'success') {
            tenants = data.message || [];
            renderTenants(tenants);
            
            if (tenants.length === 0) {
                showToast('Aucune école trouvée', 'info');
            } else {
                showToast(`${tenants.length} école(s) chargée(s) avec succès`, 'success');
            }
        } else {
            throw new Error(data.message || 'Erreur lors du chargement des écoles');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showToast(error.message || 'Une erreur est survenue lors du chargement des écoles', 'error');
        
        // Afficher un message d'erreur dans le tableau
        tenantsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-8 text-center text-red-500">
                    <div class="flex flex-col items-center">
                        <i class="fas fa-exclamation-circle text-4xl mb-2"></i>
                        <p>Erreur lors du chargement des écoles</p>
                        <button onclick="loadTenants()" class="mt-2 text-sm text-primary-600 hover:underline">
                            <i class="fas fa-sync-alt mr-1"></i> Réessayer
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }
}

// Afficher la liste des tenants dans le tableau
function renderTenants(tenantsToRender) {
    if (!tenantsToRender || tenantsToRender.length === 0) {
        tenantsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-8 text-center">
                    <div class="flex flex-col items-center text-gray-500">
                        <i class="fas fa-school text-4xl mb-3 text-gray-300"></i>
                        <p class="text-lg font-medium">Aucune école trouvée</p>
                        <p class="text-sm mt-1">Commencez par ajouter une nouvelle école</p>
                        <button onclick="addNewTenant()" class="mt-4 btn btn-primary">
                            <i class="fas fa-plus mr-2"></i> Ajouter une école
                        </button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tenantsTableBody.innerHTML = tenantsToRender.map(tenant => {
        const statusClass = tenant.status === 'ACTIF' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800';
            
        return `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        ${tenant.logo ? 
                            `<img src="${tenant.logo}" alt="${tenant.nom}" class="h-10 w-10 rounded-full object-cover mr-3">` : 
                            `<div class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                <i class="fas fa-school text-gray-400"></i>
                            </div>`
                        }
                        <div>
                            <div class="text-sm font-medium text-gray-900">${tenant.nom}</div>
                            ${tenant.adresse ? 
                                `<div class="text-sm text-gray-500 flex items-center mt-1">
                                    <i class="fas fa-map-marker-alt text-xs mr-1"></i>
                                    <span class="truncate max-w-xs">${tenant.adresse}</span>
                                </div>` 
                                : ''
                            }
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${tenant.email || '-'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${tenant.telephone || '-'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${tenant.status || 'INACTIF'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                        <button onclick="editTenant('${tenant.id}')" 
                                class="text-indigo-600 hover:text-indigo-900 mr-3"
                                title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="openDeleteModal('${tenant.id}')" 
                                class="text-red-600 hover:text-red-900"
                                title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Ouvrir le modal pour ajouter un nouveau tenant
function addNewTenant() {
    resetTenantForm();
    document.getElementById('tenantModalLabel').textContent = 'Ajouter une école';
    openTenantModal();
}

// Ouvrir le modal pour éditer un tenant existant
function editTenant(tenantId) {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) {
        showToast('École non trouvée', 'error');
        return;
    }
    
    // Enregistrer l'ID du tenant actuel
    currentTenantId = tenantId;
    
    // Mettre à jour le titre du modal
    document.getElementById('tenantModalLabel').textContent = 'Modifier une école';
    
    // Remplir le formulaire avec les données du tenant
    document.getElementById('tenantId').value = tenant.id;
    document.getElementById('nom').value = tenant.nom || '';
    document.getElementById('adresse').value = tenant.adresse || '';
    document.getElementById('email').value = tenant.email || '';
    document.getElementById('telephone').value = tenant.telephone || '';
    document.getElementById('slogan').value = tenant.slogan || '';
    document.getElementById('status').value = tenant.status || 'ACTIF';
    document.getElementById('logo').value = tenant.logo || '';
    
    // Définir les couleurs
    const headerColor = tenant.couleurHeader || '#4361ee';
    const bodyColor = tenant.couleurBody || '#f8f9fa';
    const footerColor = tenant.couleurFooter || '#2b2d42';
    
    document.getElementById('couleurHeader').value = headerColor;
    document.getElementById('couleurBody').value = bodyColor;
    document.getElementById('couleurFooter').value = footerColor;
    
    // Mettre à jour les affichages de valeur des couleurs
    document.getElementById('headerColorValue').textContent = headerColor.toUpperCase();
    document.getElementById('bodyColorValue').textContent = bodyColor.toUpperCase();
    document.getElementById('footerColorValue').textContent = footerColor.toUpperCase();
    
    // Mettre à jour l'aperçu du logo si une URL est fournie
    if (tenant.logo) {
        const logoPreview = document.getElementById('logoPreview');
        logoPreview.innerHTML = '';
        logoPreview.style.backgroundImage = `url('${tenant.logo}')`;
        logoPreview.style.backgroundSize = 'contain';
        logoPreview.style.backgroundPosition = 'center';
        logoPreview.style.backgroundRepeat = 'no-repeat';
    }
    
    // Ouvrir le modal
    openTenantModal();
}

// Sauvegarder un tenant (ajout ou modification)
async function saveTenant() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Sélectionnez une image");
        return;
    }

    // 1) Lire le fichier en base64 de manière asynchrone
    let base64Content;
    try {
        base64Content = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const result = reader.result || "";
                    const parts = result.split(",");
                    if (parts.length < 2) {
                        return reject(new Error("Format de fichier invalide"));
                    }
                    resolve(parts[1]);
                } catch (e) {
                    reject(e);
                }
            };
            reader.onerror = () => reject(reader.error || new Error("Erreur lors de la lecture du fichier"));
            reader.readAsDataURL(file);
        });
    } catch (e) {
        console.error(e);
        alert("Erreur lors de la lecture de l'image");
        return;
    }

    // 2) Uploader l'image sur GitHub et récupérer l'URL AVANT d'envoyer les données du tenant
    const fileName = Date.now() + "_" + file.name;
    const githubUrl = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/${FOLDER}/${fileName}`;

    let logoUrlLocal;
    try {
        const uploadResponse = await fetch(githubUrl, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${GITHUB_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Upload image via JS",
                content: base64Content,
                branch: BRANCH
            })
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
            console.error(uploadData);
            alert("Erreur upload");
            return;
        }

        logoUrlLocal = `https://raw.githubusercontent.com/${USERNAME}/${REPO}/${BRANCH}/${FOLDER}/${fileName}`;
        urlLogo = logoUrlLocal; // garder la variable globale si elle est utilisée ailleurs
        afficherImage(logoUrlLocal);
    } catch (e) {
        console.error(e);
        alert("Erreur lors de l'upload de l'image");
        return;
    }

    const form = document.getElementById('tenantForm');
    const formInputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    // Validation des champs requis
    formInputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            isValid = false;
        } else {
            input.classList.remove('border-red-500');
        }
    });
    
    if (!isValid) {
        showToast('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    // Préparer les données du tenant
    const tenantId = currentTenantId || document.getElementById('tenantId').value;
    
    const tenantData = {
        id: tenantId || null,
        nom: document.getElementById('nom').value.trim(),
        adresse: document.getElementById('adresse').value.trim(),
        email: document.getElementById('email').value.trim(),
        telephone: document.getElementById('telephone').value.trim(),
        slogan: document.getElementById('slogan').value.trim(),
        status: document.getElementById('status').value,
        // Utiliser l'URL de logo garantie après upload
        logo: logoUrlLocal || urlLogo,
        couleurHeader: document.getElementById('couleurHeader').value,
        couleurBody: document.getElementById('couleurBody').value,
        couleurFooter: document.getElementById('couleurFooter').value
    };
    
    

    const isEdit = !!currentTenantId;
    // Utiliser le bon endpoint en fonction de l'action (ajout ou mise à jour)
    const endpoint = isEdit ? '/update' : '/save';
    const url = `${API_BASE_URL_ECOLE}${endpoint}`; // Ajout du préfixe /tenants
    const method = isEdit ? 'PUT' : 'POST';
    
    // Désactiver le bouton et afficher l'état de chargement
    const saveBtn = document.getElementById('saveTenantBtn');
    const originalBtnContent = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> Enregistrement...';
    
    try {
        console.log('Envoi des données:', {
            url,
            method,
            data: tenantData
        });

        const response = await fetch(url, {
            method: method,
            headers: getAuthHeadersAdmin(),
            body: JSON.stringify(tenantData)
        });
        
        const data = await response.json();
        console.log('Réponse du serveur:', data);
        
        if (!response.ok) {
            throw new Error(data.message || 'Une erreur est survenue');
        }
        
        if (data.status === 'success') {
            showToast(
                isEdit ? 'École mise à jour avec succès' : 'École créée avec succès',
                'success'
            );
            closeModal();
            // Recharger les données avec un délai pour laisser le temps à la base de données de se mettre à jour
            setTimeout(() => loadTenants(), 500);
        } else if (data.status === 'exist') {
            showToast('Une école avec ce nom existe déjà', 'warning');
        } else if (data.status === 'introuvable') {
            showToast('Cette école n\'existe plus dans la base de données', 'error');
            loadTenants(); // Recharger la liste
        } else {
            throw new Error(data.message || 'Une erreur est survenue');
        }
    } catch (error) {
        console.error('Erreur détaillée:', error);
        
        // Gestion spécifique de l'erreur de verrouillage optimiste
        if (error.message.includes('optimistic locking') || 
            error.message.includes('was updated or deleted') ||
            error.message.includes('Row was updated or deleted by another transaction')) {
            showToast('Cette école a été modifiée par un autre utilisateur. Rechargement des données...', 'warning');
            // Recharger les données avant d'afficher le message suivant
            await loadTenants();
            // Proposer d'éditer à nouveau après le rechargement
            if (tenantData.id) {
                showToast('Veuillez vérifier les données mises à jour et les modifier si nécessaire', 'info');
                // Ouvrir automatiquement le formulaire d'édition avec les nouvelles données
                setTimeout(() => editTenant(tenantData.id), 1000);
            }
        } else {
            showToast(error.message || 'Une erreur est survenue lors de la sauvegarde', 'error');
        }
    } finally {
        // Réactiver le bouton et restaurer son contenu
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalBtnContent;
    }
}

// La fonction confirmDeleteTenant a été remplacée par openDeleteModal

// Confirmer la suppression
async function confirmDelete() {
    if (!tenantToDelete) {
        closeDeleteModal();
        return;
    }
    
    // Afficher l'état de chargement sur le bouton de suppression
    const deleteBtn = document.getElementById('confirmDeleteBtn');
    const originalBtnContent = deleteBtn.innerHTML;
    deleteBtn.disabled = true;
    deleteBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> Suppression...';
    
    try {
        const response = await fetch(`${API_BASE_URL_ECOLE}/delete/${tenantToDelete}`, {
            method: 'DELETE',
            headers: getAuthHeadersAdmin()
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Une erreur est survenue');
        }
        
        if (data.status === 'success') {
            showToast('École supprimée avec succès', 'success');
            closeDeleteModal();
            loadTenants();
        } else {
            throw new Error(data.message || 'Une erreur est survenue');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showToast(error.message || 'Une erreur est survenue lors de la suppression', 'error');
    } finally {
        // Réactiver le bouton et restaurer son contenu
        deleteBtn.disabled = false;
        deleteBtn.innerHTML = originalBtnContent;
        tenantToDelete = null;
    }
}

// Filtrer les tenants par recherche
function filterTenants() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderTenants(tenants);
        return;
    }
    
    const filtered = tenants.filter(tenant => {
        const searchableFields = [
            tenant.nom || '',
            tenant.email || '',
            tenant.telephone || '',
            tenant.adresse || '',
            tenant.slogan || ''
        ];
        
        return searchableFields.some(field => 
            field.toLowerCase().includes(searchTerm)
        );
    });
    
    if (filtered.length === 0) {
        tenantsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-8 text-center">
                    <div class="flex flex-col items-center text-gray-500">
                        <i class="fas fa-search text-4xl mb-3 text-gray-300"></i>
                        <p class="text-lg font-medium">Aucun résultat trouvé</p>
                        <p class="text-sm mt-1">Aucune école ne correspond à votre recherche</p>
                    </div>
                </td>
            </tr>
        `;
    } else {
        renderTenants(filtered);
    }
}

// Gestionnaire d'événement pour la recherche en temps réel
if (searchInput) {
    let searchTimeout;
    
    searchInput.addEventListener('input', () => {
        // Annuler le délai précédent
        clearTimeout(searchTimeout);
        
        // Définir un nouveau délai
        searchTimeout = setTimeout(() => {
            filterTenants();
        }, 300); // Délai de 300ms après la fin de la frappe
    });
    
    // Permettre également la recherche avec la touche Entrée
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            clearTimeout(searchTimeout);
            filterTenants();
        }
    });
}

// Initialiser les sélecteurs de couleur
function initColorPickers() {
    const colorInputs = document.querySelectorAll('input[type="color"]');
    
    colorInputs.forEach(input => {
        // Créer un aperçu de la couleur
        const preview = document.createElement('span');
        preview.className = 'color-preview';
        preview.style.backgroundColor = input.value;
        
        // Insérer l'aperçu après l'input
        input.parentNode.insertBefore(preview, input.nextSibling);
        
        // Mettre à jour l'aperçu lors du changement de couleur
        input.addEventListener('input', () => {
            preview.style.backgroundColor = input.value;
            // Mettre à jour la valeur textuelle si elle existe
            const textInput = input.nextElementSibling;
            if (textInput && textInput.tagName === 'INPUT') {
                textInput.value = input.value.toUpperCase();
            }
        });
    });
}

// Mettre à jour les aperçus de couleur
function updateColorPreviews() {
    const colorInputs = document.querySelectorAll('input[type="color"]');
    
    colorInputs.forEach(input => {
        const preview = input.nextElementSibling;
        if (preview && preview.className.includes('color-preview')) {
            preview.style.backgroundColor = input.value;
        }
    });
}

// Afficher une alerte
function showAlert(message, type) {
    // Créer l'élément d'alerte s'il n'existe pas
    let alertElement = document.querySelector('.alert-dismissible');
    
    if (!alertElement) {
        alertElement = document.createElement('div');
        alertElement.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-4`;
        alertElement.style.zIndex = '1100';
        alertElement.role = 'alert';
        
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'btn-close';
        closeButton.setAttribute('data-bs-dismiss', 'alert');
        closeButton.setAttribute('aria-label', 'Close');
        
        alertElement.innerHTML = `
            ${message}
        `;
        alertElement.prepend(closeButton);
        
        document.body.appendChild(alertElement);
    } else {
        // Mettre à jour le contenu et le style de l'alerte existante
        alertElement.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-4`;
        const messageSpan = alertElement.querySelector('span:not(.btn-close)');
        if (messageSpan) {
            messageSpan.textContent = message;
        } else {
            alertElement.insertBefore(document.createTextNode(message), alertElement.firstChild);
        }
    }
    
    // Supprimer l'alerte après 5 secondes
    setTimeout(() => {
        if (alertElement) {
            const bsAlert = new bootstrap.Alert(alertElement);
            bsAlert.close();
        }
    }, 5000);
}

// Exposer les fonctions au scope global
window.addNewTenant = addNewTenant;
window.editTenant = editTenant;
window.openDeleteModal = openDeleteModal;
window.confirmDelete = confirmDelete;
window.closeDeleteModal = closeDeleteModal;
window.closeTenantModal = closeTenantModal;
window.openTenantModal = openTenantModal;

// Initialiser les sélecteurs de couleur au chargement
initColorPickers();
