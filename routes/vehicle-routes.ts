import express from "express";
import {saveVehicle} from "../database/mongoose-vehicle-data-store";

const vehicleRoutes = express.Router();

vehicleRoutes.post('/saveVehicle', async (req, res) => {
    const vehicle = req.body;
    try {
        await saveVehicle(vehicle);
        res.status(200).send("Vehicle saved successfully.");
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