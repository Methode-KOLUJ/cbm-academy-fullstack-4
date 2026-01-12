import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getFile } from '@/lib/gridfs';
import mongoose from 'mongoose';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    await dbConnect();
    try {
        const { token } = await params;

        // Find order with this token (no expiration check for unlimited downloads)
        const order = await Order.findOne({
            downloadToken: token,
            status: 'paid',
        });

        if (!order) {
            return new NextResponse('Invalid download link', { status: 403 });
        }

        const product = await Product.findById(order.productId);
        if (!product || !product.pdfUrl) {
            return new NextResponse('Product file not found', { status: 404 });
        }

        // Increment download count
        await Product.findByIdAndUpdate(order.productId, { $inc: { downloadCount: 1 } });

        // Sanitize filename for legacy browsers (ASCII only)
        const safeFilename = product.title.replace(/[^a-zA-Z0-9\s-]/g, '').trim() || 'document';

        // Prepare filename for modern browsers (UTF-8)
        const filename = `${product.title}.pdf`;
        // Encode filename to support special characters (accents, emojis, etc.)
        const encodedFilename = encodeURIComponent(filename).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16));

        // Handle external URLs (e.g. Cloudinary)
        if (product.pdfUrl.startsWith('http')) {
            const response = await fetch(product.pdfUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch external file: ${response.statusText}`);
            }

            return new NextResponse(response.body, {
                headers: {
                    'Content-Type': response.headers.get('Content-Type') || 'application/pdf',
                    'Content-Disposition': `attachment; filename="${safeFilename}.pdf"; filename*=UTF-8''${encodedFilename}`,
                },
            });
        }

        // Validate GridFS ID
        if (!mongoose.Types.ObjectId.isValid(product.pdfUrl)) {
            throw new Error(`Invalid file ID format: ${product.pdfUrl}`);
        }

        const { file, stream: downloadStream } = await getFile(product.pdfUrl);

        const stream = new ReadableStream({
            start(controller) {
                downloadStream.on('data', (chunk) => controller.enqueue(chunk));
                downloadStream.on('end', () => controller.close());
                downloadStream.on('error', (err) => controller.error(err));
            },
        });

        return new NextResponse(stream, {
            headers: {
                'Content-Type': (file?.metadata?.contentType || file?.contentType || 'application/pdf'),
                'Content-Disposition': `attachment; filename="${safeFilename}.pdf"; filename*=UTF-8''${encodedFilename}`,
            },
        });

    } catch (error: any) {
        console.error('Download error:', error);
        return new NextResponse(`Internal server error: ${error.message}`, { status: 500 });
    }
}
