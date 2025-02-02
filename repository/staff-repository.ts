import mongoose from "mongoose";
import Vehicle from "../schema/vehicle";
import Staff from "../schema/staff"
import Equipment from "../schema/equipment";
import Field from "../schema/field";
import Log from "../schema/log";

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
        let assignVehicleIds: mongoose.Types.ObjectId[] = [];
        let assignFieldIds: mongoose.Types.ObjectId[] = [];
        let assignLogIds: mongoose.Types.ObjectId[] = [];
        let assignEquipmentIds: mongoose.Types.ObjectId[] = [];

        const vehicleDocs = await Vehicle.find({ vehicleCode: { $in: staffData.assignVehicles } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        assignVehicleIds = vehicleDocs.map((vehicle) => vehicle._id);

        const logDocs = await Log.find({ code: { $in: staffData.assignLogs } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        assignLogIds = logDocs.map((log) => log._id);

        const fieldDocs = await Field.find({ code: { $in: staffData.assignFields } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        assignFieldIds = fieldDocs.map((field) => field._id);

        const equipmentDocs = await Equipment.find({ code: { $in: staffData.assignEquipments } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        assignEquipmentIds = equipmentDocs.map((equipment) => equipment._id);

        const newStaff = new Staff({
            code: staffData.code,
            firstName: staffData.firstName,
            lastName: staffData.lastName,
            joinedDate: staffData.joinedDate,
            designation: staffData.designation,
            gender: staffData.gender,
            dob: staffData.dob,
            addressLine01: staffData.addressLine01,
            addressLine02: staffData.addressLine02,
            addressLine03: staffData.addressLine03,
            addressLine04: staffData.addressLine04,
            addressLine05: staffData.addressLine05,
            mobile: staffData.mobile,
            email: staffData.email,
            role: staffData.role,
            assignVehicles: assignVehicleIds,
            assignLogs: assignLogIds,
            assignFields: assignFieldIds,
            assignEquipments: assignEquipmentIds
        });
        const result = await newStaff.save();
        if (result) {
            return { message: "StaffModel Member saved successfully"};
        } else {
            return { message: "Failed to save staff"};
            throw new Error("Failed to save staff");
        }
    } catch (e) {
        console.error("Failed to save staff:", e);
        throw e;
    }
}

export async function updateStaffAssignVehicle(vehicleCode: string, assignStaff: string[]) {
    try {
        const staffCodes = assignStaff ?? []; // Define staffCodes properly

        const staffDocs = await Staff.find({ code: { $in: staffCodes } });
        const staffIds = staffDocs.map(staff => staff._id as mongoose.Types.ObjectId);

        // Remove vehicleCode from previous staff members' assignVehicles
        await Staff.updateMany(
            { assignVehicles: vehicleCode },
            { $pull: { assignVehicles: vehicleCode } }
        );

        // Add vehicleCode to new staff members' assignVehicles
        await Staff.updateMany(
            { _id: { $in: staffIds } },
            { $addToSet: { assignVehicles: vehicleCode } }
        );

        return staffIds; // Return updated staff IDs for vehicle update
    } catch (error) {
        console.error("Error updating staff assignVehicles:", error);
        throw error;
    }
}