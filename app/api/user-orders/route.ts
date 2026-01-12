import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Get Firebase UID from query params
        const { searchParams } = new URL(req.url);
        const firebaseUid = searchParams.get('firebaseUid');

        if (!firebaseUid) {
            return NextResponse.json(
                { error: 'Missing user ID' },
                { status: 400 }
            );
        }

        console.log('Fetching paid orders for user:', firebaseUid);

        // Find all paid orders for this user
        const orders = await Order.find({
            userId: firebaseUid,
            status: 'paid',
        })
            .populate('productId')
            .sort({ createdAt: -1 });

        console.log('Found paid orders:', { userId: firebaseUid, count: orders.length, orderIds: orders.map(o => o._id) });

        // Format response with product details
        // Filter out orders where product is null/undefined (product was deleted)
        const purchasedBooks = orders
            .filter((order) => {
                if (!order.productId) {
                    console.warn('Skipping order with missing product:', { orderId: order._id });
                    return false;
                }
                return true;
            })
            .map((order) => {
                const product = order.productId as any;
                return {
                    orderId: order._id,
                    productId: product._id,
                    title: product.title,
                    description: product.description,
                    imageUrl: product.imageUrl,
                    price: order.amount,
                    purchaseDate: order.createdAt,
                    downloadToken: order.downloadToken,
                };
            });

        console.log('Returning purchased books:', { count: purchasedBooks.length });
        return NextResponse.json({ books: purchasedBooks });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
