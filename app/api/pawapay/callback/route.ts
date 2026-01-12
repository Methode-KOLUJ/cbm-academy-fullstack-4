import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        console.log('Pawapay Callback received:', body);

        const { depositId, status, failureReason } = body;

        if (!depositId || !status) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const order = await Order.findOne({ depositId });

        if (!order) {
            console.error('Order not found for depositId:', depositId);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Update Pawapay status
        order.pawapayStatus = status;

        if (status === 'COMPLETED') {
            if (order.status !== 'paid') {
                order.status = 'paid';
                // Generate secure download token
                const token = crypto.randomBytes(32).toString('hex');
                order.downloadToken = token;
                order.downloadTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
                await order.save();
                console.log('Order paid:', order._id);
            }
        } else if (status === 'FAILED' || status === 'CANCELLED') {
            order.status = 'failed';
            console.log(`Order ${status}:`, order._id, failureReason);
            await order.save();
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Callback error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
