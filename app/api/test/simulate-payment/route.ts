import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import crypto from 'crypto';

/**
 * DEV ONLY: Simulate a successful payment for testing
 * Usage: POST /api/test/simulate-payment?orderId=<mongodb-id>
 * This endpoint marks an order as paid and generates a download token.
 * WARNING: Remove this endpoint in production!
 */
export async function POST(req: NextRequest) {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
            { error: 'Test endpoints are not available in production' },
            { status: 403 }
        );
    }

    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get('orderId');

        if (!orderId) {
            return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Mark as paid
        order.status = 'paid';
        order.transactionId = `TEST_TXN_${Date.now()}`;

        // Generate download token
        const token = crypto.randomBytes(32).toString('hex');
        order.downloadToken = token;
        order.downloadTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await order.save();

        return NextResponse.json({
            success: true,
            message: 'Order marked as paid (test only)',
            order: {
                _id: order._id,
                status: order.status,
                downloadToken: order.downloadToken,
                userId: order.userId,
            },
            redirectUrl: `/order/${orderId}?status=200`,
        });
    } catch (error) {
        console.error('Test payment simulation error:', error);
        return NextResponse.json(
            { error: 'Failed to simulate payment' },
            { status: 500 }
        );
    }
}
