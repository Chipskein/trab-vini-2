import db from '../db/db.js';
import S3Service from '../services/S3Service.js';
import UserService from '../services/UserService.js';
import PostService from '../services/PostService.js';
import HTTPStatus from '../consts/http-status.js';

class UsersController {

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
    */
    static async feed(req, res) {
        const page = req?.query?.page ? parseInt(req.query.page) : 1;
        const limit = req?.query?.limit ? parseInt(req.query.limit) : 10;
        const json = req?.query?.json ? req.query?.json==='true' : false;
        const orderBy = req?.query?.orderBy ? req.query?.orderBy : 'createdAt';
        const orderDirection = req?.query?.direction ? req.query?.direction : 'desc';

        const imageService = new S3Service({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            bucket: process.env.S3_BUCKET_NAME,
            region: process.env.S3_REGION,
            endpoint: process.env.S3_ENDPOINT
        })

        const postService = new PostService(db,imageService);

        const posts = await postService.getFeedPosts(page, limit, orderBy, orderDirection);

        if (json)
            return res.status(HTTPStatus.OK).json(posts);

        return res.render('main',{user:req.session.user,posts});
    }

}
export default UsersController;