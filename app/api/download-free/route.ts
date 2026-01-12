
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FreeDownload from '@/models/FreeDownload';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const file = searchParams.get('file');

    if (!file) {
        return new NextResponse('File parameter missing', { status: 400 });
    }

    await dbConnect();

    try {
        // Find or create a global counter for free downloads in the dedicated collection
        await FreeDownload.findOneAndUpdate(
            { slug: 'global-free-counter' },
            {
                $inc: { count: 1 },
                $set: {
                    title: "Compteur Global Téléchargements Gratuits",
                    env: process.env.NODE_ENV || 'development'
                }
            },
            { upsert: true, new: true }
        );

        // Construct the full URL for the file
        // Assumes 'file' is a relative path like '/pdf/book.pdf'
        const fileUrl = new URL(file, req.url);

        return NextResponse.redirect(fileUrl);

    } catch (error) {
        console.error('Error tracking free download:', error);
        // Fallback: still redirect even if tracking fails, to not block the user
        const fileUrl = new URL(file, req.url);
        return NextResponse.redirect(fileUrl);
    }
}
