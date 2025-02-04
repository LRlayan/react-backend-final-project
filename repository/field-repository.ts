import Field from "../schema/field";
import mongoose from "mongoose";
import Equipment from "../schema/equipment";
import {EquipmentModel} from "../models/equipment-model";
import Staff from "../schema/staff";
import {StaffModel} from "../models/staff-model";
import {CropModel} from "../models/crop-model";
import Crop from "../schema/crop";

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

export async function updateFieldAssignEquipment(code: string, equData: EquipmentModel) {
    try {
        const equDocs = await Equipment.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId} | null>();
        if (!equDocs) {
            throw new Error(`Equipment with code ${code} not found`);
        }
        const equId = equDocs._id;

        let fieldCodes: mongoose.Types.ObjectId[] = [];
        const fieldDocs = await Field.find({ code: { $in: equData.assignFields}}).lean<{ _id: mongoose.Types.ObjectId }[]>();
        fieldCodes = fieldDocs.map((field) => field._id);

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
        console.error("Error updating field assignFields:", e);
        throw e;
    }
}

export async function updatedFieldAssignStaff(code: string, staffData: StaffModel) {
    try {
        const staffDocs = await Staff.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!staffDocs) {
            throw new Error(`Field with code ${code} not found`);
        }
        const staffId = staffDocs._id;

        let fieldCodes : mongoose.Types.ObjectId[] = [];
        const fieldDocs = await Field.find({ code : { $in: staffData.assignFields }}).lean<{ _id: mongoose.Types.ObjectId }[]>();
        fieldCodes = fieldDocs.map((field) => field._id);

        await Field.updateMany(
            { assignStaff: staffId },
            { $pull: staffId }
        );

        await Field.updateMany(
            { _id: { $in: fieldCodes }},
            { $addToSet: { assignStaff: staffId }}
        );
        return fieldCodes;
    } catch (e) {
        console.error("Error updating field assignStaff:", e);
        throw e;
    }
}

export async function updateFieldAssignCrop(code: string, cropData: CropModel) {
    try {
        const cropDocs = await Crop.findOne( { code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!cropDocs) {
            throw new Error(`Crop with code ${code} not found`);
        }
        const cropId = cropDocs._id;

        let fieldCodes : mongoose.Types.ObjectId[] = [];
        const fieldDocs = await Field.find({ code: { $in: cropData.assignFields }}).lean<{ _id: mongoose.Types.ObjectId }[]>();
        fieldCodes = fieldDocs.map((field) => field._id);

        await Field.updateMany(
            { assignCrops: cropId },
            { $pull: cropId }
        );

        await Field.updateMany(
            { _id: { $in: fieldCodes }},
            { $addToSet: { assignCrops: cropId }}
        );
        return fieldCodes;
    } catch (e) {
        console.error("Error updating crop assignFields:", e);
        throw e;
    }
}