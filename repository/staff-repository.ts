import mongoose from "mongoose";
import Vehicle from "../schema/vehicle";
import Staff from "../schema/staff"
import Equipment from "../schema/equipment";
import Field from "../schema/field";
import Log from "../schema/log";
import {VehicleModel} from "../models/vehicle-model";

interface Staff {
    code: string;
    firstName: string;
    lastName: string;
    joinedDate: string;
    designation: string;
    gender: string;
    dob: string;
    addressLine01: string;
    addressLine02: string;
    addressLine03: string;
    addressLine04: string;
    addressLine05: string;
    mobile: string;
    email: string;
    role: string;
    assignVehicles?: string[];
    assignLogs?: string[];
    assignFields?: string[];
    assignEquipments?: string[];
}

export async function saveStaff(staffData: Staff) {
    try {
        const newStaff = new Staff(staffData);
        const result = await newStaff.save();
        return result
            ? { message: "Staff member saved successfully" }
            : { message: "Staff member saved unsuccessfully!" };
    } catch (e) {
        console.error("Failed to save staff:", e);
        throw e;
    }
}

export async function updateStaffAssignVehicle(vehicleCode: string, vehicleData: VehicleModel) {
    try {
        const vehicleDoc = await Vehicle.findOne({ vehicleCode }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!vehicleDoc) {
            throw new Error(`Vehicle with code ${vehicleCode} not found`);
        }
        const vehicleId = vehicleDoc._id;

        let staffCodes: mongoose.Types.ObjectId[] = [];
        const staffDocs = await Staff.find({ code: { $in: vehicleData.assignStaff}}).lean<{ _id: mongoose.Types.ObjectId }[]>();
        staffCodes = staffDocs.map((staff) => staff._id);

        await Staff.updateMany(
            { assignVehicles: vehicleId },
            { $pull: { assignVehicles: vehicleId } }
        );

        await Staff.updateMany(
            { _id: { $in: staffCodes } },
            { $addToSet: { assignVehicles: vehicleId } }
        );
        return staffCodes;
    } catch (error) {
        console.error("Error updating staff assignVehicles:", error);
        throw error;
    }
}

