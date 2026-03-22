# IMTECH-Educ - Frontend Application

## 📋 Description
Application frontend complète pour la gestion scolaire IMTECH-Educ. Cette application web moderne offre une interface intuitive pour gérer tous les aspects d'un établissement scolaire.

## ✨ Fonctionnalités

### Gestion
- **Élèves** : CRUD complet avec tous les détails (informations personnelles, parents, tuteurs, religieuses, etc.)
- **Classes** : Gestion des classes et niveaux
- **Années Scolaires** : Gestion des années académiques
- **Inscriptions** : Inscription et réinscription des élèves
- **Matières** : Gestion des matières par classe

### Académique
- **Trimestres** : Configuration des périodes scolaires
- **Examens** : Gestion des examens et devoirs
- **Notes** : Saisie et consultation des notes
- **Absences** : Suivi des absences et retards

### Finances
- **Tarifs** : Configuration des frais de scolarité

### Fonctionnalités Transversales
- ✅ Recherche et filtrage en temps réel
- ✅ Export CSV pour toutes les données
- ✅ Interface responsive (mobile, tablette, desktop)
- ✅ Authentification sécurisée
- ✅ Messages de confirmation et d'erreur
- ✅ Design moderne et professionnel

## 🚀 Installation

### Prérequis
- Un serveur web (Apache, Nginx, ou serveur de développement)
- Backend API Spring Boot en cours d'exécution sur `http://localhost:8080`

### Étapes d'installation

1. **Extraire le fichier ZIP**
   ```bash
   unzip imtech-educ-frontend.zip
   cd imtech-educ-frontend
   ```

2. **Configurer l'URL de l'API**
   
   Ouvrir le fichier `configuration/config.js` et modifier si nécessaire :
   ```javascript
   const API_BASE_URL = 'http://localhost:8080/api';
   ```

3. **Déployer l'application**

   **Option A : Serveur de développement Python**
   ```bash
   python3 -m http.server 8000
   ```
   Accéder à : `http://localhost:8000`

   **Option B : Serveur Apache/Nginx**
   Copier tous les fichiers dans le répertoire web de votre serveur :
   ```bash
   cp -r * /var/www/html/imtech-educ/
   ```

   **Option C : Visual Studio Code Live Server**
   - Installer l'extension "Live Server"
   - Clic droit sur `index.html` → "Open with Live Server"

## 📁 Structure du Projet

```
imtech-educ-frontend/
├── index.html                 # Page de connexion
├── auth.js                    # Logique d'authentification
├── styles.css                 # Styles globaux
│
├── configuration/
│   └── config.js             # Configuration de l'API
│
├── css/
│   └── admin.css             # Styles de l'interface admin
│
├── js/
│   ├── admin-utils.js        # Utilitaires communs
│   ├── eleves.js             # Gestion des élèves
│   ├── classes.js            # Gestion des classes
│   ├── annees-scolaires.js   # Gestion des années scolaires
│   ├── matieres.js           # Gestion des matières
│   ├── trimestres.js         # Gestion des trimestres
│   ├── examens.js            # Gestion des examens
│   ├── notes.js              # Gestion des notes
│   ├── absences.js           # Gestion des absences
│   ├── tarifs.js             # Gestion des tarifs
│   └── inscriptions.js       # Gestion des inscriptions
│
├── admin/
│   ├── eleves.html           # Interface élèves
│   ├── classes.html          # Interface classes
│   ├── annees-scolaires.html # Interface années scolaires
│   ├── matieres.html         # Interface matières
│   ├── trimestres.html       # Interface trimestres
│   ├── examens.html          # Interface examens
│   ├── notes.html            # Interface notes
│   ├── absences.html         # Interface absences
│   ├── tarifs.html           # Interface tarifs
│   └── inscriptions.html     # Interface inscriptions
│
└── superadmin/
    └── (pages superadmin si nécessaire)
```

## 🔑 Connexion

### Comptes par défaut
Utilisez les identifiants configurés dans votre backend :

**Administrateur**
- Nom d'utilisateur : `admin`
- Mot de passe : `[votre mot de passe]`
- Rôle : ADMIN

**Super Administrateur**
- Nom d'utilisateur : `superadmin`
- Mot de passe : `[votre mot de passe]`
- Rôle : SUPERADMIN

## 🎨 Personnalisation

### Couleurs du thème
Modifier les variables CSS dans `styles.css` :
```css
:root {
    --primary-color: #4361ee;
    --primary-dark: #3a0ca3;
    --success-color: #06d6a0;
    --danger-color: #ef476f;
    --warning-color: #ffd60a;
}
```

### Logo et nom de l'établissement
Modifier dans chaque fichier HTML la section sidebar-header :
```html
<div class="sidebar-header">
    <h1><i class="fas fa-graduation-cap"></i> VOTRE NOM</h1>
    <p>Votre slogan</p>
</div>
```

## 📊 Export CSV

Toutes les pages incluent une fonctionnalité d'export CSV. Cliquez simplement sur le bouton "Export CSV" pour télécharger les données au format CSV avec encodage UTF-8.

## 🔧 Configuration Backend

L'application s'attend à recevoir les réponses suivantes du backend :

### Format de réponse standard
```json
{
    "status": "success|exist|introuvable|erreur",
    "message": "données ou message d'erreur"
}
```

### En-têtes requis
```
Content-Type: application/json
Authorization: Bearer [token]
X-TenantID: default_db_gestionecole
```

## 🐛 Dépannage

### L'application ne se connecte pas au backend
1. Vérifier que le backend est démarré sur `http://localhost:8080`
2. Vérifier la configuration CORS dans le backend
3. Vérifier la console du navigateur (F12) pour les erreurs

### Les données ne s'affichent pas
1. Ouvrir la console du navigateur (F12)
2. Vérifier les erreurs réseau dans l'onglet "Network"
3. Vérifier que les endpoints de l'API correspondent

### Erreur d'authentification
1. Vérifier que le token est correctement stocké dans le localStorage
2. Vérifier que le backend accepte le token
3. Essayer de se déconnecter et se reconnecter

## 📱 Compatibilité

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile iOS Safari
- ✅ Mobile Chrome Android

## 🔒 Sécurité

- Les tokens JWT sont stockés dans le localStorage
- Toutes les requêtes API incluent le token d'authentification
- Vérification automatique de l'authentification sur chaque page
- Redirection automatique vers la page de connexion si non authentifié

## 📝 Notes Importantes

1. **Données des élèves** : Tous les champs du modèle Eleve sont présents dans le formulaire
2. **Relations** : Les sélecteurs pour les relations (classe, matière, etc.) sont dynamiques
3. **Validation** : La validation côté frontend est complétée par la validation backend
4. **Persistence** : Aucune donnée n'est stockée localement (sauf le token)

## 🆘 Support

Pour toute question ou problème :
1. Vérifier la documentation du backend
2. Consulter la console du navigateur pour les erreurs
3. Vérifier les logs du serveur backend

## 📄 Licence

© 2025 IMTECH-Educ. Tous droits réservés.

## 🔄 Mises à jour

### Version 1.0.0 (2025-01-05)
- Version initiale
- CRUD complet pour toutes les entités
- Export CSV
- Interface responsive
- Authentification sécurisée
