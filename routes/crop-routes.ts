import express from "express";
import {CropModel} from "../models/crop-model";
import {deleteCropService, saveCropService, updateCropService} from "../service/crop-service";
import {ImageUploader} from "../util/image-uploader";

const cropRoutes = express.Router();
const imageUploader = new ImageUploader();
const upload = imageUploader.uploader('crop');

cropRoutes.post('/saveCrop', upload.single('image'), async (req,res) => {
    try {
        const { code, name, scientificName, category, season, assignFields, assignLogs } = req.body;
        const image = req.file ? req.file.filename : null;
        const newCrop = new CropModel(code, name, scientificName, category, season, image, assignFields, assignLogs);
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

cropRoutes.put('/updateCrop/:code', upload.single('image'), async (req,res) => {
    const code = req.params.code;
    const { name, scientificName, category, season, assignFields, assignLogs } = req.body;
    const image = req.file ? req.file.filename : null;
    console.log(image)
    try {
        const newCrop = new CropModel(code, name, scientificName, category, season, image, assignFields, assignLogs);
        const result = await updateCropService(newCrop);
        res.status(204).send(result);
    } catch (e) {
        console.error("Failed to update equipment!", e);
        res.status(400).send("Failed to update equipment. Please try again.");
    }
});

cropRoutes.delete('/deleteCrop/:code', async (req,res) => {
    const code = req.params.code;
    try {
        if (!code) {
            throw new Error("Please required crop code");
        }
        const result = await deleteCropService(code);
        res.status(204).send(result);
    } catch (e) {
        console.error("Failed to delete crop!", e);
        res.status(400).send("Failed to delete crop. Please try again.");
    }
});

cropRoutes.get('/getAllCrop', async (req,res) => {

})

export default cropRoutes;

