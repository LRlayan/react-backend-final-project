import express from "express";
import {LogModel} from "../models/log-model";
import {saveLogService} from "../service/log-service";
import {ImageUploader} from "../util/image-uploader";

const logRoutes = express.Router();
const imageUploader = new ImageUploader();
const upload = imageUploader.uploader('log');

logRoutes.post('/saveLog', upload.single('image'), async (req,res) =>{
    try {
        const {code, name, logDate, logDetails, assignFields, assignStaff, assignCrops} = req.body;
        const image = req.file? req.file.filename : null;
        const newLog = new LogModel(code, name, logDate, logDetails, image, assignFields, assignStaff, assignCrops);
        if (newLog) {
            const result = await saveLogService(newLog);
            res.status(201).send(result);
        } else {
            console.log("Error, Required log data!");
        }
    } catch (e) {
        console.log("Failed to save log!",e);
        res.status(400).send("Failed to save log. Please try again.");
    }
});

logRoutes.put('/updateLog/:code', upload.single('image'), async (req,res) => {
    const code = req.params;
    const { name, logDate, logDetails, assignFields, assignStaff, assignCrops } = req.body;
    try {
        const updateLog = new LogModel(code, name, logDate, logDetails, image, assignFields, assignStaff, assignCrops);
        const result = await updateLogService(updateLog);
        res.status(204).send(result);
    } catch (e) {
        console.log("Failed to update log!",e);
        res.status(400).send("Failed to update log. Please try again.");
    }
});

logRoutes.delete('/deleteLog/:logId', async (req,res) => {

});

logRoutes.get('/getALlLog', async (req,res) => {

});

export default logRoutes;