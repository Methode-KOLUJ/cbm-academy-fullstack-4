import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

/**
 * DEV ONLY: Debug endpoint to check order status
 * Usage: GET /api/debug/orders?userId=<firebaseUid>&orderId=<mongodb-id>
 */
export async function GET(req: NextRequest) {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
            { error: 'Debug endpoints are not available in production' },
            { status: 403 }
        );
    }

    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const orderId = searchParams.get('orderId');

        const result: any = {};

        if (orderId) {
            const order = await Order.findById(orderId);
            result.orderById = {
                found: !!order,
                order: order ? {
                    _id: order._id,
                    userId: order.userId,
                    status: order.status,
                    downloadToken: order.downloadToken ? order.downloadToken.substring(0, 8) + '...' : null,
                    transactionId: order.transactionId,
                    createdAt: order.createdAt,
                } : null,
            };
        }

        if (userId) {
            const allOrders = await Order.find({ userId });
            const paidOrders = await Order.find({ userId, status: 'paid' });
            
            result.ordersByUserId = {
                userId,
                total: allOrders.length,
                paid: paidOrders.length,
                orders: allOrders.map(o => ({
                    _id: o._id,
                    status: o.status,
                    amount: o.amount,
                    downloadToken: o.downloadToken ? o.downloadToken.substring(0, 8) + '...' : null,
                    createdAt: o.createdAt,
                })),
            };
        }

        if (!orderId && !userId) {
            result.allOrders = {
                total: await Order.countDocuments(),
                paid: await Order.countDocuments({ status: 'paid' }),
                pending: await Order.countDocuments({ status: 'pending' }),
            };
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Debug error:', error);
        return NextResponse.json(
            { error: 'Debug query failed', details: (error as any).message },
            { status: 500 }
        );
    }
}
