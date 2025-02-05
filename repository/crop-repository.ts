import Crop, {ICrop} from "../schema/crop";
import {LogModel} from "../models/log-model";
import Log from "../schema/log";
import mongoose from "mongoose";

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

export async function findCropById(code: string) {
    return await Crop.findOne({ code }).populate("assignFields").populate("assignLogs").exec();
}