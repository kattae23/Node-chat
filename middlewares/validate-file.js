const { request, response } = require("express")



const validateFileToUpload = (req = request, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            msg: 'No files were uploaded. - file '
        });
    }

    next();

}


module.exports = {
    validateFileToUpload
}