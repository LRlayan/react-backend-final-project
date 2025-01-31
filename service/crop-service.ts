import {CropModel} from "../models/crop-model";
import {saveCrop} from "../repository/crop-repository";

export async function saveCropService(cropData: CropModel) {
    try {
        const result = await saveCrop(cropData);
        return { message: result };
    } catch (e) {
        console.error("Service layer error: Failed to save crops!");
        throw new Error("Failed to save crops. Please try again.");
    }
}