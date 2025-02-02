import { saveStaff } from "../repository/staff-repository";
import { StaffModel } from "../models/staff-model";
import mongoose from "mongoose";
import Vehicle from "../schema/vehicle";
import Log from "../schema/log";
import Field from "../schema/field";
import Equipment from "../schema/equipment";
import Staff from "../schema/staff";

export async function saveStaffService(staffData: StaffModel) {
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
        const result = await saveStaff(newStaff);
        return { message: result };
    } catch (error) {
        console.error("Service layer error: Failed to save staff!", error);
        throw new Error("Failed to save staff. Please try again.");
    }
}
