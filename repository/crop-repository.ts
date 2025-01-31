import Crop from "../schema/crop";
import mongoose from "mongoose";
import Log from "../schema/log";
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