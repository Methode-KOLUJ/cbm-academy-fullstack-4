import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { uploadFile, deleteFile } from '@/lib/gridfs';

export async function GET() {
    await dbConnect();
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const price = parseFloat(formData.get('price') as string);
        const imageFile = formData.get('image') as File;
        const pdfFile = formData.get('pdf') as File;

        // Ensure price is a valid number (0 is allowed)
        if (!title || !description || isNaN(price) || !imageFile || !pdfFile) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Upload files to GridFS - add per-file logs & validation
        console.log('Uploading files:', {
            image: { name: (imageFile as any)?.name, type: (imageFile as any)?.type, size: (imageFile as any)?.size },
            pdf: { name: (pdfFile as any)?.name, type: (pdfFile as any)?.type, size: (pdfFile as any)?.size },
        });

        // Validate PDF MIME
        const pdfType = (pdfFile as any)?.type || '';
        const pdfName = (pdfFile as any)?.name || '';
        if (!pdfType.includes('pdf') && !pdfName.toLowerCase().endsWith('.pdf')) {
            return NextResponse.json({ error: 'File is not a valid PDF' }, { status: 400 });
        }

        // Validate PDF Size (Max 20MB)
        const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
        if ((pdfFile as any).size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'Le fichier PDF dépasse la limite de 20MB' }, { status: 400 });
        }

        let imageId: string;
        try {
            imageId = await uploadFile(imageFile, `image-${Date.now()}-${(imageFile as any).name}`);
        } catch (imgErr) {
            console.error('Image upload failed:', { error: imgErr, file: (imageFile as any)?.name });
            return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
        }

        let pdfId: string;
        try {
            pdfId = await uploadFile(pdfFile, `pdf-${Date.now()}-${(pdfFile as any).name}`);
        } catch (pdfErr) {
            console.error('PDF upload failed:', { error: pdfErr, file: (pdfFile as any)?.name });
            return NextResponse.json({ error: 'PDF upload failed' }, { status: 500 });
        }

        // Generate a unique slug from title
        const slugify = (s: string) => s
            .toString()
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        const generateUniqueSlug = async (base: string) => {
            let slug = slugify(base) || `product-${Date.now()}`;
            let suffix = 0;
            while (await Product.findOne({ slug })) {
                suffix += 1;
                slug = `${slugify(base)}-${suffix}`;
            }
            return slug;
        };

        const slug = await generateUniqueSlug(title);

        const product = await Product.create({
            title,
            description,
            price,
            imageUrl: imageId, // Storing GridFS ID
            pdfUrl: pdfId,     // Storing GridFS ID
            slug,
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        // Better error handling for Mongo duplicate key
        const e = error as any;
        if (e && e.code === 11000) {
            console.error('Duplicate key error while creating product:', e.message, e.keyValue, e.keyPattern);
            // For more complete debug output (non-enumerable fields), stringify including hidden properties
            try {
                const expanded = JSON.stringify(e, Object.getOwnPropertyNames(e));
                console.error('Full error object:', expanded);
            } catch (jsonErr) {
                // ignore
            }
            return NextResponse.json({ error: 'Duplicate key conflict', details: e.keyValue }, { status: 409 });
        }

        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

import mongoose from 'mongoose';

export async function DELETE(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
        }

        // Find product by ID
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Delete associated GridFS files (image and PDF) only if they are valid ObjectIds
        const filesToDelete = [];

        if (product.imageUrl && mongoose.Types.ObjectId.isValid(product.imageUrl)) {
            filesToDelete.push(deleteFile(product.imageUrl));
        }

        if (product.pdfUrl && mongoose.Types.ObjectId.isValid(product.pdfUrl)) {
            filesToDelete.push(deleteFile(product.pdfUrl));
        }

        // Wait for all file deletions to complete (catch errors to ensure product is deleted even if file delete fails)
        try {
            await Promise.all(filesToDelete);
        } catch (fileErr) {
            console.error('File deletion error (non-fatal):', fileErr);
        }

        // Delete product from database
        await Product.findByIdAndDelete(productId);

        return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
