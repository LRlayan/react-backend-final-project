import express from "express";
import {deleteEquipmentService, saveEquipmentService, updateEquipmentService} from "../service/equipment-service";
import {EquipmentModel} from "../models/equipment-model";
import {findEquipmentByCode} from "../repository/equipment-repository";

const equipmentRoutes = express.Router();

equipmentRoutes.post('/saveEquipment', async (req,res) => {
    const equipment = req.body;
    try {
        const newEquipment = new EquipmentModel(equipment.code, equipment.name, equipment.equType, equipment.status, equipment.count, equipment.assignStaffMembers, equipment.assignFields);
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
        const updateEquipment = new EquipmentModel(ecuCode, equipment.name, equipment.equType, equipment.status, equipment.count, equipment.assignStaffMembers, equipment.assignFields);
        const result = await updateEquipmentService(updateEquipment);
        res.status(204).send(result);
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
        res.status(204).send(result);
    } catch (e) {
        console.error("Failed to delete equipment!", e);
        res.status(400).send("Failed to delete equipment. Please try again.");
    }
})

equipmentRoutes.get('/getAllEquipment', async (req,res) => {

});

export default equipmentRoutes;