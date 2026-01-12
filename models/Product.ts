import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    title: string;
    description: string;
    price: number;
    imageUrl: string; // GridFS ID or URL
    pdfUrl: string;   // GridFS ID
    slug: string;
    downloadCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        imageUrl: { type: String, required: true },
        pdfUrl: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        downloadCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Explicitly declare unique index on slug (schema field already has unique, but explicit index ensures creation)


// Prevent recompilation of model in development
const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
