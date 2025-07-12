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

## Annexe : Capture d'Ecran du Frontend
<img width="692" height="364" alt="Capture d'écran 2025-07-12 012715" src="https://github.com/user-attachments/assets/d4b53c9e-b5a6-4621-99b7-f93fa8a69dbf" />
<img width="671" height="327" alt="Capture d'écran 2025-07-12 012837" src="https://github.com/user-attachments/assets/c23af10a-2f8b-40b1-bf19-c4c6bad3de3c" />
<img width="705" height="312" alt="Capture d'écran 2025-07-12 012750" src="https://github.com/user-attachments/assets/cf9bd228-bc59-4b92-bc25-f099576d17d8" />
<img width="674" height="320" alt="Capture d'écran 2025-07-12 012903" src="https://github.com/user-attachments/assets/bf6b017e-758d-4721-8b81-7a86466c9e45" />
<img width="695" height="365" alt="Capture d'écran 2025-07-12 012931" src="https://github.com/user-attachments/assets/a490c800-8812-44b0-95bd-ca97c4d7ab1b" />




