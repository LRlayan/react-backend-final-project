import mongoose from "mongoose";
import Vehicle from "../schema/vehicle";
import Staff, {IStaff} from "../schema/staff"
import {VehicleModel} from "../models/vehicle-model";
import {EquipmentModel} from "../models/equipment-model";
import Equipment from "../schema/equipment";
import {LogModel} from "../models/log-model";
import Log from "../schema/log";
import {FieldModel} from "../models/field-model";
import Field from "../schema/field";

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
            ? result
            : { message: "Staff member saved unsuccessfully!" };
    } catch (e) {
        console.error("Failed to save staff:", e);
        throw e;
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
            ? result
            : { message: "Staff update unsuccessfully!" };
    } catch (e) {
        console.error("Failed to update staff:", e);
        throw e;
    }
}

export async function deleteStaff(code: string) {
    try {
        const result = await Staff.deleteOne(
            { code }
        );
        return result
            ? { message: "Staff delete successfully" }
            : { message: "Staff delete unsuccessfully!" };
    } catch (e) {
        console.error("Failed to delete staff:", e);
        throw e;
    }
}

export async function getAllStaff() {
    try {
         return await Staff.find().populate("assignVehicles").populate("assignLogs").populate("assignFields").populate("assignEquipments");
    } catch (e) {
        console.error("Failed to get staff data:", e);
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

        const existingStaffDocs = await Staff.find({ assignVehicles: vehicleId }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const existingStaffIds = existingStaffDocs.map(staff => staff._id);

        const updatedStaffDocs = await Staff.find({ code: { $in: vehicleData.assignStaff } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const updatedStaffIds = updatedStaffDocs.map(staff => staff._id);

        const staffToRemove = existingStaffIds.filter(id => !updatedStaffIds.includes(id));
        const staffToAdd = updatedStaffIds.filter(id => !existingStaffIds.includes(id));

        if (staffToRemove.length > 0) {
            await Staff.updateMany(
                { _id: { $in: staffToRemove } },
                { $pull: { assignVehicles: vehicleId } }
            );
        }

        if (staffToAdd.length > 0) {
            await Staff.updateMany(
                { _id: { $in: staffToAdd } },
                { $addToSet: { assignVehicles: vehicleId } }
            );
        }
        return updatedStaffIds;
    } catch (error) {
        console.error("Error updating staff assignVehicles:", error);
        throw error;
    }
}

export async function updateStaffAssignEquipments(code: string, equData: EquipmentModel) {
    try {
        const equipmentDocs = await Equipment.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!equipmentDocs) {
            throw new Error(`Equipment with code ${code} not found`);
        }
        const equId = equipmentDocs._id;

        const existingStaffDocs = await Staff.find({ assignEquipments: equId }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const existingStaffIds = existingStaffDocs.map(staff => staff._id);

        const updatedStaffDocs = await Staff.find({ code: { $in: equData.assignStaffMembers } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const updatedStaffIds = updatedStaffDocs.map(staff => staff._id);

        const staffToRemove = existingStaffIds.filter(id => !updatedStaffIds.includes(id));
        const staffToAdd = updatedStaffIds.filter(id => !existingStaffIds.includes(id));

        if (staffToRemove.length > 0) {
            await Staff.updateMany(
                { _id: { $in: staffToRemove } },
                { $pull: { assignEquipments: equId } }
            );
        }

        if (staffToAdd.length > 0) {
            await Staff.updateMany(
                { _id: { $in: staffToAdd } },
                { $addToSet: { assignEquipments: equId } }
            );
        }

        return updatedStaffIds;
    } catch (e) {
        console.error("Error updating staff assignEquipments:", e);
        throw e;
    }
}

export async function updateStaffAssignLog(code: string, logData: LogModel) {
    try {
        const logDocs = await Log.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId }>();
        if (!logDocs) {
            throw new Error(`Log with code ${code} not found`);
        }
        const logId = logDocs._id;

        const existingStaffDocs = await Staff.find({ assignLogs: logId }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const existingStaffIds = existingStaffDocs.map(staff => staff._id);

        const updatedStaffDocs = await Staff.find({ code: { $in: logData.assignStaff } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const updatedStaffIds = updatedStaffDocs.map(staff => staff._id);

        const staffToRemoveLog = existingStaffIds.filter(id => !updatedStaffIds.includes(id));

        const staffToAddLog = updatedStaffIds.filter(id => !existingStaffIds.includes(id));

        if (staffToRemoveLog.length > 0) {
            await Staff.updateMany(
                { _id: { $in: staffToRemoveLog } },
                { $pull: { assignLogs: logId } }
            );
        }

        if (staffToAddLog.length > 0) {
            await Staff.updateMany(
                { _id: { $in: staffToAddLog } },
                { $addToSet: { assignLogs: logId } }
            );
        }
        return updatedStaffIds;
    } catch (e) {
        console.error("Error updating staff assignLogs:", e);
        throw e;
    }
}

export async function updateFieldsAssignStaff(code: string, fieldData: FieldModel) {
    try {
        const fieldDocs = await Field.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!fieldDocs) {
            throw new Error(`Field with code ${code} not found`);
        }
        const fieldId = fieldDocs._id;

        const existingStaffDocs = await Staff.find({ assignFields: fieldId }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const existingStaffIds = existingStaffDocs.map(staff => staff._id);

        const updatedStaffDocs = await Staff.find({ code: { $in: fieldData.assignStaffMembers } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const updatedStaffIds = updatedStaffDocs.map(staff => staff._id);

        const staffToRemoveField = existingStaffIds.filter(id => !updatedStaffIds.includes(id));

        const staffToAddField = updatedStaffIds.filter(id => !existingStaffIds.includes(id));

        if (staffToRemoveField.length > 0) {
            await Staff.updateMany(
                { _id: { $in: staffToRemoveField } },
                { $pull: { assignFields: fieldId } }
            );
        }

        if (staffToAddField.length > 0) {
            await Staff.updateMany(
                { _id: { $in: staffToAddField } },
                { $addToSet: { assignFields: fieldId } }
            );
        }

        return updatedStaffIds;
    } catch (e) {
        console.error("Error updating staff assignFields:", e);
        throw e;
    }
}

export async function deleteVehicleInStaff(vehicleCode: string) {
    try {
        const vehicleDoc = await Vehicle.findOne({ vehicleCode }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!vehicleDoc) {
            throw new Error(`Vehicle with code ${vehicleCode} not found`);
        }
        const vehicleId = vehicleDoc._id;
        return await Staff.updateMany(
            { assignVehicles: vehicleId },
            { $pull: { assignVehicles: vehicleId } }
        );
    } catch (e) {
        console.error("Error removing vehicle from staff:", e);
        throw e;
    }
}

export async function deleteFieldInStaff(code: string) {
    try {
        const fieldDocs = await Field.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!fieldDocs) {
            throw new Error(`Field with code ${code} not found`);
        }
        const fieldId = fieldDocs._id;
        return await Staff.updateMany(
            { assignField: fieldId },
            { $pull: { assignField: fieldId } }
        );
    } catch (e) {
        console.error("Error removing field from staff:", e);
        throw e;
    }
}

export async function deleteLogInStaff(code: string) {
    try {
         const logDocs = await Log.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
         if (!logDocs) {
             throw new Error(`Log with code ${code} not found`);
         }
         const logId = logDocs._id;
         return await Staff.updateMany(
             { assignLogs: logId },
             { $pull: { assignLogs: logId } }
         );
    } catch (e) {
        console.error("Error removing log from staff:", e);
        throw e;
    }
}

export async function deleteEquInStaff(code: string) {
    try {
        const equDocs = await Equipment.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!equDocs) {
            throw new Error(`Log with code ${code} not found`);
        }
        const equId = equDocs._id;
        return await Staff.updateMany(
            { assignEquipments: equId },
            { $pull: { assignEquipments: equId } }
        );
    } catch (e) {
        console.error("Error removing equipment from staff:", e);
        throw e;
    }
}

export async function findStaffById(code: string) : Promise<IStaff | null> {
    return await Staff.findOne({ code }).populate("assignVehicles").populate("assignLogs").populate("assignFields").populate("assignEquipments").exec();
}

export async function getSelectedStaff(_ids: mongoose.Types.ObjectId[]) {
    try {
        return await Staff.find({ _id: { $in: _ids } });
    } catch (e) {
        console.error("Error fetching selected staff:", e);
        throw new Error("Failed to fetch selected staff. Please try again.");
    }
}