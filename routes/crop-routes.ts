import express from "express";
import {CropModel} from "../models/crop-model";
import {deleteCropService, getAllCropService, saveCropService, updateCropService} from "../service/crop-service";
import {ImageUploader} from "../util/image-uploader";
import IdGenerator from "../util/id-generator";

const cropRoutes = express.Router();
const imageUploader = new ImageUploader();
const upload = imageUploader.uploader('crop');

cropRoutes.post('/saveCrop', upload.single('image'), async (req,res) => {
    try {
        const { name, scientificName, category, season, assignFields, assignLogs } = req.body;
        const image = req.file ? req.file.filename : null;
        const idGenerator = new IdGenerator();
        const newCode = await idGenerator.generateId('CROP-');
        if (newCode === null) {
            throw new Error("Crop code is null. Please check the Id Type!");
        }
        const newCrop = new CropModel(newCode, name, scientificName, category, season, image, assignFields, assignLogs);
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
    try {
        const result = await getAllCropService();
        if (result) {
            res.status(201).json(result);
        } else {
            res.status(400).send("Crop data not found");
        }
    } catch (e) {
        console.error("Failed to get crop data!", e);
        res.status(400).send("Failed to get crop data. Please try again.");
    }
});

export default cropRoutes;

