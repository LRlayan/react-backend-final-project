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
        let assignLogIds : mongoose.Types.ObjectId[] = [];
        let assignStaffMembers : mongoose.Types.ObjectId[] = [];
        let assignCrops : mongoose.Types.ObjectId[] = [];
        let assignEquipments : mongoose.Types.ObjectId[] = [];

        const logDocs = await Log.find({ code: { $in: fieldData.assignLogs }}).lean<{ _id: mongoose.Types.ObjectId}[]>();
        logDocs.map((log) => log._id);

        const staffDocs = await Staff.find({ code: { $in: fieldData.assignStaffMembers }}).lean<{ _id: mongoose.Types.ObjectId}[]>();
        staffDocs.map((staff) => staff._id);

        const cropDocs = await Crop.find({ code: { $in: fieldData.assignCrops}}).lean<{ _id: mongoose.Types.ObjectId}[]>();
        cropDocs.map((crop) => crop._id);

        const equDocs = await Equipment.find({ code: { $in: fieldData.assignEquipments}}).lean<{ _id: mongoose.Types.ObjectId}[]>();
        equDocs.map((equ) => equ._id);

        const newField = new Field({
            code: fieldData.code,
            name: fieldData.name,
            location: fieldData.location,
            extentSize: fieldData.extentSize,
            image: fieldData.image,
            assignLogs: assignLogIds,
            assignStaffMembers: assignStaffMembers,
            assignCrops: assignCrops,
            assignEquipments: assignEquipments
        });
        const result = await newField.save();
        if (result) {
            return { message: "Field Saved Successfully!"};
        } else {
            return { message: "Failed to save field. Please try again."}
            throw new Error("Failed to save field. Please try again.");
        }
    } catch (e) {
        console.error("Failed to save field:", e);
        throw e;
    }
}