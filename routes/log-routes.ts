import express from "express";
import multer from "multer";
import path from "path";
import {LogModel} from "../models/log-model";
import {saveLogService} from "../service/log-service";

const logRoutes = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

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

logRoutes.put('/updateLog/:logId', async (req,res) => {

});

logRoutes.delete('/deleteLog/:logId', async (req,res) => {

});

logRoutes.get('/getALlLog', async (req,res) => {

});

export default logRoutes;