import db from '../db/db.js';
import HTTPStatus from '../consts/http-status.js';
import PostService from '../services/PostService.js';
import S3Service from '../services/S3Service.js';

class PostsController {

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
    */
    static async savePost(req, res) {
        try{
            if (req.method === 'GET')
                return res.render('publish');

            const imageService =  new S3Service({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                bucket: process.env.S3_BUCKET_NAME,
                region: process.env.S3_REGION,
                endpoint: process.env.S3_ENDPOINT
            })

            const postService = new PostService(db,imageService);

            await postService.savePost(
                req.body,
                req.file,
                req.session.user
            );

            return res.status(HTTPStatus.SEE_OTHER).redirect('/web/users/feed');
        }
        catch(err){
            console.error(err);
            return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send("Erro interno do servidor");
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
    */
    static async get(req, res) {
        try{
            const postId = parseInt(req.params.postId);

            const imageService =  new S3Service({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                bucket: process.env.S3_BUCKET_NAME,
                region: process.env.S3_REGION,
                endpoint: process.env.S3_ENDPOINT
            })

            const postService = new PostService(db,imageService);
            const post = await postService.find({ id: postId });
            return res.render('post', { post } );
        }
        catch(err){
            console.error(err);
            return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send("Erro interno do servidor");
        }
    }

}
export default PostsController;