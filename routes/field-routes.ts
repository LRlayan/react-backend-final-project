import express from "express";
import multer from 'multer';
import path from 'path';
import {saveFieldService} from "../service/field-service";
import {FieldModel} from "../models/field-model";

const fieldRoutes = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

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

fieldRoutes.put('/updateField/:fieldId', async (req,res) => {

});

fieldRoutes.delete('/deleteField/:fieldId', async (req,res) =>{

});

fieldRoutes.get('/getAllField', async (req,res) => {

});

export default fieldRoutes;