import {LogModel} from "../models/log-model";
import {deleteLog, findLogById, getAllLogs, saveLog, updateLog} from "../repository/log-repository";
import mongoose from "mongoose";
import Field from "../schema/field";
import Staff from "../schema/staff";
import Crop from "../schema/crop";
import Log, {ILog} from "../schema/log";
import {deleteLogInCrop, updateCropAssignLog} from "../repository/crop-repository";
import {deleteLogInStaff, updateStaffAssignLog} from "../repository/staff-repository";
import {deleteLogInField, updateFieldAssignLog} from "../repository/field-repository";

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
        return await saveLog(newLog);
    } catch (e) {
        console.error("Service layer error: Failed to save logs!");
        throw new Error("Failed to save logs. Please try again.");
    }
}

export async function updateLogService(logData: LogModel) {
    try {
        const excitingLog = await findLogById(logData.code);
        if (!excitingLog) {
            throw new Error("Log not found");
        }

        let updatedFieldIds : mongoose.Types.ObjectId[] = [];
        let updatedStaffIds : mongoose.Types.ObjectId[] = [];
        let updatedCropIds : mongoose.Types.ObjectId[] = [];
        if (logData.assignFields && Array.isArray(logData.assignFields) && logData.assignStaff && Array.isArray(logData.assignStaff) && logData.assignCrops && Array.isArray(logData.assignCrops)) {
            const fieldDocs = await Field.find({ code: { $in: logData.assignFields }});
            updatedFieldIds = fieldDocs.map((field) => field._id as mongoose.Types.ObjectId);

            const staffDocs = await Staff.find({ code: { $in: logData.assignStaff }});
            updatedStaffIds = staffDocs.map((staff) => staff._id as mongoose.Types.ObjectId);

            const cropDocs = await Crop.find({ code: { $in: logData.assignCrops }});
            updatedCropIds = cropDocs.map((crop) => crop._id as mongoose.Types.ObjectId);
        }

        const updatedData : Partial<ILog> = {
            name: logData.name,
            logDate: logData.logDate,
            logDetails: logData.logDetails,
            image: logData.image,
            assignFields: updatedFieldIds,
            assignStaff: updatedStaffIds,
            assignCrops: updatedCropIds
        }

        const updatedLogAssignFields = await updateFieldAssignLog(logData.code, logData);
        const updatedLogAssignStaff = await updateStaffAssignLog(logData.code, logData);
        const updatedLogAssignCrop = await updateCropAssignLog(logData.code, logData);
        return await updateLog(logData.code,updatedData);
    } catch (e) {
        console.error("Service layer error: Failed to update log!", e);
        throw new Error("Failed to update log, Please try again.");
    }
}

export async function deleteLogService(code: string) {
    try {
        const excitingLog = await findLogById(code);
        if (!excitingLog) {
            throw new Error(`Log-${code} is not found`);
        }
        const deleteLogIdsOfField = await deleteLogInField(code);
        const deleteLogIdsOfStaff = await deleteLogInStaff(code);
        const deleteLogIdsOfCrop = await deleteLogInCrop(code);
        return await deleteLog(code);
    } catch (e) {
        console.error("Service layer error: Failed to delete log!", e);
        throw new Error("Failed to delete log, Please try again.");
    }
}

export async function getAllLogService() {
    try {
        return await getAllLogs();
    } catch (e) {
        console.error("Service layer error: Failed to get log data!", e);
        throw new Error("Failed to get log data, Please try again.");
    }
}
