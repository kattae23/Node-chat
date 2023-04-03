const { request, response } = require('express');
const { uploadFile } = require('../helpers/upload-file');
const path = require('path')
const fs = require('fs')

const { User, Product } = require('../models')

const allowExtensions = ['png', 'jpg']


const downloadFile = async (req = request, res = response) => {

    try {
        const name = await uploadFile(req.files, undefined, 'imgs')
        res.json({ name })
    } catch (msg) {
        res.status(400).json({ msg })
    }
}

const updateFile = async (req = request, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `Dont exist a user with that id ${id}`
                })
            }

            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `Dont exist a product with that id ${id}`
                })
            }

            break;

        default:
            return res.status(500).json({ msg: 'i forget validate that' })
    }


    // Clean preview images 
    if (model.img) {
        // hay que borrar la imagen del servidor
        const pathImg = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(pathImg)) {
            fs.unlinkSync(pathImg);
        }
    }


    const name = await uploadFile(req.files, undefined, collection)
    model.img = name;

    await model.save();
    res.json(model)
}


const getImage = async (req = request, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `Dont exist a user with that id ${id}`
                })
            }

            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `Dont exist a product with that id ${id}`
                })
            }

            break;

        default:
            return res.status(500).json({ msg: 'i forget validate that' })
    }


    // Clean preview images 
    if (model.img) {
        // hay que borrar la imagen del servidor
        const pathImg = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(pathImg)) {
            return res.sendFile(pathImg)
        }
    }

    const pathImg = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImg)

}





module.exports = {
    downloadFile,
    updateFile,
    getImage,
}