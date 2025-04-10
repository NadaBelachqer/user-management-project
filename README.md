# User Management System


## 📦 Stack Technique
- **Backend** : Node.js 18 + Express + MySQL 8
- **Frontend** : React 18 + Axios
- **Infrastructure** : Docker + Docker Compose

## 🚀 Installation

### Prérequis
- Docker 20+
- Node.js 18+

### 1. Configuration initiale
```bash
git clone https://github.com/votre_user/user-management-project.git
cd user-management-project
cp .env.example .env
```

### 2. Lancer avec Docker
```bash
docker-compose up --build
```

### 3. Accès aux services
- API : http://localhost:5000
- Frontend : http://localhost:3000
- PhpMyAdmin : http://localhost:8080 (optionnel)

## 🧪 Tests
```bash
# Tests unitaires
docker-compose exec backend npm test

# Tests avec couverture
docker-compose exec backend npm run test:cov
```

## 🌐 Endpoints API
Voir la [documentation complète de l'API](API_DOCUMENTATION.md)

## 🔧 Déploiement
Configurez ces secrets dans GitHub Actions :
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `SSH_PRIVATE_KEY`
