import express from "express";
import {saveStaffService, updateStaffService} from "../service/staff-service";
import {StaffModel} from "../models/staff-model";

const staffRoutes = express.Router();

staffRoutes.post('/saveStaff', async (req,res) => {
    const staff = req.body;
    try {
        const newStaff = new StaffModel(staff.code, staff.firstName, staff.lastName, staff.joinedDate, staff.designation, staff.gender, staff.dob, staff.addressLine01, staff.addressLine02, staff.addressLine03, staff.addressLine04, staff.addressLine05, staff.mobile, staff.email, staff.role, staff.assignVehicles, staff.assignLogs, staff.assignFields, staff.assignEquipments);
        if (newStaff) {
            const result = await saveStaffService(newStaff);
            res.status(201).send(result);
        } else {
            console.log("Error, Required staff data!");
        }
    } catch (e) {
        console.error("Failed to save staff!", e);
        res.status(400).send("Failed to save staff. Please try again.");
    }
});

staffRoutes.put('/updateStaff/:code', async (req,res) => {
    const code = req.body.code;
    const staff = req.body;
    try {
        const updateStaffMember = new StaffModel(code,staff.firstName, staff.lastName, staff.joinedDate, staff.designation, staff.gender, staff.dob, staff.addressLine01, staff.addressLine02, staff.addressLine03, staff.addressLine04, staff.addressLine05, staff.mobile, staff.email, staff.role, staff.assignVehicles, staff.assignLogs, staff.assignFields, staff.assignEquipments);
        if (updateStaffMember) {
            const result = await updateStaffService(updateStaffMember);
            res.status(204).send(result);
        }
    } catch (e) {
        console.error("Failed to update staff!", e);
        res.status(400).send("Failed to update staff. Please try again.");
    }
});

staffRoutes.delete('/deleteStaff', async (req,res) => {

});

staffRoutes.get('/getAllStaff', async (req,res) => {

});

export default staffRoutes;