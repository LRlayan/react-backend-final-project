import express from "express";
import {LogModel} from "../models/log-model";
import {deleteLogService, getAllLogService, saveLogService, updateLogService} from "../service/log-service";
import {ImageUploader} from "../util/image-uploader";
import IdGenerator from "../util/id-generator";

const logRoutes = express.Router();
const imageUploader = new ImageUploader();
const upload = imageUploader.uploader('log');

logRoutes.post('/saveLog', upload.single('image'), async (req,res) =>{
    try {
        const {code, name, logDate, logDetails, assignFields, assignStaff, assignCrops} = req.body;
        const image = req.file? req.file.filename : null;
        const idGenerator = new IdGenerator();
        const newCode = await idGenerator.generateId('LOG-');
        if (newCode === null) {
            throw new Error("Log code is null. Please check the Id Type!");
        }
        const newLog = new LogModel(newCode, name, logDate, logDetails, image, assignFields, assignStaff, assignCrops);
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
    const code = req.params.code;
    const { name, logDate, logDetails, assignFields, assignStaff, assignCrops } = req.body;
    const image = req.file? req.file.filename : null;
    try {
        const updateLog = new LogModel(code, name, logDate, logDetails, image, assignFields, assignStaff, assignCrops);
        const result = await updateLogService(updateLog);
        res.status(204).send(result);
    } catch (e) {
        console.log("Failed to update log!",e);
        res.status(400).send("Failed to update log. Please try again.");
    }
});

logRoutes.delete('/deleteLog/:code', async (req,res) => {
    const code = req.params.code;
    try {
        if (!code) {
            throw new Error("Please required log code");
        }
        const result = await deleteLogService(code);
        res.status(204).send(result);
    } catch (e) {
        console.error("Failed to delete log!", e);
        res.status(400).send("Failed to delete log. Please try again.");
    }
});

logRoutes.get('/getALlLog', async (req,res) => {
    try {
         const result = await getAllLogService();
         if (result) {
             res.status(200).json(result);
         } else {
             res.status(400).send("Log data not found");
         }
    } catch (e) {
        console.error("Failed to get log data!", e);
        res.status(400).send("Failed to get log data. Please try again.");
    }
});

export default logRoutes;