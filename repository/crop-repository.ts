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