/**
 * @template T
 * @param {Partial<T>} objBody
 * @returns {Partial<T>}
 */
function rmPass(objBody) {
    if (objBody) {
        if (objBody?.password) delete objBody.password;
        if (objBody?.confirmPassword) delete objBody.confirmPassword;
    }
    return objBody
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function logger(req, res, next) {
    const logDetails = {
        method: req.method,
        path: req.originalUrl,
        timestamp: new Date(),
        ip: req.ip || req.socket?.remoteAddress,
        session: req?.session?.user
    };

    if (req?.body) logDetails.payload = rmPass({ ...req.body })

    const originalSend = res.send;

    res.send = function (_) {
        logDetails.statusCode = res?.statusCode
        originalSend.apply(res, arguments);
    };

    console.log(JSON.stringify(logDetails));

    next();
}

export default logger;