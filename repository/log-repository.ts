import Log, {ILog} from "../schema/log";
import {StaffModel} from "../models/staff-model";
import Staff from "../schema/staff";
import mongoose from "mongoose";
import {CropModel} from "../models/crop-model";
import Crop from "../schema/crop";
import {FieldModel} from "../models/field-model";
import Field from "../schema/field";

interface Log {
    code: string;
    name: string;
    logDate: string;
    logDetails: string;
    image: string | null;
    assignFields?: string[];
    assignStaff?: string[];
    assignCrops?: string[];
}

export async function saveLog(logData: Log) {
    try {
        const newLog = new Log(logData);
        const result = await newLog.save();
        return result
            ? result
            : { message: "Log saved unsuccessfully!" };
    } catch (e) {
        console.error("Failed to save log:", e);
        throw e;
    }
}

export async function updateLog(code: string, logDate: Partial<ILog>) {
    try {
        const result = await Log.findOneAndUpdate(
            { code },
            { $set: logDate },
            { new: true }
        );
        return result
            ? result
            : {message:"Log update Unsuccessfully"}
    } catch (e) {
        console.error("Failed to update log:", e);
        throw e;
    }
}

export async function deleteLog(code: string) {
    try {
        const result = await Log.deleteOne(
            { code }
        );
        return result
            ? { message: "Log delete successfully" }
            : { message: "Log delete unsuccessfully!" };
    } catch (e) {
        console.error("Failed to delete log:", e);
        throw e;
    }
}

export async function getAllLogs() {
    try {
        return await Log.find().populate("assignFields").populate("assignStaff").populate("assignCrops");
    } catch (e) {
        console.error("Failed to get log:", e);
        throw e;
    }
}

export async function updatedLogAssignStaff(code: string, staffData: StaffModel) {
    try {
        const staffDocs = await Staff.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!staffDocs) {
            throw new Error(`Staff with code ${code} not found`);
        }
        const staffId = staffDocs._id;

        const existingLogDocs = await Log.find({ assignStaff: staffId }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const existingLogIds = existingLogDocs.map(log => log._id);

        const updatedLogDocs = await Log.find({ code: { $in: staffData.assignLogs } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const updatedLogIds = updatedLogDocs.map(log => log._id);

        const logsToRemove = existingLogIds.filter(id => !updatedLogIds.includes(id));
        const logsToAdd = updatedLogIds.filter(id => !existingLogIds.includes(id));

        if (logsToRemove.length > 0) {
            await Log.updateMany(
                { _id: { $in: logsToRemove } },
                { $pull: { assignStaff: staffId } }
            );
        }

        if (logsToAdd.length > 0) {
            await Log.updateMany(
                { _id: { $in: logsToAdd } },
                { $addToSet: { assignStaff: staffId } }
            );
        }
        return updatedLogIds;
    } catch (e) {
        console.error("Error updating log assignLogs:", e);
        throw e;
    }
}

export async function updateLogAssignCrop(code: string, cropData: CropModel) {
    try {
        const cropDocs = await Crop.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!cropDocs) {
            throw new Error(`Crop with code ${code} not found`);
        }

        const cropId = cropDocs._id;

        const existingLogDocs = await Log.find({ assignCrops: cropId }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const existingLogIds = existingLogDocs.map(log => log._id);

        const updatedLogDocs = await Log.find({ code: { $in: cropData.assignLogs } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const updatedLogIds = updatedLogDocs.map(log => log._id);

        const logsToRemoveCrop = existingLogIds.filter(id => !updatedLogIds.includes(id));

        const logsToAddCrop = updatedLogIds.filter(id => !existingLogIds.includes(id));

        if (logsToRemoveCrop.length > 0) {
            await Log.updateMany(
                { _id: { $in: logsToRemoveCrop } },
                { $pull: { assignCrops: cropId } }
            );
        }

        if (logsToAddCrop.length > 0) {
            await Log.updateMany(
                { _id: { $in: logsToAddCrop } },
                { $addToSet: { assignCrops: cropId } }
            );
        }

        return updatedLogIds;
    } catch (e) {
        console.error("Error updating log assignCrops:", e);
        throw e;
    }
}

export async function updateFieldsAssignLog(code: string, fieldData: FieldModel) {
    try {
        const fieldDocs = await Field.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!fieldDocs) {
            throw new Error(`Field with code ${code} not found`);
        }
        const fieldId = fieldDocs._id;

        const existingLogDocs = await Log.find({ assignFields: fieldId }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const existingLogIds = existingLogDocs.map(log => log._id);

        const updatedLogDocs = await Log.find({ code: { $in: fieldData.assignLogs } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const updatedLogIds = updatedLogDocs.map(log => log._id);

        const logsToRemoveField = existingLogIds.filter(id => !updatedLogIds.includes(id));

        const logsToAddField = updatedLogIds.filter(id => !existingLogIds.includes(id));

        if (logsToRemoveField.length > 0) {
            await Log.updateMany(
                { _id: { $in: logsToRemoveField } },
                { $pull: { assignFields: fieldId } }
            );
        }

        if (logsToAddField.length > 0) {
            await Log.updateMany(
                { _id: { $in: logsToAddField } },
                { $addToSet: { assignFields: fieldId } }
            );
        }

        return updatedLogIds;
    } catch (e) {
        console.error("Error updating log assignFields:", e);
        throw e;
    }
}

export async function deleteStaffInLog(code: string) {
    try {
        const staffDocs = await Staff.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!staffDocs) {
            throw new Error(`Staff with code ${code} not found`);
        }
        const staffId = staffDocs._id;
        return Log.updateMany(
            { assignStaff: staffId },
            { $pull: { assignStaff: staffId } }
        );
    } catch (e) {
        console.error("Error removing staff from log:", e);
        throw e;
    }
}

export async function deleteFieldInLog(code: string) {
    try {
        const fieldDocs = await Field.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!fieldDocs) {
            throw new Error(`Field with code ${code} not found`);
        }
        const fieldId = fieldDocs._id;
        return await Log.updateMany(
            { assignFields: fieldId },
            { $pull: { assignField: fieldId } }
        );
    } catch (e) {
        console.error("Error removing field from log:", e);
        throw e;
    }
}

export async function deleteCropInLog(code: string) {
    try {
        const cropDocs = await Crop.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!cropDocs) {
            throw new Error(`Crop with code ${code} not found`);
        }
        const cropId = cropDocs._id;
        return Log.updateMany(
            { assignCrops: cropId },
            { $pull: { assignCrops: cropId } }
        );
    } catch (e) {
        console.error("Error removing crop from log:", e);
        throw e;
    }
}

export async function findLogById(code: string): Promise<ILog | null> {
    return await Log.findOne({ code }).populate("assignFields").populate("assignStaff").populate("assignCrops").exec();
}

export async function getSelectedLogs(_ids: mongoose.Types.ObjectId[]) {
    try {
        return await Log.find({ _id: { $in: _ids } });
    } catch (e) {
        console.error("Error fetching selected logs:", e);
        throw new Error("Failed to fetch selected logs. Please try again.");
    }
}