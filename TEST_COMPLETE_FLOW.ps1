#!/usr/bin/env powershell
# Script complet de test du flux d'achat avec /my-books

param(
    [string]$BaseUrl = "http://localhost:3000",
    [string]$FirebaseUid = "",
    [string]$OrderId = ""
)

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  TEST COMPLET: Achat → Paiement → /my-books              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

if (!$FirebaseUid) {
    Write-Host "`n❌ FirebaseUid requis!" -ForegroundColor Red
    Write-Host "Usage: .\TEST_PAYMENT_FLOW.ps1 -FirebaseUid 'votre-uid' -OrderId 'commande-id'"
    exit 1
}

if (!$OrderId) {
    Write-Host "`n❌ OrderId requis!" -ForegroundColor Red
    Write-Host "Usage: .\TEST_PAYMENT_FLOW.ps1 -FirebaseUid 'votre-uid' -OrderId 'commande-id'"
    exit 1
}

Write-Host "`n📋 Paramètres:" -ForegroundColor Yellow
Write-Host "  Base URL: $BaseUrl"
Write-Host "  Firebase UID: $FirebaseUid"
Write-Host "  Order ID: $OrderId"
Write-Host ""

# Étape 1: Vérifier l'ordre en DB
Write-Host "1️⃣  Vérifier l'ordre dans la DB..." -ForegroundColor Green
$debugUrl = "$BaseUrl/api/debug/orders?orderId=$OrderId"
Write-Host "   GET $debugUrl" -ForegroundColor Gray
$orderDebug = Invoke-RestMethod -Uri $debugUrl -ErrorAction Continue
Write-Host "   Réponse:" -ForegroundColor Gray
$orderDebug | ConvertTo-Json | Write-Host

# Étape 2: Simuler le paiement réussi
Write-Host "`n2️⃣  Simuler le paiement réussi..." -ForegroundColor Green
$paymentUrl = "$BaseUrl/api/test/simulate-payment?orderId=$OrderId"
Write-Host "   POST $paymentUrl" -ForegroundColor Gray
$paymentResult = Invoke-RestMethod -Uri $paymentUrl -Method Post -ErrorAction Continue
Write-Host "   Réponse:" -ForegroundColor Gray
$paymentResult | ConvertTo-Json | Write-Host

# Étape 3: Vérifier l'ordre après paiement
Write-Host "`n3️⃣  Vérifier l'ordre après paiement..." -ForegroundColor Green
$debugUrl2 = "$BaseUrl/api/debug/orders?orderId=$OrderId"
Write-Host "   GET $debugUrl2" -ForegroundColor Gray
$orderAfter = Invoke-RestMethod -Uri $debugUrl2 -ErrorAction Continue
Write-Host "   Réponse:" -ForegroundColor Gray
$orderAfter | ConvertTo-Json | Write-Host

# Étape 4: Vérifier les commandes de l'utilisateur
Write-Host "`n4️⃣  Vérifier les commandes payées de l'utilisateur..." -ForegroundColor Green
$userOrdersUrl = "$BaseUrl/api/user-orders?firebaseUid=$FirebaseUid"
Write-Host "   GET $userOrdersUrl" -ForegroundColor Gray
$userOrders = Invoke-RestMethod -Uri $userOrdersUrl -ErrorAction Continue
Write-Host "   Réponse:" -ForegroundColor Gray
$userOrders | ConvertTo-Json -Depth 5 | Write-Host

# Étape 5: Résumé
Write-Host "`n" -ForegroundColor Gray
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ TEST RÉSUMÉ" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan

if ($orderAfter.orderById.order.status -eq "paid") {
    Write-Host "✅ Commande marquée comme PAYÉE" -ForegroundColor Green
} else {
    Write-Host "❌ Commande PAS marquée comme payée (status: $($orderAfter.orderById.order.status))" -ForegroundColor Red
}

if ($orderAfter.orderById.order.downloadToken) {
    Write-Host "✅ Token de téléchargement GÉNÉRÉ" -ForegroundColor Green
} else {
    Write-Host "❌ Token de téléchargement MANQUANT" -ForegroundColor Red
}

if ($userOrders.books -and $userOrders.books.Count -gt 0) {
    Write-Host "✅ Livre trouvé dans /api/user-orders ($($userOrders.books.Count) livre(s))" -ForegroundColor Green
} else {
    Write-Host "❌ Aucun livre trouvé dans /api/user-orders" -ForegroundColor Red
}

Write-Host "`n📖 Livre dans /my-books:" -ForegroundColor Yellow
if ($userOrders.books) {
    foreach ($book in $userOrders.books) {
        Write-Host "  - $($book.title) (prix: $($book.price))" -ForegroundColor Cyan
    }
}

Write-Host "`n" -ForegroundColor Gray
Write-Host "🌐 Liens à tester:" -ForegroundColor Yellow
Write-Host "  1. Page paiement: $BaseUrl/order/$OrderId" -ForegroundColor Cyan
Write-Host "  2. Mes livres: $BaseUrl/my-books?success=true&orderId=$OrderId" -ForegroundColor Cyan
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
