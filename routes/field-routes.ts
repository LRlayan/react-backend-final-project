import express from "express";

const fieldRoutes = express.Router();

fieldRoutes.post('/saveField', async (req,res) => {

});

fieldRoutes.put('/updateField/:fieldId', async (req,res) => {

});

fieldRoutes.delete('/deleteField/:fieldId', async (req,res) =>{

});

fieldRoutes.get('/getAllField', async (req,res) => {

});

export default fieldRoutes;