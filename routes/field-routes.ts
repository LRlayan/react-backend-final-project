import express from "express";
import {saveFieldService, updateFieldService} from "../service/field-service";
import {FieldModel} from "../models/field-model";
import {ImageUploader} from "../util/image-uploader";

const fieldRoutes = express.Router();
const imageUploader = new ImageUploader();

const upload = imageUploader.uploader('field');

fieldRoutes.post('/saveField', upload.single('image'), async (req,res) => {
    try {
        const { code, name, location, extentSize, assignLogs, assignStaffMembers, assignCrops, assignEquipments} = req.body;
        const image = req.file? req.file.filename : null;
        const newField = new FieldModel(code, name, location, extentSize, image, assignLogs, assignStaffMembers, assignCrops, assignEquipments);
        if (newField) {
            const result = await saveFieldService(newField);
            res.status(201).send(result);
        } else {
            console.log("Error, Required crops data!");
        }
    } catch (e) {
        console.log("Failed to save field!",e);
        res.status(400).send("Failed to save field. Please try again.");
    }
});

fieldRoutes.put('/updateField/:code', upload.single('image'),async (req,res) => {
    const code = req.params;
    const {name, location, extentSize, assignLogs, assignStaffMembers, assignCrops, assignEquipments} = req.body;
    const image = req.file? req.file.filename : null;
    try {
        const updateField = new FieldModel(code, name, location, extentSize, image, assignLogs, assignStaffMembers, assignCrops, assignEquipments);
        const result = await updateFieldService(updateField);
        res.status(204).send(result);
    } catch (e) {
        console.log("Failed to update field!",e);
        res.status(400).send("Failed to update field. Please try again.");
    }
});

fieldRoutes.delete('/deleteField/:fieldId', async (req,res) =>{

});

fieldRoutes.get('/getAllField', async (req,res) => {

});

export default fieldRoutes;