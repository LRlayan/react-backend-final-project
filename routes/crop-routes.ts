import express from "express";
import {CropModel} from "../models/crop-model";
import {saveCropService} from "../service/crop-service";
import multer from 'multer';
import path from 'path';

const cropRoutes = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage});

cropRoutes.post('/saveCrop', upload.single('image'), async (req,res) => {
    try {
        const { code, name, scientificName, category, season, assignFields, assignLogs } = req.body;
        const image = req.file ? req.file.filename : null;
        const newCrop = new CropModel(code,name,scientificName, category, season, image, assignFields, assignLogs);
        if (newCrop) {
            const result = await saveCropService(newCrop);
            res.status(201).send(result);
        } else {
            console.log("Error, Required crops data!");
        }
    } catch (e) {
        console.log("Failed to save equipment!",e);
        res.status(400).send("Failed to save equipment. Please try again.");
    }
});

cropRoutes.put('/updateCrop/:cropId', async (req,res) => {

});

cropRoutes.delete('/deleteCrop/:cropId', async (req,res) => {

});

cropRoutes.get('/getAllCrop', async (req,res) => {

})

export default cropRoutes;

