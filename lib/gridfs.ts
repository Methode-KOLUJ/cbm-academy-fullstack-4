import mongoose from 'mongoose';
import { Readable } from 'stream';
import dbConnect from './db';

let bucket: mongoose.mongo.GridFSBucket;

export const getBucket = async (): Promise<mongoose.mongo.GridFSBucket> => {
    if (bucket) {
        return bucket;
    }

    const conn = await dbConnect();
    const db = conn.connection.db;

    if (!db) {
        throw new Error("Database connection not established");
    }

    bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: 'uploads',
    });

    return bucket;
};

export const uploadFile = async (
    file: File,
    filename: string
): Promise<string> => {
    const bucket = await getBucket();
    // Log file metadata for debugging (name/type/size can help diagnose upload issues)
    try {
        const _file: any = file;
        console.log('gridfs.uploadFile => file metadata', { name: _file.name, type: _file.type, size: _file.size });
    } catch (err) {
        // ignore
    }

    // If file exposes a web ReadableStream via `file.stream()`, pipe it into GridFS bucket to avoid buffering in memory
    const uploadStream = bucket.openUploadStream(filename, {
        // Put MIME type inside metadata to be portable across driver versions
        metadata: {
            originalName: file.name,
            contentType: file.type || 'application/octet-stream'
        }
    });

    // Prefer streaming if available to avoid large memory usage
    if (typeof (file as any).stream === 'function') {
        return new Promise<string>((resolve, reject) => {
            try {
                const webStream = (file as any).stream(); // web ReadableStream
                // Node 18+ has Readable.fromWeb; else try Readable.from
                const nodeReadable = (Readable as any).fromWeb
                    ? (Readable as any).fromWeb(webStream)
                    : Readable.from(async function* () {
                        const reader = webStream.getReader();
                        try {
                            while (true) {
                                const { value, done } = await reader.read();
                                if (done) break;
                                yield value;
                            }
                        } finally {
                            reader.releaseLock();
                        }
                    }());
                nodeReadable.pipe(uploadStream);
                nodeReadable.on('error', (err: any) => {
                    console.error('Readable file stream error:', err);
                    reject(err);
                });
                uploadStream.on('error', (err: Error) => {
                    console.error('GridFS upload stream error:', err);
                    reject(err);
                });
                uploadStream.on('finish', () => resolve(uploadStream.id.toString()));
            } catch (err) {
                reject(err);
            }
        });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    return new Promise<string>((resolve, reject) => {
        // Use event listeners instead of passing an error parameter to end
        uploadStream.on('error', (err: Error) => {
            console.error('GridFS upload stream error:', err);
            reject(err);
        });
        uploadStream.on('finish', () => resolve(uploadStream.id.toString()));
        uploadStream.end(buffer);
    });
};

export const getFileStream = async (id: string): Promise<mongoose.mongo.GridFSBucketReadStream> => {
    const bucket = await getBucket();
    const _id = new mongoose.Types.ObjectId(id);
    return bucket.openDownloadStream(_id);
}

export const getFile = async (id: string): Promise<{ file: any, stream: mongoose.mongo.GridFSBucketReadStream }> => {
    const bucket = await getBucket();
    const _id = new mongoose.Types.ObjectId(id);
    const cursor = bucket.find({ _id });
    const files = await cursor.toArray();
    if (!files || files.length === 0) {
        throw new Error('File not found');
    }
    const file = files[0];
    const stream = bucket.openDownloadStream(_id);
    return { file, stream };
};

export const deleteFile = async (id: string): Promise<void> => {
    const bucket = await getBucket();
    const _id = new mongoose.Types.ObjectId(id);
    await bucket.delete(_id);
};
