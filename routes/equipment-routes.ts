import express from "express";
import {saveEquipmentService} from "../service/equipment-service";
import {EquipmentModel} from "../models/equipment-model";

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

equipmentRoutes.put('/updateEquipment/:equId', async (req,res) => {

});

equipmentRoutes.delete('/deleteEquipment/:equId', async (req,res) => {

})

equipmentRoutes.get('/getAllEquipment', async (req,res) => {

});

export default equipmentRoutes;