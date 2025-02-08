import express from "express";
import {deleteStaffService, getAllStaffService, saveStaffService, updateStaffService} from "../service/staff-service";
import {StaffModel} from "../models/staff-model";
import IdGenerator from "../util/id-generator";

const staffRoutes = express.Router();

staffRoutes.post('/saveStaff', async (req,res) => {
    const staff = req.body;
    try {
        const idGenerator = new IdGenerator();
        const newCode = await idGenerator.generateId('STAFF-');
        if (newCode === null) {
            throw new Error("staff code is null. Please check the Id Type!");
        }
        const newStaff = new StaffModel(newCode, staff.firstName, staff.lastName, staff.joinedDate, staff.designation, staff.gender, staff.dob, staff.addressLine01, staff.addressLine02, staff.addressLine03, staff.addressLine04, staff.addressLine05, staff.mobile, staff.email, staff.role, staff.assignVehicles, staff.assignLogs, staff.assignFields, staff.assignEquipments);
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

staffRoutes.delete('/deleteStaff/:code', async (req,res) => {
    const code = req.params.code;
    try {
        if (!code) {
            throw new Error("Please required staff member code!")
        }
        const result = await deleteStaffService(code);
        res.status(204).send(result);
    } catch (e) {
        console.error("Failed to delete staff!", e);
        res.status(400).send("Failed to delete staff. Please try again.");
    }
});

staffRoutes.get('/getAllStaff', async (req,res) => {
    try {
        const result = await getAllStaffService();
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(400).send("Staff data not found");
        }
    } catch (e) {
        console.error("Failed to get staff data!", e);
        res.status(400).send("Failed to get staff data. Please try again.");
    }
});

export default staffRoutes;