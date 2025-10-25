/**
 * @interface
 */
class ImageService {
    /**
    * @param {Express.Multer.File} [file] - Optional uploaded file
    * @param {string} [key] - Optional key for the image
    * @returns {Promise<string>} URL of the uploaded image
    */
    async upload(file,key) { }

    /**
     * @param {string} url
     * @returns {Promise<boolean>}
     */
    async delete(url) { }

    /**
     * @param {string} url
     * @returns {Promise<string>}
     */
    async getPublic(url) { }
}
export default ImageService;