import express from "express";
import {deleteEquipmentService, getAllEquipmentService, saveEquipmentService, updateEquipmentService} from "../service/equipment-service";
import {EquipmentModel} from "../models/equipment-model";
import {findEquipmentByCode} from "../repository/equipment-repository";
import IdGenerator from "../util/id-generator";

const equipmentRoutes = express.Router();

equipmentRoutes.post('/saveEquipment', async (req,res) => {
    const equipment = req.body;
    try {
        const idGenerator = new IdGenerator();
        const parsedAssignStaff: string[] = equipment.assignStaffMembers? equipment.assignStaffMembers : [];
        const parsedAssignField: string[] = equipment.assignFields? equipment.assignFields : [];

        const staffCodes = parsedAssignStaff.map((staff: any) => staff.code);
        const fieldCodes = parsedAssignField.map((field: any) => field.code);

        const newCode = await idGenerator.generateId('EQUIPMENT-');
        if (newCode === null) {
            throw new Error("Equipment code is null. Please check the Id Type!");
        }

        const newEquipment = new EquipmentModel(newCode, equipment.name, equipment.equType, equipment.status, equipment.count, staffCodes, fieldCodes);
        if (newEquipment) {
            const result = await saveEquipmentService(newEquipment);
            res.status(201).send(result);
        } else {
            console.log("Error, Required equipment data!");
        }
    } catch (e) {
        console.log("Failed to save equipment!",e);
        res.status(400).send("Failed to save equipment. Please try again.");
    }
});

equipmentRoutes.put('/updateEquipment/:code', async (req,res) => {
    const ecuCode = req.params.code;
    const equipment = req.body;
    try {
        const parsedAssignStaff: string[] = equipment.assignStaffMembers? equipment.assignStaffMembers : [];
        const parsedAssignField: string[] = equipment.assignFields? equipment.assignFields : [];

        const staffCodes = parsedAssignStaff.map((staff: any) => staff.code);
        const fieldCodes = parsedAssignField.map((field: any) => field.code);

        const updateEquipment = new EquipmentModel(ecuCode, equipment.name, equipment.equType, equipment.status, equipment.count, staffCodes, fieldCodes);
        const result = await updateEquipmentService(updateEquipment);
        res.status(200).send(result);
    } catch (e) {
        console.error("Failed to update equipment!", e);
        res.status(400).send("Failed to update equipment. Please try again.");
    }
});

equipmentRoutes.delete('/deleteEquipment/:code', async (req,res) => {
    const code = req.params.code;
    try {
        const excitingEquipment = await findEquipmentByCode(code);
        if (!excitingEquipment) {
            throw new Error("Please required equipment code");
        }
        const result = await deleteEquipmentService(code);
        res.status(200).send(result);
    } catch (e) {
        console.error("Failed to delete equipment!", e);
        res.status(400).send("Failed to delete equipment. Please try again.");
    }
})

equipmentRoutes.get('/getAllEquipment', async (req: express.Request, res: express.Response) => {
    try {
        const result = await getAllEquipmentService();
        if (result) {
            res.status(201).json(result);
        } else {
            res.status(400).send("Equipment data not found");
        }
    } catch (e) {
        console.error("Failed to get equipment data!", e);
        res.status(400).send("Failed to get equipment data. Please try again.");
    }
});

export default equipmentRoutes;