import {FieldModel} from "../models/field-model";
import {deleteField, findFieldById, getAllFields, saveField, updateField} from "../repository/field-repository";
import mongoose from "mongoose";
import Log from "../schema/log";
import Staff from "../schema/staff";
import Crop from "../schema/crop";
import Equipment from "../schema/equipment";
import Field, {IField} from "../schema/field";
import {deleteFieldInLog, updateFieldsAssignLog} from "../repository/log-repository";
import {deleteFieldInStaff, updateFieldsAssignStaff} from "../repository/staff-repository";
import {deleteFieldInCrop, updateFieldsAssignCrop} from "../repository/crop-repository";
import {deleteFieldInEquipment, updateFieldsAssignEqu} from "../repository/equipment-repository";

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
        return await saveField(newField);
    } catch (e) {
        console.error("Service layer error: Failed to save crops!");
        throw new Error("Failed to save crops. Please try again.");
    }
}

export async function updateFieldService(fieldData: FieldModel) {
    try {
        const excitingField = await findFieldById(fieldData.code);
        if (!excitingField) {
            throw new Error("Field not found");
        }

        let updatedLogIds : mongoose.Types.ObjectId[] = [];
        let updatedStaffIds : mongoose.Types.ObjectId[] = [];
        let updatedCropIds : mongoose.Types.ObjectId[] = [];
        let updatedEquipmentIds : mongoose.Types.ObjectId[] = [];
        if (fieldData.assignLogs && Array.isArray(fieldData.assignLogs) && fieldData.assignStaffMembers && Array.isArray(fieldData.assignStaffMembers) && fieldData.assignCrops && Array.isArray(fieldData.assignCrops) && fieldData.assignEquipments && Array.isArray(fieldData.assignEquipments)) {
            const logDocs = await Log.find({ code: { $in: fieldData.assignLogs }});
            updatedLogIds = logDocs.map((log) => log._id as mongoose.Types.ObjectId);

            const staffDocs = await Staff.find({ code: { $in: fieldData.assignStaffMembers }});
            updatedStaffIds = staffDocs.map((staff) => staff._id as mongoose.Types.ObjectId);

            const cropDocs = await Crop.find({ code: { $in: fieldData.assignCrops }});
            updatedCropIds = cropDocs.map((crop) => crop._id as mongoose.Types.ObjectId);

            const equDocs = await Equipment.find({ code: { $in: fieldData.assignEquipments }});
            updatedEquipmentIds = equDocs.map((equ) => equ._id as mongoose.Types.ObjectId);
        }

        const updateData : Partial<IField> = {
            name: fieldData.name,
            location: fieldData.location,
            extentSize: fieldData.extentSize,
            image: fieldData.image,
            assignLogs: updatedLogIds,
            assignStaffMembers: updatedStaffIds,
            assignCrops: updatedCropIds,
            assignEquipments: updatedEquipmentIds
        }

        const updateAssignLogOfLog = await updateFieldsAssignLog(fieldData.code, fieldData);
        const updateAssignLogOfStaff = await updateFieldsAssignStaff(fieldData.code, fieldData);
        const updateAssignLogOfCrop = await updateFieldsAssignCrop(fieldData.code, fieldData);
        const updateAssignLogOfEquipment = await updateFieldsAssignEqu(fieldData.code, fieldData);
        return await updateField(fieldData.code, updateData);
    } catch (e) {
        throw e
    }
}

export async function deleteFieldService(code: string) {
    try {
        const excitingField = await findFieldById(code);
        if (!excitingField) {
            throw new Error(`Field-${code} is not found`);
        }
        const deleteFieldIdsOfStaff = await deleteFieldInStaff(code);
        const deleteFieldIdsOfLog = await deleteFieldInLog(code);
        const deleteFieldIdsOfCrop = await deleteFieldInCrop(code);
        const deleteFieldIdsOfEquipment = await deleteFieldInEquipment(code);
        return await deleteField(code);
    } catch (e) {
        console.error("Service layer error: Failed to delete staff member!", e);
        throw new Error("Failed to delete staff member, Please try again.");
    }
}

export async function getAllFieldService() {
    try {
        return await getAllFields();
    } catch (e) {
        console.error("Service layer error: Failed to get staff member data!", e);
        throw new Error("Failed to get staff member data, Please try again.");
    }
}