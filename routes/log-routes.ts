import express from "express";

const logRoutes = express.Router();

logRoutes.post('/saveLog', async (req,res) =>{

});

logRoutes.put('/updateLog/:logId', async (req,res) => {

});

logRoutes.delete('/deleteLog/:logId', async (req,res) => {

});

logRoutes.get('/getALlLog', async (req,res) => {

});

export default logRoutes;