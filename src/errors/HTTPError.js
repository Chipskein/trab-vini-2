class HTTPError extends Error {
    /** @param {string} message */
    /** @param {number} statusCode */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
export default HTTPError;