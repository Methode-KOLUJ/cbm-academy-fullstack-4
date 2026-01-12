import { NextRequest, NextResponse } from 'next/server';
import { getFile } from '@/lib/gridfs';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { file, stream: downloadStream } = await getFile(id);

        // Create a ReadableStream from the GridFS download stream
        const stream = new ReadableStream({
            start(controller) {
                downloadStream.on('data', (chunk) => controller.enqueue(chunk));
                downloadStream.on('end', () => controller.close());
                downloadStream.on('error', (err) => controller.error(err));
            },
        });

        return new NextResponse(stream, {
            headers: {
                'Content-Type': (file?.metadata?.contentType || file?.contentType || 'image/jpeg'),
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        return new NextResponse('Image not found', { status: 404 });
    }
}
