import mongoose from "mongoose";
import Vehicle from "../schema/vehicle";
import Staff, {IStaff} from "../schema/staff"
import {VehicleModel} from "../models/vehicle-model";
import {EquipmentModel} from "../models/equipment-model";
import Equipment from "../schema/equipment";

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

export async function updateStaff(code: string, updateData: Partial<IStaff>) {
    try {
        const result = await Staff.findOneAndUpdate(
            { code },
            { $set: updateData },
            { new: true }
        );
        return result
            ? { message: "Staff update successfully" }
            : { message: "Staff update unsuccessfully!" };
    } catch (e) {
        console.error("Failed to update staff:", e);
        throw e;
    }
}

export async function updateStaffAssignEquipments(code: string, equData: EquipmentModel) {
    try {
        const equipmentDocs = await Equipment.findOne( { code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!equipmentDocs) {
            throw new Error(`Equipment with code ${code} not found`);
        }
        const equId = equipmentDocs._id;

        let staffCodes : mongoose.Types.ObjectId[] = [];
        const staffDocs = await Staff.find({code: { $in : equData.assignStaffMembers}}).lean<{ _id: mongoose.Types.ObjectId}[]>();
        staffCodes = staffDocs.map((staff) => staff._id);

        await Staff.updateMany(
            { assignEquipments: equId },
            { $pull: { assignEquipments: equId} }
        );

        await Staff.updateMany(
            { _id: { $in: staffCodes } },
            { $addToSet: { assignEquipments: equId } }
        );
        return staffCodes;
    } catch (e) {
        console.error("Error updating staff assignEquipments:", e);
        throw e;
    }
}

export async function findStaffById(code: string) {
    return await Staff.findOne({ code }).populate("assignVehicles").populate("assignLogs").populate("assignFields").populate("assignEquipments").exec();
}