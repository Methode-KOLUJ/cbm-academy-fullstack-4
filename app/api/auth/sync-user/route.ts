import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { firebaseUid, phoneNumber, name } = await req.json();

        if (!firebaseUid || !phoneNumber) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if user already exists
        let user = await User.findOne({ firebaseUid });

        if (!user) {
            // Create new user
            user = await User.create({
                firebaseUid,
                phoneNumber,
                name: name || 'User',
                role: 'user',
            });
        } else {
            // Update existing user if phone number changed
            if (user.phoneNumber !== phoneNumber) {
                user.phoneNumber = phoneNumber;
                await user.save();
            }
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                firebaseUid: user.firebaseUid,
                phoneNumber: user.phoneNumber,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Error syncing user:', error);
        return NextResponse.json(
            { error: 'Failed to sync user' },
            { status: 500 }
        );
    }
}
