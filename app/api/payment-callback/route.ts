import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        // Verify signature or status from MaishaPay
        // This depends heavily on MaishaPay's webhook format.
        // Assuming body contains { reference, status, transaction_id }

        const { reference, status, transaction_id } = body;

        console.log('POST Callback received:', { reference, status, transaction_id });

        if (status === 'successful' || status === 'success') { // Adjust based on actual API
            const order = await Order.findById(reference);
            console.log('Commande introuvable:', { orderId: reference, exists: !!order });
            
            if (order) {
                order.status = 'paid';
                order.transactionId = transaction_id;

                // Generate secure download token
                const token = crypto.randomBytes(32).toString('hex');
                order.downloadToken = token;
                // Token valid for 24 hours
                order.downloadTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

                await order.save();
                console.log('Order updated to paid:', { orderId: reference, token: token.substring(0, 8) + '...', userId: order.userId });
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Callback error:', error);
        return NextResponse.json({ error: 'Callback failed' }, { status: 500 });
    }
}
export async function GET(req: NextRequest) {
    // MaishaPay might redirect here if returnUrl is not used or configured.
    // We should try to find the order and redirect the user to the order page.

    const { searchParams } = new URL(req.url);
    console.log('GET Callback received. Params:', Object.fromEntries(searchParams));

    // Check for orderId (added by us in checkout)
    const orderId = searchParams.get('orderId');
    if (orderId) {
        // If the provider redirected with a status parameter (e.g. ?status=200),
        // treat that as a possible immediate confirmation and update the order.
        const status = searchParams.get('status');
        const transaction_id = searchParams.get('transaction_id') || searchParams.get('transactionId') || undefined;
        try {
            if (status && (status === '200' || status === 'success' || status === 'successful')) {
                const order = await Order.findById(orderId);
                console.log('GET: Order found:', { orderId, exists: !!order, currentStatus: order?.status });
                
                if (order && order.status !== 'paid') {
                    order.status = 'paid';
                    if (transaction_id) order.transactionId = transaction_id;
                    // Generate secure download token
                    const token = crypto.randomBytes(32).toString('hex');
                    order.downloadToken = token;
                    order.downloadTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
                    await order.save();
                    console.log('GET: Order updated to paid:', { orderId, userId: order.userId, token: token.substring(0, 8) + '...' });
                }
            }
        } catch (err) {
            console.error('Erreur lors de la mise à jour de la commande', err);
        }

        return NextResponse.redirect(new URL(`/order/${orderId}`, req.url));
    }

    // Fallback: Check for reference
    const reference = searchParams.get('reference');
    if (reference) {
        // Same handling as orderId: if provider included status, update order
        const status = searchParams.get('status');
        const transaction_id = searchParams.get('transaction_id') || searchParams.get('transactionId') || undefined;
        try {
            if (status && (status === '200' || status === 'success' || status === 'successful')) {
                const order = await Order.findById(reference);
                console.log('GET (reference): Order found:', { reference, exists: !!order, currentStatus: order?.status });
                
                if (order && order.status !== 'paid') {
                    order.status = 'paid';
                    if (transaction_id) order.transactionId = transaction_id;
                    const token = crypto.randomBytes(32).toString('hex');
                    order.downloadToken = token;
                    order.downloadTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
                    await order.save();
                    console.log('GET (reference): Order updated to paid:', { reference, userId: order.userId, token: token.substring(0, 8) + '...' });
                }
            }
        } catch (err) {
            console.error('Error updating order on GET callback (reference):', err);
        }

        return NextResponse.redirect(new URL(`/order/${reference}`, req.url));
    }

    // If we can't identify the order, redirect to home
    return NextResponse.redirect(new URL('/', req.url));
}
