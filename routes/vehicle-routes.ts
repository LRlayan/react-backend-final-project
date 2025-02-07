import express from "express";
import {deleteVehicleService, getAllVehicleService, saveVehicleService, updateVehicleService} from "../service/vehicle-service";
import {VehicleModel} from "../models/vehicle-model";

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

vehicleRoutes.put('/updateVehicle/:vehicleCode', async (req,res) => {
    const code = req.params.vehicleCode;
    const vehicle = req.body;
    try {
        const updateVehicle = new VehicleModel(code, vehicle.licensePlateNumber, vehicle.vehicleName, vehicle.category, vehicle.fuelType, vehicle.status, vehicle.remark, vehicle.assignStaff);
        if (updateVehicle) {
            const result = await updateVehicleService(updateVehicle);
            res.status(204).send(result);
        } else {
            console.log("Error, Required vehicle data!");
        }
    } catch (e) {
        console.error("Failed to update vehicle!", e);
        res.status(400).send("Failed to update vehicle. Please try again.");
    }
});

vehicleRoutes.delete('/deleteVehicle/:vehicleCode', async (req,res) => {
    const vehicleCode = req.params.vehicleCode;
    try {
        if (!vehicleCode) {
            throw new Error("Please required vehicle code!");
        }
        const result = await deleteVehicleService(vehicleCode);
        res.status(204).send(result);
    } catch (e) {
        console.error("Failed to delete vehicle!", e);
        res.status(400).send("Failed to delete vehicle. Please try again.");
    }
});

vehicleRoutes.get('/getALlVehicle', async (req,res) => {
    try {
         const result = await getAllVehicleService();
         if (result) {
             res.status(200).json(result);
         } else {
             res.status(400).send("Vehicle data not found");
         }
    } catch (e) {
        console.error("Failed to get vehicle data!", e);
        res.status(400).send("Failed to get vehicle data. Please try again.");
    }
});

export default vehicleRoutes;