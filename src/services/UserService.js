import HTTPStatus from '../consts/http-status.js';
import HTTPError from '../errors/HTTPError.js';

import { hash, compare } from 'bcrypt'

import saveUserDTO from './dtos/saveUserDTO.js';
import authenticateUserDTO from './dtos/authenticateUserDTO.js';
import patchUserDTO from './dtos/patchUserDTO.js';

class UserService {

    /**
    * @param {import('@prisma/client').PrismaClient} prismaClient
    */
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }

    /**
     * @typedef {Object} saveUserDTO
     * @property {string} name
     * @property {string} email
     * @property {string} password
     */

    /**
     * @param {saveUserDTO} body
     * @returns {Promise<Omit<Usuario, 'password'>>}
     */
    async saveUser(body) {
        const validatedUser = saveUserDTO.parse(body);

        const userExists = await this.prismaClient.usuario.findUnique({
            where: { email: validatedUser.email }
        });

        if (userExists)
            throw new HTTPError("Email already in use", HTTPStatus.CONFLICT);

        validatedUser.password = await hash(validatedUser.password, 10);

        const newUser = await this.prismaClient.usuario.create({ data: validatedUser });

        delete newUser.password;

        return newUser;
    }


    /**
     * @typedef {Object} authenticateUserDTO
     * @property {string} email
     * @property {string} password
     * @property {boolean} rememberMe
     */

    /**
     * @param {authenticateUserDTO} body
     * @param {import('express').Request} req
     * @returns {Promise<Omit<Usuario, 'password'>>}
     */
    async authenticateUser(body, req) {
        const validatedBody = authenticateUserDTO.parse(body);

        const user = await this.prismaClient.usuario.findUnique({
            where: { email: validatedBody.email }
        });

        if (!user || !(await compare(validatedBody.password, user.password))) {
            throw new HTTPError("Invalid email or password", HTTPStatus.UNAUTHORIZED);
        }

        delete user.password;

        req.session.user = user;

        const oneDayInMs = 24 * 60 * 60 * 1000;
        if (validatedBody.rememberMe)
            req.session.cookie.maxAge = oneDayInMs * 7; // 7 days
        else
            req.session.cookie.expires = false;

        return user;
    }

    /**
     * @param {number} id
     * @param {Prisma.UsuarioWhereInput} predicate
     * @returns {Promise<Omit<Usuario, 'password'>>}
     */
    async find(predicate) {
        const user = await this.prismaClient.usuario.findFirstOrThrow({
            where: predicate
        });

        delete user.password;

        return user;
    }

    /**
     * @typedef {Object} patchUserDTO
     * @property {string} [email]
     * @property {string} [password]
     * @property {string} [name]
     * @property {boolean} [active]
     */

    /**
     * @param {number} id
     * @param {patchUserDTO} body
     * @returns {Promise<Omit<Usuario, 'password'>>}
     */
    async patchUser(id, body) {
        const validatedBody = patchUserDTO.parse(body);

        const user = await this.prismaClient.usuario.findFirstOrThrow({
            where: { id }
        });

        if (validatedBody.password)
            validatedBody.password = await hash(validatedBody.password, 10);

        const updatedUser = await this.prismaClient.usuario.update({
            where: { id: user.id },
            data: validatedBody
        });

        delete updatedUser.password;

        return updatedUser;
    }

    /**
     * @param {number} id
     * @returns {Promise<Omit<Usuario, 'password'>>}
     */
    async deleteUser(id) {
        return this.patchUser(id, { active: false });
    }

}

export default UserService;