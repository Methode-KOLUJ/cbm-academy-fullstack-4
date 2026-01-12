import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FreeDownload from '@/models/FreeDownload';

export async function GET() {
    await dbConnect();
    try {
        const stats = await FreeDownload.findOne({ slug: 'global-free-counter' });
        return NextResponse.json({ count: stats ? stats.count : 0 });
    } catch (error) {
        return NextResponse.json({ count: 0 });
    }
}
