import {LogModel} from "../models/log-model";
import {saveLog} from "../repository/log-repository";
import mongoose from "mongoose";
import Field from "../schema/field";
import Staff from "../schema/staff";
import Crop from "../schema/crop";
import Log from "../schema/log";

export async function saveLogService(logData: LogModel) {
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

        const result = await saveLog(newLog);
        return { message: result};
    } catch (e) {
        console.error("Service layer error: Failed to save logs!");
        throw new Error("Failed to save logs. Please try again.");
    }
}