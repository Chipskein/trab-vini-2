import { v4 as uuidv4 } from 'uuid';

import ImageService from './interface/ImageService.js';

import savePostDTO from './dtos/savePostDTO.js';

class PostService {

    /**
    * @param {import('@prisma/client').PrismaClient} prismaClient
    * @param {ImageService} imageService
    */
    constructor(
        prismaClient,
        imageService
    ) {
        this.prismaClient = prismaClient;
        this.imageService = imageService;
    }

    /**
     * @typedef {Object} savePostDTO
     * @property {string} [title]
     * @property {string} description
     * @property {string} [externalLink]
     * @property {number} [parentId]
    */

    /**
     * @param {savePostDTO} body
     * @param {Express.Multer.File} [file]
     * @param {Omit<import('@prisma/client').Usuario, 'password'>} user
     * @returns {Promise<import('@prisma/client').Post>}
     */
    async savePost(body,file,user) {
        const validatedBody = savePostDTO.parse(body);

        if (file)
            validatedBody.imageUri = await this.imageService.upload(file, uuidv4());

        validatedBody.usuarioId = user.id;

        console.log(validatedBody);
        const post = await this.prismaClient.post.create({
            data: validatedBody
        });

        if (validatedBody.imageUri)
            post.imageUri = await this.imageService.getPublic(validatedBody.imageUri);


        return post;
    }

    /**
     *
     * @param {number} page
     * @param {number} limit
     * @param {string} orderBy
     * @param {string} orderDirection
     * @returns {Promise<Array<import('@prisma/client').Post>>}
     */
    async getFeedPosts(
        page = 1,
        limit = 10,
        orderBy = 'createdAt',
        orderDirection = 'desc'
    ) {
        if (!['createdAt', 'commentsCount'].includes(orderBy))
            orderBy = 'createdAt';

        if (!['asc', 'desc'].includes(orderDirection))
            orderDirection = 'desc';

        const orderByObj ={ [orderBy]: orderDirection };
        if (orderBy === 'commentsCount') {
            orderByObj['comments'] = {
                _count: orderDirection
            };
            delete orderByObj['commentsCount'];
        }

        const posts = await this.prismaClient.post.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: orderByObj,
            include: {
                usuario: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true
                    }
               },
               comments: {
                take:3,
                orderBy: { createdAt: 'desc' },
                include: {
                    usuario: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    },
                }
               }
            },
            where:{
                parentId: null
            }
        });

        for (const post of posts) {
            if (post.imageUri)
                post.imageUri = await this.imageService.getPublic(post.imageUri);
        }

        return posts;
    }

    /**
     *
     * @param {import('@prisma/client').PostWhereUniqueInput} predicate
     * @returns {Promise<import('@prisma/client').Post>}
     */
    async find(predicate) {
        const post = await this.prismaClient.post.findUnique({
            where: predicate,
            include: {
                usuario: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true
                    }
                },
                comments: {
                orderBy: { createdAt: 'desc' },
                include: {
                    usuario: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    },
                }
                }
            }
        });

        if (post)
            post.imageUri = await this.imageService.getPublic(post.imageUri)
        ;

        return post;
    }

}

export default PostService;