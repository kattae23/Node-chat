const { request, response } = require("express");

const path = require('path');
const { v4: uuidv4 } = require('uuid');


const uploadFile = async (files, allowExtensions = ['png', 'jpg', 'webp', 'jpeg', 'gif'], folder = '') => {

    return new Promise((resolve, reject) => {

        const { file } = files;
        const nameCut = file.name.split('.');
        const extension = nameCut[nameCut.length - 1]

        // validate extension
        if (!allowExtensions.includes(extension)) {
            return reject(`The extension '${extension}' is not a valid extension, allowed extensions: ${allowExtensions}`)
        }


        const nameTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder, nameTemp);

        file.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }
            resolve(nameTemp);
        });
    });
}


module.exports = {
    uploadFile
}