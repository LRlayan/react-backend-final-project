import express from "express";

const vehicleRoutes = express.Router();

vehicleRoutes.post('/saveVehicle', async (req,res) => {

});

vehicleRoutes.put('/updateVehicle/:vehicleId', async (req,res) => {

});

vehicleRoutes.delete('/deleteVehicle/:vehicleId', async (req,res) => {

});

vehicleRoutes.get('/getALlVehicle', async (req,res) => {

});

export default vehicleRoutes;