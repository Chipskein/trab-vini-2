import fs from 'fs';
import { unlink } from 'fs/promises';
import { S3Client, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { extensionMap } from '../config/mime-types.js'

import ImageService from './interface/ImageService.js';

/**
 * @implements {ImageService}
 */
class S3Service {
    /**
     * @param {Object} config - AWS S3 configuration
     * @param {string} config.bucket - Bucket name
     * @param {string} config.region - AWS region
     * @param {string} [config.accessKeyId] - Optional AWS access key
     * @param {string} [config.secretAccessKey] - Optional AWS secret key
     * @param {string} [config.endpoint] - Optional custom endpoint (for S3-compatible services)
     */
    constructor({ bucket, region, accessKeyId, secretAccessKey, endpoint }) {
        this.bucket = bucket;
        this.endpoint = endpoint;
        this.s3 = new S3Client({
            region,
            endpoint,
            credentials: accessKeyId && secretAccessKey
                ? { accessKeyId, secretAccessKey }
                : undefined,
            forcePathStyle: !!endpoint,
        });
    }

    /**
     * @param {Express.Multer.File} file
     * @param {string} [key]
     * @returns {Promise<string>}
     */
    async upload(file, key) {
        if (!file) throw new Error("No file provided");

        const ext = extensionMap[file.mimetype.toLowerCase()];

        const fileName = key ? `${key}.${ext}` : file.originalname;

        const fileStream = fs.createReadStream(file.path);

        const upload = new Upload({
            client: this.s3,
            params: {
                Bucket: this.bucket,
                Key: fileName,
                Body: fileStream,
            },
        });

        await upload.done();

        await unlink(file.path);

        return this.endpoint ?
            `${this.endpoint.replace(/\/$/, "")}/${this.bucket}/${fileName}` :
            `https://${this.bucket}.s3.${this.s3.config.region}.amazonaws.com/${fileName}`
        ;
    }

    /**
     * @param {string} url - URL of the image to delete
     * @returns {Promise<boolean>}
     */
    async delete(url) {
        if (!url) throw new Error("No URL provided");
        const key = url.split('/').slice(-1)[0];

        await this.s3.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            })
        );

        return true;
    }

    /**
     * @param {string} url - URL of the image to retrieve a public link for
     * @returns {Promise<string>} - Signed URL of the image
     */
    async getPublic(url, expiresInSeconds = 18000) {
        if (!url) throw new Error("No URL provided");
        const key = url.split('/').slice(-1)[0];

        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        return getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds });
    }

}

export default S3Service;
