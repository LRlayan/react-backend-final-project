import Log from "../schema/log";
import mongoose from "mongoose";
import Field from "../schema/field";
import Staff from "../schema/staff";
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
        let assignFieldIda : mongoose.Types.ObjectId[] = [];
        let assignStaffIds : mongoose.Types.ObjectId[] = [];
        let assignCropIds : mongoose.Types.ObjectId[] = [];

        const fieldDoc = await Field.find({ code: { $in: logData.assignFields}}).lean<{ _id: mongoose.Types.ObjectId}[]>();
        fieldDoc.map((field) => field._id);

        const staffDocs = await Staff.find({ code: { $in: logData.assignStaff}}).lean<{ _id: mongoose.Types.ObjectId}[]>();
        staffDocs.map((staff) => staff._id);

        const cropDocs = await Crop.find( { code: { $in: logData.assignCrops}}).lean<{ _id: mongoose.Types.ObjectId}[]>();
        cropDocs.map((crop) => crop._id);

        const newLog = new Log({
            code: logData.code,
            name: logData.name,
            logDate: logData.logDate,
            logDetails: logData.logDetails,
            image: logData.image,
            assignFields: assignFieldIda,
            assignStaff: assignStaffIds,
            assignCrops: assignCropIds
        });

        const result = await newLog.save();
        if (result) {
            return { message: "Log Saved Successfully!"};
        } else {
            return { message: "Failed to save log. Please try again."}
            throw new Error("Failed to save log. Please try again.");
        }
    } catch (e) {
        console.error("Failed to save log:", e);
        throw e;
    }
}