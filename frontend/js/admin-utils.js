// Fonctions utilitaires pour l'interface admin

// Gestion du menu mobile
function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Fermer le menu lors du clic sur un lien
        const menuItems = sidebar.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    sidebar.classList.remove('active');
                }
            });
        });
    }
}

// Gestion du menu actif
function setActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop();
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && href.includes(currentPage)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Gestion des modals
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Fermer le modal en cliquant sur le fond
function initModalCloseOnBackdrop() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    });
}

// Afficher le loading overlay
function showLoading() {
    let overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(overlay);
    }
    overlay.classList.add('show');
}

// Masquer le loading overlay
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

// Fonction de recherche dans un tableau
function searchTable(searchInput, tableBody) {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = tableBody.querySelectorAll('tr');
    
    let visibleCount = 0;
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    return visibleCount;
}

// Pagination
class Pagination {
    constructor(items, itemsPerPage = 10) {
        this.items = items;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.totalPages = Math.ceil(items.length / itemsPerPage);
    }

    getCurrentPageItems() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.items.slice(start, end);
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            return true;
        }
        return false;
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            return true;
        }
        return false;
    }

    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            return true;
        }
        return false;
    }

    getPaginationInfo() {
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, this.items.length);
        return {
            start,
            end,
            total: this.items.length,
            currentPage: this.currentPage,
            totalPages: this.totalPages
        };
    }
}

// Générer les boutons de pagination
function renderPagination(pagination, onPageChange) {
    const info = pagination.getPaginationInfo();
    
    let html = `
        <div class="pagination">
            <button onclick="handlePaginationClick('first')" ${pagination.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-angle-double-left"></i>
            </button>
            <button onclick="handlePaginationClick('prev')" ${pagination.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-angle-left"></i>
            </button>
            <span class="pagination-info">
                ${info.start}-${info.end} sur ${info.total}
            </span>
            <button onclick="handlePaginationClick('next')" ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}>
                <i class="fas fa-angle-right"></i>
            </button>
            <button onclick="handlePaginationClick('last')" ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}>
                <i class="fas fa-angle-double-right"></i>
            </button>
        </div>
    `;
    
    return html;
}

// Confirmation de suppression
function confirmDelete(message = 'Êtes-vous sûr de vouloir supprimer cet élément ?') {
    return new Promise((resolve) => {
        const confirmed = confirm(message);
        resolve(confirmed);
    });
}

// Validation de formulaire
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'var(--danger-color)';
            isValid = false;
        } else {
            input.style.borderColor = 'var(--border-color)';
        }
    });
    
    if (!isValid) {
        showMessage('Veuillez remplir tous les champs obligatoires', 'danger');
    }
    
    return isValid;
}

// Réinitialiser un formulaire
function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        // Réinitialiser les styles de validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = 'var(--border-color)';
        });
    }
}

// Remplir un formulaire avec des données
function fillForm(formId, data) {
    const form = document.getElementById(formId);
    if (!form || !data) return;
    
    Object.keys(data).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            if (input.type === 'checkbox') {
                input.checked = data[key];
            } else if (input.type === 'date') {
                // Formater la date pour l'input
                if (data[key]) {
                    const date = new Date(data[key]);
                    input.value = date.toISOString().split('T')[0];
                }
            } else {
                input.value = data[key] || '';
            }
        }
    });
}

// Récupérer les données d'un formulaire
function getFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return null;
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        // Gérer les checkboxes
        const input = form.querySelector(`[name="${key}"]`);
        if (input && input.type === 'checkbox') {
            data[key] = input.checked;
        } else {
            data[key] = value;
        }
    }
    
    return data;
}

// Initialisation globale
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification
    checkAuth();
    
    // Initialiser le menu mobile
    initMobileMenu();
    
    // Définir le menu actif
    setActiveMenu();
    
    // Initialiser la fermeture des modals sur backdrop
    initModalCloseOnBackdrop();
    
    // Afficher les informations utilisateur
    const role = localStorage.getItem('role');
    const roleElement = document.getElementById('userRole');
    if (roleElement) {
        roleElement.textContent = role || 'Utilisateur';
    }
});

// Exposer les fonctions globalement
window.openModal = openModal;
window.closeModal = closeModal;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.searchTable = searchTable;
window.Pagination = Pagination;
window.renderPagination = renderPagination;
window.confirmDelete = confirmDelete;
window.validateForm = validateForm;
window.resetForm = resetForm;
window.fillForm = fillForm;
window.getFormData = getFormData;
