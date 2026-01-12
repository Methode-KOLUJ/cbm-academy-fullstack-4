import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import axios from 'axios';
import crypto from 'crypto';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    try {
        const { id } = await params;
        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
        }

        // Check status with Pawapay if pending and has depositId
        if (order.status === 'pending' && order.depositId) {
            const pawapayBaseUrl = "https://api.pawapay.io";
            const pawapayApiKey = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIxMDQiLCJtYXYiOiIxIiwiZXhwIjoyMDgyNTUxMzY3LCJpYXQiOjE3NjcwMTg1NjcsInBtIjoiREFGLFBBRiIsImp0aSI6IjkzYmRkNGNkLWExYmQtNGU5ZS1hMDkwLWQxMGUwYmI0YTNjMCJ9.H3wX9zgKidXtKsADSSevGwXHjAlPFPbo7H0KzbwiyXITLcfrltzLdAGqiCdEehjeB4pkQ37d-EJ7pIDEeMBTxg";

            try {
                console.log(`Checking Pawapay status for deposit ${order.depositId}...`);
                const response = await axios.get(`${pawapayBaseUrl}/v2/deposits/${order.depositId}`, {
                    headers: {
                        'Authorization': `Bearer ${pawapayApiKey}`,
                        'Content-Type': 'application/json'
                    }
                });

                // Pawapay returns { status: "FOUND", data: { status: "COMPLETED", ... } }
                // We need the inner status from the data object
                const status = response.data.data?.status || response.data.status;
                const failureReason = response.data.data?.failureReason || response.data.failureReason;

                console.log(`Pawapay actual status for ${order._id}: ${status}`);
                console.log('Pawapay full response:', JSON.stringify(response.data, null, 2));

                if (status === 'COMPLETED') {
                    order.status = 'paid';
                    order.pawapayStatus = status;
                    // Generate token
                    const token = crypto.randomBytes(32).toString('hex');
                    order.downloadToken = token;
                    order.downloadTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
                    await order.save();
                } else if (status === 'FAILED' || status === 'CANCELLED') {
                    order.status = 'failed';
                    order.pawapayStatus = status;
                    await order.save();
                }
            } catch (err) {
                console.error('Error checking Pawapay status:', err);
                // Continue to return existing order status if check fails
            }
        }

        // Only return necessary fields
        return NextResponse.json({
            _id: order._id,
            status: order.status,
            downloadToken: order.downloadToken,
        });
    } catch (error) {
        console.error('Order fetch error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
