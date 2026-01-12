import mongoose from 'mongoose';

const FreeDownloadSchema = new mongoose.Schema({
    slug: {
        type: String, // Identifiant unique (ex: 'global-free-stats')
        required: true,
        unique: true,
    },
    title: {
        type: String, // Titre descriptif (ex: 'Compteur Global')
        default: 'Statistiques Téléchargements Gratuits'
    },
    count: {
        type: Number,
        default: 0,
    },
    env: {
        type: String, // 'development' ou 'production' pour séparer les stats si besoin
        default: process.env.NODE_ENV || 'development'
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

// Prevent overwrite errors during hot reload
export default mongoose.models.FreeDownload || mongoose.model('FreeDownload', FreeDownloadSchema);
