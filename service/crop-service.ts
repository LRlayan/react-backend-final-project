import {CropModel} from "../models/crop-model";
import {saveCrop} from "../repository/crop-repository";
import mongoose from "mongoose";
import Field from "../schema/field";
import Log from "../schema/log";
import Crop from "../schema/crop";

export async function saveCropService(cropData: CropModel) {
    try {
        let assignFieldIds : mongoose.Types.ObjectId[] = [];
        let assignLogIds : mongoose.Types.ObjectId[] = [];

        const fieldDocs = await Field.find( { code: { $in: cropData.assignFields }}).lean<{ _id: mongoose.Types.ObjectId}[]>();
        assignFieldIds = fieldDocs.map((field) => field._id);

        const logDocs = await Log.find({ code: { $in: cropData.assignLogs }}).lean<{ _id: mongoose.Types.ObjectId}[]>();
        assignLogIds = logDocs.map((log) => log._id);

        const newCrop = new Crop({
            code: cropData.code,
            name: cropData.name,
            scientificName: cropData.scientificName,
            category: cropData.category,
            season: cropData.season,
            image: cropData.image,
            assignFields: assignFieldIds,
            assignLogs: assignLogIds
        });
        const result = await saveCrop(newCrop);
        return { message: result };
    } catch (e) {
        console.error("Service layer error: Failed to save crops!");
        throw new Error("Failed to save crops. Please try again.");
    }
}