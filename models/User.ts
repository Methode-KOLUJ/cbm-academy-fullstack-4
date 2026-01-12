import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    firebaseUid: string;
    phoneNumber: string;
    name: string;
    email?: string;
    image?: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        firebaseUid: { type: String, required: true, unique: true },
        phoneNumber: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String },
        image: { type: String },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
    },
    { timestamps: true }
);

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

