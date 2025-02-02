import Field from "../schema/field";
import mongoose from "mongoose";
import Log from "../schema/log";
import Staff from "../schema/staff";
import Crop from "../schema/crop";
import Equipment from "../schema/equipment";

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