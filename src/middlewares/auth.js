import HTTPStatus from '../consts/http-status.js';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function isAuthenticated(req, res, next) {
    if (!req.session.user)
        return res.redirect(HTTPStatus.SEE_OTHER, '/web/auth/signin');

    next();
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function isNotAuthenticated(req, res, next) {
    if (req.session.user)
        return res.redirect(HTTPStatus.SEE_OTHER, '/web/users/feed');

    next();
}

export {
    isAuthenticated,
    isNotAuthenticated
};