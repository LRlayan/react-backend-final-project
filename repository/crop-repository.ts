import Crop, {ICrop} from "../schema/crop";
import {LogModel} from "../models/log-model";
import Log from "../schema/log";
import mongoose from "mongoose";
import {FieldModel} from "../models/field-model";
import Field from "../schema/field";

interface Crop {
    code: string;
    name: string;
    scientificName: string;
    category: string;
    season: string;
    image: string | null;
    assignFields: string[];
    assignLogs: string[];
}

export async function saveCrop(cropData: Crop) {
    try {
        const newCrop = new Crop(cropData);
        const result = await newCrop.save();
        if (result) {
            return result;
        } else {
            return { message: "Failed to save crop. Please try again."}
            throw new Error("Failed to save crop. Please try again.");
        }
    } catch (e) {
        console.error("Failed to save crop:", e);
        throw e;
    }
}

export async function updateCrop(code: string, updateData: Partial<ICrop>) {
    try {
        const result = await Crop.findOneAndUpdate(
            { code },
            { $set: updateData },
            { new: true }
        );
        return result
            ? result
            : {message:"Crop update Unsuccessfully"}
    }catch (e) {
        console.error("Failed to update crop:", e);
        throw e;
    }
}

export async function deleteCrop(code: string) {
    try {
        const result = await Crop.deleteOne(
            { code }
        );
        return result
            ? { message: "Crop delete successfully" }
            : { message: "Crop delete unsuccessfully!" };
    } catch (e) {
        console.error("Failed to delete crop:", e);
        throw e;
    }
}

export async function getAllCrops() {
    try {
        return await Crop.find().populate("assignFields").populate("assignLogs");
    } catch (e) {
        console.error("Failed to get crop data:", e);
        throw e;
    }
}

export async function updateCropAssignLog(code: string, logData: LogModel) {
    try {
        const logDocs = await Log.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!logDocs) {
            throw new Error(`Log with code ${code} not found`);
        }
        const logId = logDocs._id;

        const existingCropDocs = await Crop.find({ assignLogs: logId }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const existingCropIds = existingCropDocs.map(crop => crop._id);

        const updatedCropDocs = await Crop.find({ code: { $in: logData.assignCrops } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const updatedCropIds = updatedCropDocs.map(crop => crop._id);

        const cropsToRemoveLog = existingCropIds.filter(id => !updatedCropIds.includes(id));

        const cropsToAddLog = updatedCropIds.filter(id => !existingCropIds.includes(id));

        if (cropsToRemoveLog.length > 0) {
            await Crop.updateMany(
                { _id: { $in: cropsToRemoveLog } },
                { $pull: { assignLogs: logId } }
            );
        }

        if (cropsToAddLog.length > 0) {
            await Crop.updateMany(
                { _id: { $in: cropsToAddLog } },
                { $addToSet: { assignLogs: logId } }
            );
        }
        return updatedCropIds;
    } catch (e) {
        throw e;
    }
}

export async function updateFieldsAssignCrop(code: string, fieldData: FieldModel) {
    try {
        const fieldDocs = await Field.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!fieldDocs) {
            throw new Error(`Field with code ${code} not found`);
        }
        const fieldId = fieldDocs._id;

        const existingCropDocs = await Crop.find({ assignFields: fieldId }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const existingCropIds = existingCropDocs.map(crop => crop._id);

        const updatedCropDocs = await Crop.find({ code: { $in: fieldData.assignCrops } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const updatedCropIds = updatedCropDocs.map(crop => crop._id);

        const cropsToRemoveField = existingCropIds.filter(id => !updatedCropIds.includes(id));

        const cropsToAddField = updatedCropIds.filter(id => !existingCropIds.includes(id));

        if (cropsToRemoveField.length > 0) {
            await Crop.updateMany(
                { _id: { $in: cropsToRemoveField } },
                { $pull: { assignFields: fieldId } }
            );
        }

        if (cropsToAddField.length > 0) {
            await Crop.updateMany(
                { _id: { $in: cropsToAddField } },
                { $addToSet: { assignFields: fieldId } }
            );
        }

        return updatedCropIds;
    } catch (e) {
        console.error("Error updating crop assignFields:", e);
        throw e;
    }
}

export async function deleteFieldInCrop(code: string) {
    try {
        const fieldDocs = await Field.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!fieldDocs) {
            throw new Error(`Crop with code ${code} not found`);
        }
        const fieldId = fieldDocs._id;
        return Crop.updateMany(
            { assignFields: fieldId },
            { $pull: { assignFields: fieldId } }
        );
    } catch (e) {
        console.error("Error removing field from crop:", e);
        throw e;
    }
}

export async function deleteLogInCrop(code: string) {
    try {
        const logDocs = await Log.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!logDocs) {
            throw new Error(`Log with code ${code} not found`);
        }
        const logId = logDocs._id;
        return Crop.updateMany(
            { assignLogs: logId },
            { $pull: { assignLogs: logId } }
        );
    } catch (e) {
        console.error("Error removing log from crop:", e);
        throw e;
    }
}

export async function findCropById(code: string) : Promise<ICrop | null> {
    return await Crop.findOne({ code }).populate("assignFields").populate("assignLogs").exec();
}

export async function getSelectedCrops(_ids: mongoose.Types.ObjectId[]) {
    try {
        return await Crop.find({ _id: { $in: _ids } });
    } catch (e) {
        console.error("Error fetching selected crops:", e);
        throw new Error("Failed to fetch selected crops. Please try again.");
    }
}