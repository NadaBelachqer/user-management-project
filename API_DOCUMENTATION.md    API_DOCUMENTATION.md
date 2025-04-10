# API Documentation - User Management

## 🔑 Authentification
Non requise pour ce projet (API ouverte)

## 📋 Schema User
```json
{
  "id": "integer",
  "firstname": "string",
  "lastname": "string",
  "email": "string (unique)",
  "city": "string",
  "created_at": "timestamp"
}
```

## 📌 Endpoints

### GET `/api/users`
**Response:**
```json
[
  {
    "id": 1,
    "firstname": "user",
    "lastname": "user",
    "email": "user@example.com",
    "city": "user_city"
  }
]
```

### POST `/api/users`
**Request:**
```json
{
  "firstname": "Nouveau",
  "lastname": "Utilisateur",
  "email": "nouveau@example.com",
  "city": "Lyon"
}
```

**Response (201):**
```json
{
  "id": 2,
  "firstname": "Nouveau",
  "lastname": "Utilisateur",
  "email": "nouveau@example.com",
  "city": "Lyon"
}
```

## 🚨 Codes d'erreur
- `400` : Données invalides
- `404` : Utilisateur non trouvé
- `500` : Erreur serveur

## 🛠 Exemple avec cURL
```bash
# Récupérer tous les utilisateurs
curl http://localhost:5000/api/users

# Créer un utilisateur
curl -X POST -H "Content-Type: application/json" \
  -d '{"firstname":"Test","lastname":"User","email":"test@example.com","city":"Marseille"}' \
  http://localhost:5000/api/users
```
