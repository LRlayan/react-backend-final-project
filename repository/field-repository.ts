import Field from "../schema/field";
import mongoose from "mongoose";
import Equipment from "../schema/equipment";
import {EquipmentModel} from "../models/equipment-model";

interface Field {
    code: string;
    name: string;
    location: string;
    extentSize: string;
    image: string | null;
    assignLogs?: string[];
    assignStaffMembers?: string[];
    assignCrops?: string[];
    assignEquipments?: string[];
}

export async function saveField(fieldData: Field) {
    try {
        const newField = new Field(fieldData);
        const result = await newField.save();
        return result
            ? { message: "Field saved successfully" }
            : { message: "Field saved unsuccessfully!" };
    } catch (e) {
        console.error("Failed to save field:", e);
        throw e;
    }
}

export async function updateFieldAssignEquipment(equCode: string, equData: EquipmentModel) {
    try {
        const equDocs = await Equipment.findOne({ equCode }).lean<{ _id: mongoose.Types.ObjectId}[]>();
        if (!equDocs) {
            throw new Error(`Equipment with code ${equCode} not found`);
        }
        const equId = equDocs._id;

        let fieldCodes: mongoose.Types.ObjectId[] = [];
        const fieldDocs = await Field.find({ code: { $in: equData.code}}).lean<{ _id: mongoose.Types.ObjectId}[]>();
        fieldCodes = fieldDocs.map((staff) => staff._id);

        await Field.updateMany(
            { assignEquipments: equId },
            { $pull: equId }
        );

        await Field.updateMany(
            { _id: { $in: fieldCodes } },
            { $addToSet: { assignEquipments: equId } }
        );
        return fieldCodes;
    } catch (e) {
        console.error("Error updating staff assignFields:", error);
        throw error;
    }
}