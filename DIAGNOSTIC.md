## 🔍 DIAGNOSTIC: Pourquoi /my-books reste vide

Je viens d'ajouter de la logging complète pour tracer le flux. Voici comment diagnostiquer le problème:

### 📋 Étapes de Debug

#### 1️⃣ Vérifier le statut des commandes en DB
```powershell
# Ouvre ton navigateur et consulte:
curl http://localhost:3000/api/debug/orders
```

Regarde:
- `total`: nombre de commandes
- `paid`: nombre de commandes marquées "paid"
- `pending`: nombre de commandes en attente

Exemple de réponse:
```json
{
  "allOrders": {
    "total": 3,
    "paid": 1,
    "pending": 2
  }
}
```

#### 2️⃣ Vérifier une commande spécifique
```powershell
# Remplace <ORDERID> par l'ID réel de ta commande
curl "http://localhost:3000/api/debug/orders?orderId=<ORDERID>"
```

Regarde:
- `found`: true/false
- `status`: 'pending', 'paid', ou 'failed'
- `downloadToken`: doit être présent si paid
- `userId`: doit avoir une valeur

Exemple:
```json
{
  "orderById": {
    "found": true,
    "order": {
      "_id": "...",
      "userId": "firebase-uid-123",
      "status": "paid",
      "downloadToken": "a1b2c3d4...",
      "transactionId": "TXN123"
    }
  }
}
```

#### 3️⃣ Vérifier les commandes d'un utilisateur
```powershell
# Remplace <FIREBASEUID> par ton Firebase UID
curl "http://localhost:3000/api/debug/orders?userId=<FIREBASEUID>"
```

Regarde:
- `paid`: nombre de commandes payées
- `total`: nombre total de commandes
- L'état de chaque commande

#### 4️⃣ Ouvrir la console du navigateur (DevTools)
Appuie sur **F12** et va dans l'onglet **Console**.

Cherche les logs (en ordre chronologique):
```
// Dans /my-books
"Fetching books for user:" firebase-uid-123
"User orders response status: 200"
"Books received:" [...]

// Ou si succès vient de l'URL
"Success effect triggered:" { justPurchased: 'true', orderId: '...', booksCount: 5 }
"Looking for book:" { orderId: '...', foundBook: true/false }
"Auto-downloading:" { title: '...', token: '...' }
```

#### 5️⃣ Vérifier le flux complet dans les logs du serveur
Regarde la console du terminal où `npm run dev` tourne:

**Après un paiement (GET redirect):**
```
GET Callback received. Params: { orderId: '...', status: '200' }
GET: Order found: { orderId: '...', exists: true, currentStatus: 'pending' }
GET: Order updated to paid: { orderId: '...', userId: 'firebase-uid-123', token: 'a1b2c3d4...' }
```

**Après /my-books charge:**
```
Fetching books for user: firebase-uid-123
Found paid orders: { userId: 'firebase-uid-123', count: 1, orderIds: [...] }
```

---

### 🎯 Causes possibles et solutions

#### ❌ Cause 1: L'ordre n'est pas marqué "paid"
**Symptôme:** `status: 'pending'` dans debug/orders

**Solution:**
1. Vérifier que MaishaPay redirige avec `?status=200`
2. Ou utiliser l'endpoint test: `POST /api/test/simulate-payment?orderId=<id>`

#### ❌ Cause 2: L'userId n'est pas sauvegardé
**Symptôme:** `userId: null` ou `undefined` dans debug/orders

**Solution:**
1. Vérifier que le checkout envoie `firebaseUid`
2. Vérifier que le user est authentifié AVANT d'acheter

#### ❌ Cause 3: L'ordre est paid mais /my-books ne trouve rien
**Symptôme:** 
- Commande marquée paid ✅
- Mais "Books received: []" dans console

**Solution:**
1. Vérifier que le Firebase UID correspond entre:
   - L'ordre dans DB (débug/orders)
   - Le user actuel (`user?.uid` dans DevTools)
2. Vérifier l'Auth correctement configurée

#### ❌ Cause 4: downloadToken manquant
**Symptôme:** `downloadToken: null` dans debug/orders

**Solution:**
1. Le token est généré lors du callback GET/POST
2. Vérifier que le callback s'exécute bien (logs du serveur)

---

### 🚀 Flux complet attendu

```
1. Utilisateur achète (POST /api/checkout)
   → Crée Order avec status='pending', userId=firebase-uid

2. Paiement réussi
   → MaishaPay redirige à /api/payment-callback?orderId=...&status=200
   → Callback marque Order: status='paid', génère downloadToken

3. Redirect vers /order/<id>
   → Page affiche "Paiement Réussi!"
   → Après 2s, redirige vers /my-books?success=true&orderId=...

4. Page /my-books charge
   → Fetche /api/user-orders?firebaseUid=...
   → Trouve la commande paid
   → Auto-télécharge le PDF
   → Affiche le livre dans la liste
```

---

### 📝 Commandes utiles

**Simuler un paiement réussi:**
```powershell
$orderId = "<copie-l-id-de-ta-commande>"
curl -X POST "http://localhost:3000/api/test/simulate-payment?orderId=$orderId"
```

Puis visite: `http://localhost:3000/order/$orderId?status=200`

**Vider la base (DEV ONLY):**
```powershell
# Via MongoDB Compass ou CLI:
db.orders.deleteMany({}) # Supprime TOUTES les commandes
```

---

### 📌 Checklist pour déboguer

- [ ] Vérifier que `npm run dev` est en cours
- [ ] Ouvrir DevTools (F12)
- [ ] Aller sur /my-books et vérifier les logs
- [ ] Vérifier `api/debug/orders` pour voir l'état en DB
- [ ] Vérifier le Firebase UID dans DevTools Console: `console.log(firebase.auth().currentUser.uid)`
- [ ] Vérifier les logs du serveur pour voir les erreurs
- [ ] Essayer `api/test/simulate-payment` si MaishaPay ne fonctionne pas
- [ ] Relancer `npm run dev` après changements

Partage-moi:
1. Ce que retourne `/api/debug/orders`
2. Ce que retourne `/api/debug/orders?userId=<ton-firebase-uid>`
3. Les logs de la console du navigateur (F12)
4. Les logs du serveur
