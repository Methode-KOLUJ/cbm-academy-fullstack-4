import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Check if configuration exists
        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.error("Cloudinary credentials missing");
            return NextResponse.json({ error: 'Configuration Cloudinary manquante' }, { status: 500 });
        }

        // Fetch images from Cloudinary
        // We'll look for images in a folder named 'album' or just recent uploads if that fails
        // You can adjust the expression to filter by tag: 'resource_type:image AND tags=album'
        // Or by folder: 'folder:album'
        // For now we list all images, you might want to create a specific folder in Cloudinary

        const result = await cloudinary.api.resources({
            resource_type: 'image',
            type: 'upload',
            prefix: 'album/', // Looks for images in 'album' folder
            max_results: 500,
            sort_by: 'created_at',
            direction: 'desc'
        });

        // If no images in album folder, try root (fallback)
        // REMOVE THIS FALLBACK if you strictly want the 'album' folder
        let resources = result.resources;
        if (resources.length === 0) {
            console.log("No images in 'album/' folder, fetching recent uploads as fallback");
            const fallbackResult = await cloudinary.api.resources({
                resource_type: 'image',
                type: 'upload',
                max_results: 500,
                sort_by: 'created_at',
                direction: 'desc'
            });
            resources = fallbackResult.resources;
        }

        const images = resources.map((resource: any) => ({
            publicId: resource.public_id,
            url: resource.secure_url,
            width: resource.width,
            height: resource.height
        }));

        return NextResponse.json(images);
    } catch (error) {
        console.error('Error fetching Cloudinary images:', error);
        return NextResponse.json({ error: 'Erreur lors du chargement des images' }, { status: 500 });
    }
}
