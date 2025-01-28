import mongoose from "mongoose";
import Vehicle from "../model/vehicle";
import Staff from "../model/staff"
import Equipment from "../model/equipment";
import Field from "../model/field";
import Log from "../model/log";

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

export async function saveStaff(s: Staff) {
    try {
        let assignVehicleIds: mongoose.Types.ObjectId[] = [];
        let assignFieldIds: mongoose.Types.ObjectId[] = [];
        let assignLogIds: mongoose.Types.ObjectId[] = [];
        let assignEquipmentIds: mongoose.Types.ObjectId[] = [];

        const vehicleDocs = await Vehicle.find({ vehicleCode: { $in: s.assignVehicles } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        assignVehicleIds = vehicleDocs.map((vehicle) => vehicle._id);

        const logDocs = await Log.find({ code: { $in: s.assignLogs } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        assignLogIds = logDocs.map((log) => log._id);

        const fieldDocs = await Field.find({ code: { $in: s.assignFields } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        assignFieldIds = fieldDocs.map((field) => field._id);

        const equipmentDocs = await Equipment.find({ code: { $in: s.assignEquipments } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        assignEquipmentIds = equipmentDocs.map((equipment) => equipment._id);

        const newStaff = new Staff({
            code: s.code,
            firstName: s.firstName,
            lastName: s.lastName,
            joinedDate: s.joinedDate,
            designation: s.designation,
            gender: s.gender,
            dob: s.dob,
            addressLine01: s.addressLine01,
            addressLine02: s.addressLine02,
            addressLine03: s.addressLine03,
            addressLine04: s.addressLine04,
            addressLine05: s.addressLine05,
            mobile: s.mobile,
            email: s.email,
            role: s.role,
            assignVehicles: assignVehicleIds,
            assignLogs: assignLogIds,
            assignFields: assignFieldIds,
            assignEquipments: assignEquipmentIds
        });
        await newStaff.save();
        console.log("Staff Member saved successfully:", newStaff);
    } catch (e) {
        console.error("Failed to save staff:", e);
        throw e;
    }
}