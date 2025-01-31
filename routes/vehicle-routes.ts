import express from "express";
import {saveVehicleService} from "../service/vehicle-service";
import {VehicleModel} from "../models/vehicle-model";
import {saveEquipmentService} from "../service/equipment-service";

const vehicleRoutes = express.Router();

vehicleRoutes.post('/saveVehicle', async (req, res) => {
    const vehicle = req.body;
    try {
        const newVehicle = new VehicleModel(vehicle.vehicleCode, vehicle.licensePlateNumber, vehicle.vehicleName, vehicle.category, vehicle.fuelType, vehicle.status, vehicle.remark, vehicle.assignStaff);
        if (newVehicle) {
            const result = await saveVehicleService(newVehicle);
            res.status(201).send(result);
        } else {
            console.log("Error, Required vehicle data!");
        }
    } catch (e) {
        console.error("Failed to save vehicle!", e);
        res.status(400).send("Failed to save vehicle. Please try again.");
    }
});

vehicleRoutes.put('/updateVehicle/:vehicleId', async (req,res) => {

});

vehicleRoutes.delete('/deleteVehicle/:vehicleId', async (req,res) => {

});

vehicleRoutes.get('/getALlVehicle', async (req,res) => {

});

export default vehicleRoutes;