import {FieldModel} from "../models/field-model";
import {saveField} from "../repository/field-repository";
import mongoose from "mongoose";
import Log from "../schema/log";
import Staff from "../schema/staff";
import Crop from "../schema/crop";
import Equipment from "../schema/equipment";
import Field from "../schema/field";

export async function saveFieldService(fieldData: FieldModel) {
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
        const result = await saveField(newField);
        return { message: result};
    } catch (e) {
        console.error("Service layer error: Failed to save crops!");
        throw new Error("Failed to save crops. Please try again.");
    }
}