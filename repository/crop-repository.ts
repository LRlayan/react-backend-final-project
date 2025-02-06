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
            return { message: "Crops Saved Successfully!"};
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
            ? {message:"Crop update successfully"}
            : {message:"Crop update Unsuccessfully"}
    }catch (e) {
        console.error("Failed to update crop:", e);
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

        let cropCodes: mongoose.Types.ObjectId[] = [];
        const cropDocs = await Crop.find({ code: { $in: logData.assignCrops }}).lean<{ _id: mongoose.Types.ObjectId }[]>();
        cropCodes = cropDocs.map((crop) => crop._id);

        await Crop.updateMany(
            { assignLogs: logId },
            { $pull: logId }
        );

        await Crop.updateMany(
            { _id: { $in: cropCodes }},
            { $addToSet: { assignLogs: logId }}
        );
        return cropCodes;
    } catch (e) {
        throw e;
    }
}

export async function updateFieldsAssignCrop(code: string, fieldData: FieldModel) {
    try {
        const fieldDocs = await Field.find({ code }).lean<{ _id: mongoose.Types.ObjectId} | null>();
        if (!fieldDocs) {
            throw new Error(`Crop with code ${code} not found`);
        }
        const fieldId = fieldDocs._id;

        let cropCodes : mongoose.Types.ObjectId[] = []
        const cropDocs = await Crop.find({ code: { $in: fieldData.assignCrops}}).lean<{ _id: mongoose.Types.ObjectId }[]>();
        cropCodes = cropDocs.map((crop) => crop._id);

        await Crop.updateMany(
            { assignField: fieldId },
            { $pull: fieldId }
        );

        await Crop.updateMany(
            { _id: { $in: cropCodes } },
            { $addToSet: { assignFields: fieldId } }
        );
        return cropCodes;
    } catch (e) {
        console.error("Error updating crop assignFields:", e);
        throw e;
    }
}

export async function deleteFieldInCrop(code: string) {
    try {
        const fieldDocs = await Field.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!fieldDocs) {
            throw new Error(`Crop with code ${code} not found`)
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
export async function findCropById(code: string) : Promise<ICrop | null> {
    return await Crop.findOne({ code }).populate("assignFields").populate("assignLogs").exec();
}