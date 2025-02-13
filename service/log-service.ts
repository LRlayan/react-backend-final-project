import {LogModel} from "../models/log-model";
import {deleteLog, findLogById, getAllLogs, saveLog, updateLog} from "../repository/log-repository";
import mongoose from "mongoose";
import Field from "../schema/field";
import Staff from "../schema/staff";
import Crop from "../schema/crop";
import Log, {ILog} from "../schema/log";
import {deleteLogInCrop, getSelectedCrops, updateCropAssignLog} from "../repository/crop-repository";
import {deleteLogInStaff, getSelectedStaff, updateStaffAssignLog} from "../repository/staff-repository";
import {deleteLogInField, getSelectedFields, updateFieldAssignLog} from "../repository/field-repository";

export async function saveLogService(logData: LogModel) {
    try {
        let assignFieldIda : mongoose.Types.ObjectId[] = [];
        let assignStaffIds : mongoose.Types.ObjectId[] = [];
        let assignCropIds : mongoose.Types.ObjectId[] = [];
        let assignFieldNames : string[] = [];
        let assignStaffCodes : string[] = [];
        let assignCropName : string[] = [];

        const fieldDoc = await Field.find({ code: { $in: logData.assignFields}}).lean<{ _id: mongoose.Types.ObjectId }[]>();
        assignFieldIda = fieldDoc.map((field) => field._id);

        const staffDocs = await Staff.find({ code: { $in: logData.assignStaff}}).lean<{ _id: mongoose.Types.ObjectId }[]>();
        assignStaffIds = staffDocs.map((staff) => staff._id);

        const cropDocs = await Crop.find( { code: { $in: logData.assignCrops}}).lean<{ _id: mongoose.Types.ObjectId }[]>();
        assignCropIds = cropDocs.map((crop) => crop._id);

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
        await updateFieldAssignLog(logData.code, logData);
        await updateStaffAssignLog(logData.code, logData);
        await updateCropAssignLog(logData.code, logData);

        const getFields = await getSelectedFields(result.assignFields);
        assignFieldNames = getFields.map((field) => field.name);

        const getStaff = await getSelectedStaff(result.assignStaff);
        assignStaffCodes = getStaff.map((staff) => staff.code);

        const getCrops = await getSelectedCrops(result.assignCrops);
        assignCropName = getCrops.map((crop) => crop.name);

        const modifiedResult = {
            ...result.toObject(),
            assignFields: assignFieldNames,
            assignStaff: assignStaffCodes,
            assignCrops: assignCropName
        }
        return modifiedResult;
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
        let assignFieldNames : string[] = [];
        let assignStaffCodes : string[] = [];
        let assignCropName : string[] = [];

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

        const result = await updateLog(logData.code,updatedData);
        await updateFieldAssignLog(logData.code, logData);
        await updateStaffAssignLog(logData.code, logData);
        await updateCropAssignLog(logData.code, logData);

        const getFields = await getSelectedFields(result.assignFields);
        assignFieldNames = getFields.map((field) => field.name);

        const getStaff = await getSelectedStaff(result.assignStaff);
        assignStaffCodes = getStaff.map((staff) => staff.code);

        const getCrops = await getSelectedCrops(result.assignCrops);
        assignCropName = getCrops.map((crop) => crop.name);

        const modifiedResult = {
            ...result.toObject(),
            assignFields: assignFieldNames,
            assignStaff: assignStaffCodes,
            assignCrops: assignCropName
        }
        return modifiedResult;
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
