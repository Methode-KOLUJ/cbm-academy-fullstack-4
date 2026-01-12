import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import axios from 'axios';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const { productId, firebaseUid, phoneNumber } = await req.json();

        // Require authentication
        if (!firebaseUid || !phoneNumber) {
            return NextResponse.json(
                { error: 'L\'authentification est requise' },
                { status: 401 }
            );
        }

        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json({ error: 'Le produit n\'a pas été trouvé' }, { status: 404 });
        }

        const depositId = crypto.randomUUID();

        // Create pending order linked to user
        const order = await Order.create({
            userId: firebaseUid,
            phoneNumber: phoneNumber,
            productId: product._id,
            amount: product.price,
            status: 'pending',
            depositId: depositId
        });

        // Pawapay Configuration
        const pawapayBaseUrl = "https://api.pawapay.io";
        const pawapayApiKey = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIxMDQiLCJtYXYiOiIxIiwiZXhwIjoyMDgyNTUxMzY3LCJpYXQiOjE3NjcwMTg1NjcsInBtIjoiREFGLFBBRiIsImp0aSI6IjkzYmRkNGNkLWExYmQtNGU5ZS1hMDkwLWQxMGUwYmI0YTNjMCJ9.H3wX9zgKidXtKsADSSevGwXHjAlPFPbo7H0KzbwiyXITLcfrltzLdAGqiCdEehjeB4pkQ37d-EJ7pIDEeMBTxg";

        if (!pawapayApiKey) {
            console.error('Pawapay API Key missing');
            return NextResponse.json({ error: 'Configuration de paiement manquante' }, { status: 500 });
        }

        // Determine provider based on phone number (Simple logic for DRC)
        let provider = 'VODACOM_COD'; // Default
        const cleanPhone = phoneNumber.replace(/\D/g, '');

        if (cleanPhone.startsWith('243')) {
            const prefix = cleanPhone.substring(3, 5);
            if (['81', '82', '83'].includes(prefix)) provider = 'VODACOM_COD';
            else if (['99', '97'].includes(prefix)) provider = 'AIRTEL_COD';
            else if (['84', '85', '89', '80'].includes(prefix)) provider = 'ORANGE_COD';
            else if (['90'].includes(prefix)) provider = 'AFRICELL_COD';
        }

        // Prepare Pawapay payload
        const payload = {
            depositId: depositId,
            payer: {
                type: "MMO",
                accountDetails: {
                    phoneNumber: cleanPhone,
                    provider: provider
                }
            },
            amount: product.price.toString(),
            currency: "USD",
            customerMessage: `Order ${order._id}`.substring(0, 20), // Limit to 20 chars
            metadata: [
                { orderId: order._id.toString() }
            ]
        };

        console.log('Initiating Pawapay deposit:', { url: `${pawapayBaseUrl}/v2/deposits`, payload });

        // Call Pawapay
        try {
            const response = await axios.post(`${pawapayBaseUrl}/v2/deposits`, payload, {
                headers: {
                    'Authorization': `Bearer ${pawapayApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const { status } = response.data;
            console.log('Pawapay response:', response.data);

            if (status === 'ACCEPTED' || status === 'DUPLICATE_IGNORED') {
                return NextResponse.json({
                    success: true,
                    orderId: order._id,
                    message: "Paiement initié. Veuillez valider sur votre téléphone."
                });
            } else {
                return NextResponse.json({ error: `Erreur Pawapay: ${status}` }, { status: 400 });
            }

        } catch (pawapayError: any) {
            console.error('Pawapay Error:', pawapayError.response?.data || pawapayError.message);
            return NextResponse.json({
                error: 'Erreur lors de l\'initiation du paiement',
                details: pawapayError.response?.data
            }, { status: 500 });
        }

    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
