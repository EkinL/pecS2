# Payment Platform Frontend

Une application Vue.js moderne pour la gestion des paiements, similaire à Stripe.

## 🚀 Démarrage rapide

### Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn
- Backend API fonctionnant sur le port 3001

### Installation

1. **Cloner le repository**
   \`\`\`bash
   git clone <repository-url>
   cd payment-platform-frontend
   \`\`\`

2. **Installer les dépendances**
   \`\`\`bash
   npm install
   \`\`\`

3. **Démarrer le serveur de développement**
   \`\`\`bash
   npm run dev
   \`\`\`

   L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 📋 Scripts disponibles

- \`npm run dev\` - Démarre le serveur de développement avec hot-reload
- \`npm run build\` - Construit l'application pour la production
- \`npm run preview\` - Prévisualise la version de production
- \`npm run lint\` - Vérifie la qualité du code avec ESLint
- \`npm run lint:fix\` - Corrige automatiquement les erreurs ESLint

## 🛠️ Technologies utilisées

- **Vue.js 3** - Framework JavaScript progressif
- **Vue Router 4** - Routage officiel pour Vue.js
- **Vuex 4** - Gestion d'état centralisée
- **Vite** - Outil de build rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **Axios** - Client HTTP
- **Lucide Vue** - Icônes modernes

## 📁 Structure du projet

\`\`\`
src/
├── components/          # Composants réutilisables
│   ├── common/         # Composants communs
│   ├── layout/         # Composants de mise en page
│   └── modals/         # Composants modaux
├── router/             # Configuration du routage
├── services/           # Services API
├── store/              # Gestion d'état Vuex
│   └── modules/        # Modules Vuex
├── views/              # Pages/Vues
│   ├── auth/          # Pages d'authentification
│   ├── client/        # Pages client
│   └── merchant/      # Pages marchand
├── style.css          # Styles globaux
└── main.js            # Point d'entrée
\`\`\`

## 🔧 Configuration

### Variables d'environnement

Créez un fichier \`.env.local\` à la racine du projet :

\`\`\`env
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=PaymentPro
\`\`\`

### Proxy API

Le serveur de développement est configuré pour proxifier les requêtes API vers \`http://localhost:3001\`.

## 📱 Fonctionnalités

### 🔐 Authentification
- Connexion marchand via **client_id** et **client_secret**
- Inscription/Connexion pour marchands et clients
- Gestion automatique des tokens JWT
- Refresh token automatique
- Protection des routes par rôle

### 👨‍💼 Interface Marchand
- Dashboard avec statistiques en temps réel
- Gestion complète des paiements (CRUD)
- Création de nouveaux paiements
- Génération de credentials API
- Validation/Annulation des transactions

### 👤 Interface Client
- Dashboard personnel
- Historique complet des achats
- Profil utilisateur modifiable

### 🎨 Interface utilisateur
- Design responsive (mobile-first)
- Thème moderne avec Tailwind CSS
- Notifications toast en temps réel
- États de chargement et erreurs
- Modales interactives
- Animations fluides

## 🔄 Hot Reload

Le serveur de développement inclut le hot-reload automatique :
- Rechargement instantané des modifications CSS
- Rechargement des composants Vue sans perdre l'état
- Rechargement complet pour les modifications de configuration

## 🧪 Développement

### Linting et formatage

Le projet utilise ESLint et Prettier pour maintenir la qualité du code :

\`\`\`bash
# Vérifier le code
npm run lint

# Corriger automatiquement
npm run lint:fix
\`\`\`

### Extensions VS Code recommandées

- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint

## 🚀 Déploiement

### Build de production

\`\`\`bash
npm run build
\`\`\`

Les fichiers optimisés seront générés dans le dossier \`dist/\`.

### Prévisualisation

\`\`\`bash
npm run preview
\`\`\`

## 🐛 Dépannage

### Port déjà utilisé
Si le port 3000 est occupé, Vite utilisera automatiquement le port suivant disponible.

### Problèmes de CORS
Assurez-vous que votre backend autorise les requêtes depuis \`http://localhost:3000\`.

### Hot reload ne fonctionne pas
Vérifiez que votre firewall n'bloque pas les connexions WebSocket.

## 📞 Support

Pour toute question ou problème :
1. Vérifiez la documentation
2. Consultez les issues GitHub
3. Contactez l'équipe de développement

## 📄 Licence

Ce projet est sous licence MIT.
\`\`\`

Fichier d'environnement d'exemple :
