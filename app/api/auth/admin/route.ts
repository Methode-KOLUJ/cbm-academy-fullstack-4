import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const adminPassword = process.env.ADMIN;

        if (!adminPassword) {
            console.error('ADMIN_PASSWORD is not defined in .env');
            return NextResponse.json({ error: 'Configuration serveur manquante (ADMIN_PASSWORD)' }, { status: 500 });
        }

        if (password === adminPassword) {
            // Set cookie
            const cookieStore = await cookies();

            cookieStore.set('admin_session', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 1 week
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
    } catch (error) {
        console.error('Admin auth error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
