import express from "express";
import {deleteFieldService, getAllFieldService, saveFieldService, updateFieldService} from "../service/field-service";
import {FieldModel} from "../models/field-model";
import {ImageUploader} from "../util/image-uploader";
import IdGenerator from "../util/id-generator";

const fieldRoutes = express.Router();
const imageUploader = new ImageUploader();

const upload = imageUploader.uploader('field');

fieldRoutes.post('/saveField', upload.single('image'), async (req,res) => {
    try {
        const { code, name, location, extentSize, assignLogs, assignStaffMembers, assignCrops, assignEquipments} = req.body;
        const image = req.file? req.file.filename : null;
        const parsedAssignLogs : string[] = assignLogs ? JSON.parse(assignLogs) : [];
        const parsedAssignStaff: string[] = assignStaffMembers ? JSON.parse(assignStaffMembers) : [];
        const parsedAssignCrops: string[] = assignCrops ? JSON.parse(assignCrops) : [];
        const parsedAssignEquipments: string[] = assignEquipments ? JSON.parse(assignEquipments) : [];
        const idGenerator = new IdGenerator();
        const newCode = await idGenerator.generateId('FIELD-');

        if (newCode === null) {
            throw new Error("Field code is null. Please check the Id Type!");
        }

        const logCodes = parsedAssignLogs.map((log: any) => log.code);
        const staffCodes = parsedAssignStaff.map((staff: any) => staff.code);
        const cropCodes = parsedAssignCrops.map((crop: any) => crop.code);
        const equCodes = parsedAssignEquipments.map((equ: any) => equ.code);

        const newField = new FieldModel(newCode, name, location, extentSize, image, logCodes, staffCodes, cropCodes, equCodes);
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
    const code = req.params.code;
    const {name, location, extentSize, assignLogs, assignStaffMembers, assignCrops, assignEquipments} = req.body;
    const image = req.file? req.file.filename : null;

    try {
        const parsedAssignLogs : string[] = assignLogs ? JSON.parse(assignLogs) : [];
        const parsedAssignStaff: string[] = assignStaffMembers ? JSON.parse(assignStaffMembers) : [];
        const parsedAssignCrops: string[] = assignCrops ? JSON.parse(assignCrops) : [];
        const parsedAssignEquipments: string[] = assignEquipments ? JSON.parse(assignEquipments) : [];
        const logCodes = parsedAssignLogs.map((log: any) => log.code);
        const staffCodes = parsedAssignStaff.map((staff: any) => staff.code);
        const cropCodes = parsedAssignCrops.map((crop: any) => crop.code);
        const equCodes = parsedAssignEquipments.map((equ: any) => equ.code);

        const updateField = new FieldModel(code, name, location, extentSize, image, logCodes, staffCodes, cropCodes, equCodes);
        const result = await updateFieldService(updateField);
        res.status(200).send(result);
    } catch (e) {
        console.log("Failed to update field!",e);
        res.status(400).send("Failed to update field. Please try again.");
    }
});

fieldRoutes.delete('/deleteField/:code', async (req,res) =>{
    const code = req.params.code;
    try {
        if (!code) {
            throw new Error("Please required field code");
        }
        const result = await deleteFieldService(code);
        res.status(200).send(result);
    } catch (e) {
        console.log("Failed to delete field!",e);
        res.status(400).send("Failed to delete field. Please try again.");
    }
});

fieldRoutes.get('/getAllField', async (req,res) => {
    try {
        const result = await getAllFieldService();
        if (result) {
            res.status(201).json(result);
        } else {
            res.status(400).send("Field data not found");
        }
    } catch (e) {
        console.log("Failed to get field data!",e);
        res.status(400).send("Failed to get field data. Please try again.");
    }
});

export default fieldRoutes;