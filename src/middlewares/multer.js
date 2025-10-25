import path from 'path'
import multer from 'multer'

import HTTPError from '../errors/HTTPError.js';
import HTTPStatus from '../consts/http-status.js';
import { allowedMimes } from '../config/mime-types.js';

/**
 * @type {import('multer').Options}
 */
const multerConfig = {
    dest: `${path.resolve()}/tmp`,
    limits: {
        fileSize: 2 * 1024 * 1024, // 10 MB
        files: 5
    },
    fileFilter: (_, file, cb) => {
        if (allowedMimes.includes(file?.mimetype?.toLowerCase())) {
            cb(null, true);
        } else {
            cb(new HTTPError(`Invalid file type ${file?.mimetype}.`,HTTPStatus.BAD_REQUEST));
        }
    }
};

/**
 * @type {import('multer').Multer}
 */
const uploadMiddleware = multer(multerConfig);

export default uploadMiddleware;
