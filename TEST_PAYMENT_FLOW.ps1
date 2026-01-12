#!/usr/bin/env powershell
# Script de test complet du flux d'achat avec auto-téléchargement et my-books

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  TEST: Flux d'achat complet (paiement -> téléchargement)   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"

Write-Host "`n📋 ÉTAPES DE TEST:`n" -ForegroundColor Yellow

Write-Host "1️⃣  Démarrer le serveur Next.js" -ForegroundColor Green
Write-Host "   Exécutez dans un terminal: npm run dev`n"

Write-Host "2️⃣  S'authentifier" -ForegroundColor Green
Write-Host "   - Aller à: $baseUrl"
Write-Host "   - Cliquer sur 'Connexion' (Phone Auth)"
Write-Host "   - Utiliser un numéro de test (ex: +1 555-000-0001)"
Write-Host "   - Recevoir OTP dans console (dev mode)"
Write-Host "   - Entrer l'OTP pour s'authentifier`n"

Write-Host "3️⃣  Acheter un produit" -ForegroundColor Green
Write-Host "   - Aller à: $baseUrl/books"
Write-Host "   - Cliquer 'Acheter' sur un produit"
Write-Host "   - Remplir le formulaire de paiement"
Write-Host "   - Soumettre pour aller à MaishaPay`n"

Write-Host "4️⃣  Simuler le paiement (EN DEV SEULEMENT)" -ForegroundColor Magenta
Write-Host "   Alternative pour tester sans MaishaPay:"
Write-Host "   - Copier l'orderId depuis la page (dans l'URL ou logs)"
Write-Host "   - Appeler: curl -X POST '$baseUrl/api/test/simulate-payment?orderId=<ORDERID>'"
Write-Host "   - La réponse donne redirectUrl"
Write-Host "   - Aller à: $baseUrl/order/<ORDERID>?status=200`n"

Write-Host "5️⃣  Vérifier le flux complet" -ForegroundColor Green
Write-Host "   ✅ Page /order/<id>:"
Write-Host "      - Message 'Paiement Réussi!'"
Write-Host "      - Bouton 'Télécharger PDF'"
Write-Host "      - Redirection auto à /my-books après 2s`n"

Write-Host "   ✅ Page /my-books:"
Write-Host "      - Message vert 'Paiement réussi!'"
Write-Host "      - PDF téléchargé automatiquement"
Write-Host "      - Livre apparaît dans la liste"
Write-Host "      - Lien 'Télécharger' disponible pour futurs téléchargements`n"

Write-Host "6️⃣  Tester avec MaishaPay réel (si configuré)" -ForegroundColor Green
Write-Host "   - Compléter les étapes 1-3 normalement"
Write-Host "   - Compléter le paiement dans MaishaPay"
Write-Host "   - MaishaPay redirige vers /order/<id>?status=200"
Write-Host "   - Le reste du flux se déclenche automatiquement`n"

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan

Write-Host "`n🔍 LOGS À VÉRIFIER:`n" -ForegroundColor Yellow
Write-Host "- Console du navigateur (DevTools):"
Write-Host "  - Fetch vers /api/user-orders réussit"
Write-Host "  - Download vers /api/download/<token> déclenché"
Write-Host "  - Pas d'erreur dans les requêtes API`n"

Write-Host "- Console du serveur Next.js:"
Write-Host "  - 'Error updating order on GET callback' si webhook reçu"
Write-Host "  - 'Error fetching books' si problème Auth`n"

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan

Write-Host "`n⚙️  VARIABLES D'ENVIRONNEMENT REQUISES:`n" -ForegroundColor Yellow
Write-Host "- NEXTAUTH_URL=http://localhost:3000"
Write-Host "- MONGODB_URI=<votre-connexion-mongodb>"
Write-Host "- Firebase: credentials dans .env.local"
Write-Host "- MAISHAPAY_*: optionnel pour simuler, test endpoint est de dev-only`n"

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan

Write-Host "`n💡 NOTES:`n" -ForegroundColor Yellow
Write-Host "- L'endpoint /api/test/simulate-payment n'est activé qu'en DEV"
Write-Host "- En production, seul le webhook MaishaPay réel déclenche le paiement"
Write-Host "- Les tokens de téléchargement expirent après 24h"
Write-Host "- Les PDFs sont stockés dans GridFS et servies dynamiquement`n"

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
