import Log from "../schema/log";
import {StaffModel} from "../models/staff-model";
import Staff from "../schema/staff";
import mongoose from "mongoose";
import {CropModel} from "../models/crop-model";
import Crop from "../schema/crop";

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