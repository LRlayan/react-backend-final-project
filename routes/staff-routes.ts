import express from "express";
import {saveStaff} from "../repository/staff-repository";

const staffRoutes = express.Router();

staffRoutes.post('/saveStaff', async (req,res) => {
    const staff = req.body;
    console.log("Staff - : ", staff);
    try {
        await saveStaff(staff);
        res.status(200).send("staff saved successfully.");
    } catch (e) {
        console.error("Failed to save staff!", e);
        res.status(400).send("Failed to save staff. Please try again.");
    }
});

staffRoutes.put('/updateStaff', async (req,res) => {

});

staffRoutes.delete('/deleteStaff', async (req,res) => {

});

staffRoutes.get('/getAllStaff', async (req,res) => {

});

export default staffRoutes;