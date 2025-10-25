import db from '../db/db.js';
import UserService from '../services/UserService.js';
import HTTPStatus from '../consts/http-status.js'

class AuthController {

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
    */
    static async signup(req, res) {
        try{
            if (req.method === 'GET')
                return res.render('signup', {
                    error: req?.query?.error,
                    success: req?.query?.success
                });

            const userService = new UserService(db);
            await userService.saveUser(req.body);

            return res.redirect(HTTPStatus.SEE_OTHER,'/web/auth/signin?success=' + encodeURIComponent('Account created successfully. Please sign in.'));
        } catch (error) {
            return res.redirect(HTTPStatus.SEE_OTHER, '/web/auth/signup?error=' + encodeURIComponent(error.message || 'Internal Server Error'));
        }

    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
    */
    static async signin(req, res) {
        try{
            if (req.method === 'GET')
                return res.render('signin', {
                    error: req?.query?.error,
                    success: req?.query?.success
                });

            const userService = new UserService(db);
            await userService.authenticateUser(req.body,req);

            return res.redirect(HTTPStatus.SEE_OTHER, '/web/users/feed')
        } catch (error) {
            return res.redirect(HTTPStatus.SEE_OTHER, '/web/auth/signin?error=' + encodeURIComponent(error.message || 'Internal Server Error'));
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
    */
    static async signout(req, res) {
        try{
            req.session.destroy(err => {
                if (err) {
                    console.error('Session destroy error:', err);
                    return res.redirect('/web/users/feed?error=' + encodeURIComponent(err.message || 'Internal Server Error'));
                }
                res.clearCookie('connect.sid');
                return res.redirect('/web/users/feed');
            });
        } catch (error) {
            return res.redirect(HTTPStatus.SEE_OTHER, '/web/users/feed?error=' + encodeURIComponent(error.message || 'Internal Server Error'));
        }
    }

}
export default AuthController;