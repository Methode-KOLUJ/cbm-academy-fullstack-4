import mongoose, { Schema, Document, Model } from 'mongoose';
import Product from './Product'; // Import to ensure Product model is registered

export interface IOrder extends Document {
    userId: string;
    phoneNumber: string;
    productId: mongoose.Types.ObjectId;
    amount: number;
    status: 'pending' | 'paid' | 'failed';
    transactionId?: string;
    depositId?: string;
    pawapayStatus?: string;
    downloadToken?: string;
    downloadTokenExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
    {
        userId: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        amount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        transactionId: { type: String },
        depositId: { type: String, unique: true, sparse: true },
        pawapayStatus: { type: String },
        downloadToken: { type: String },
        downloadTokenExpires: { type: Date },
    },
    { timestamps: true }
);

const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
