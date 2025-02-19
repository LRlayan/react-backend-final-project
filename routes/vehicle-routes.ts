import express from "express";
import {deleteVehicleService, getAllVehicleService, saveVehicleService, updateVehicleService} from "../service/vehicle-service";
import {VehicleModel} from "../models/vehicle-model";
import IdGenerator from "../util/id-generator";

const vehicleRoutes = express.Router();

vehicleRoutes.post('/saveVehicle', async (req, res) => {
    const vehicle = req.body;
    try {
        const idGenerator = new IdGenerator();
        const parsedAssignStaff: string[] = vehicle.assignStaff? vehicle.assignStaff : [];

        const staffCodes = parsedAssignStaff.map((staff: any) => staff.code);
;
        const newCode = await idGenerator.generateId('VEHICLE-');
        if (newCode === null) {
            throw new Error("vehicle code is null. Please check the Id Type!");
        }
        const newVehicle = new VehicleModel(newCode, vehicle.licensePlateNumber, vehicle.vehicleName, vehicle.category, vehicle.fuelType, vehicle.status, vehicle.remark, staffCodes);
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

vehicleRoutes.put('/updateVehicle/:code', async (req,res) => {
    const code = req.params.code;
    const vehicle = req.body;
    try {
        const parsedAssignStaff: string[] = vehicle.assignStaff? vehicle.assignStaff : [];
        const staffCodes = parsedAssignStaff.map((staff: any) => staff.code);

        const updateVehicle = new VehicleModel(code, vehicle.licensePlateNumber, vehicle.vehicleName, vehicle.category, vehicle.fuelType, vehicle.status, vehicle.remark, staffCodes);
        if (updateVehicle) {
            const result = await updateVehicleService(updateVehicle);
            res.status(200).send(result);
        } else {
            console.log("Error, Required vehicle data!");
        }
    } catch (e) {
        console.error("Failed to update vehicle!", e);
        res.status(400).send("Failed to update vehicle. Please try again.");
    }
});

vehicleRoutes.delete('/deleteVehicle/:code', async (req,res) => {
    const vehicleCode = req.params.code;
    try {
        if (!vehicleCode) {
            throw new Error("Please required vehicle code!");
        }
        const result = await deleteVehicleService(vehicleCode);
        res.status(200).send(result);
    } catch (e) {
        console.error("Failed to delete vehicle!", e);
        res.status(400).send("Failed to delete vehicle. Please try again.");
    }
});

vehicleRoutes.get('/getALlVehicle', async (req: express.Request, res: express.Response) => {
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