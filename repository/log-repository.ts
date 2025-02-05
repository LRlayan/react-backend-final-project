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
            ? { message: "Log saved successfully" }
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
            ? {message:"Log update successfully"}
            : {message:"Log update Unsuccessfully"}
    } catch (e) {
        console.error("Failed to update log:", e);
        throw e;
    }
}

export async function updatedLogAssignStaff(code: string, staffData: StaffModel) {
    try {
        const staffDocs = await Staff.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!staffDocs) {
            throw new Error(`Log with code ${code} not found`);
        }
        const staffId = staffDocs._id;

        let logCodes : mongoose.Types.ObjectId[] = [];
        const logDocs = await Log.find({ code: { $in: staffData.assignLogs }}).lean<{ _id: mongoose.Types.ObjectId }[]>();
        logCodes = logDocs.map((log) => log._id);

        await Log.updateMany(
            { assignStaff: staffId },
            { $pull: staffId }
        );

        await Log.updateMany(
            { _id: { $in: logCodes }},
            { $addToSet: { assignStaff: staffId }}
        );
        return logCodes;
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

        let logCodes : mongoose.Types.ObjectId[] = [];
        const logDocs = await Log.find({ code: { $in: cropData.assignLogs }}).lean<{ _id: mongoose.Types.ObjectId }[]>();
        logCodes = logDocs.map((log) => log._id);

        await Log.updateMany(
            { assignCrops: cropId },
            { $pull: cropId }
        );

        await Log.updateMany(
            { _id: { $in: logCodes }},
            { $addToSet: { assignCrops: cropId }}
        );
        return logCodes;
    } catch (e) {

    }
}

export async function updateFieldsAssignLog(code: string, fieldData: FieldModel) {
    try {
        const fieldDocs = await Field.find({ code }).lean<{ _id: mongoose.Types.ObjectId} | null>();
        if (!fieldDocs) {
            throw new Error(`Log with code ${code} not found`);
        }
        const fieldId = fieldDocs._id;

        let logCodes : mongoose.Types.ObjectId[] = []
        const logDocs = await Log.find({ code: { $in: fieldData.assignLogs}}).lean<{ _id: mongoose.Types.ObjectId }[]>();
        logCodes = logDocs.map((log) => log._id);

        await Log.updateMany(
            { assignField: fieldId },
            { $pull: fieldId }
        );

        await Log.updateMany(
            { _id: { $in: logCodes } },
            { $addToSet: { assignFields: fieldId } }
        );
        return logCodes;
    } catch (e) {
        console.error("Error updating log assignFields:", e);
        throw e;
    }
}

export async function findLogById(code: string): Promise<ILog | null> {
    return await Log.findOne({ code }).populate("assignFields").populate("assignStaff").populate("assignCrops").exec();
}