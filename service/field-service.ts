import {FieldModel} from "../models/field-model";
import {saveField} from "../repository/field-repository";

export async function saveFieldService(fieldData: FieldModel) {
    try {
        const result = await saveField(fieldData);
        return { message: result};
    } catch (e) {
        console.error("Service layer error: Failed to save crops!");
        throw new Error("Failed to save crops. Please try again.");
    }
}