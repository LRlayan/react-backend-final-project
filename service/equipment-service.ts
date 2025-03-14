import {EquipmentModel} from "../models/equipment-model";
import {deleteEquipment, findEquipmentByCode, getAllEquipment, saveEquipment, updateEquipment} from "../repository/equipment-repository";
import mongoose from "mongoose";
import Staff from "../schema/staff";
import Field from "../schema/field";
import Equipment, {EquipmentType, IEquipment, StatusType} from "../schema/equipment";
import {deleteEquInStaff, getSelectedStaff, updateStaffAssignEquipments} from "../repository/staff-repository";
import {deleteEquInField, getSelectedFields, updateFieldAssignEquipment} from "../repository/field-repository";

export async function saveEquipmentService(equData: EquipmentModel) {
    try {
        let assignStaffMembers : mongoose.Types.ObjectId[] = [];
        let assignFields : mongoose.Types.ObjectId[] = [];
        let assignStaffCodes: string[] = [];
        let assignFieldNames: string[] = [];

        const staffDocs = await Staff.find({ code: { $in: equData.assignStaffMembers }}).lean<{ _id: mongoose.Types.ObjectId}[]>();
        assignStaffMembers = staffDocs.map((staff) => staff._id);

        const fieldDocs = await Field.find({ code: { $in: equData.assignFields }}).lean<{ _id: mongoose.Types.ObjectId}[]>();
        assignFields = fieldDocs.map((field) => field._id);

        const newEquipment = new Equipment({
            code: equData.code,
            name: equData.name,
            equType: equData.equType,
            status: equData.status,
            count: equData.count,
            assignStaffMembers: assignStaffMembers,
            assignFields: assignFields
        });
        const result = await saveEquipment(newEquipment);
        await updateStaffAssignEquipments(equData.code, equData);
        await updateFieldAssignEquipment(equData.code, equData);

        const getFields = await getSelectedFields(result.assignFields);
        assignFieldNames = getFields.map(field => field.name);

        const getStaff = await getSelectedStaff(result.assignStaffMembers);
        assignStaffCodes = getStaff.map((staff) => staff.code);

        const modifiedResult = {
            ...result.toObject(),
            assignStaffMembers: assignStaffCodes,
            assignFields: assignFieldNames
        };
        return modifiedResult;
    } catch (e) {
        console.error("Service layer error: Failed to save equipment!");
        throw new Error("Failed to save equipment. Please try again.");
    }
}

export async function updateEquipmentService(equData: EquipmentModel) {
    try {
        const excitingEquipment = await findEquipmentByCode(equData.code);
        if (!excitingEquipment) {
            throw new Error("Equipment not found!");
        }

        let updatedStaffIds: mongoose.Types.ObjectId[] = [];
        let updatedFieldIds: mongoose.Types.ObjectId[] = [];
        let assignStaffCodes: string[] = [];
        let assignFieldNames: string[] = [];

        if (equData.assignFields && Array.isArray(equData.assignFields) || equData.assignStaffMembers && Array.isArray(equData.assignStaffMembers)) {
            const fieldsDocs = await Field.find({ code: { $in: equData.assignFields }});
            updatedFieldIds = fieldsDocs.map((field) => field._id as mongoose.Types.ObjectId);

            const staffDocs = await Staff.find( { code: { $in: equData.assignStaffMembers}});
            updatedStaffIds = staffDocs.map((staff) => staff._id as mongoose.Types.ObjectId);
        }

        const updateData : Partial<IEquipment> = {
            name: equData.name,
            equType: equData.equType as EquipmentType,
            status: equData.status as StatusType,
            count: equData.count,
            assignStaffMembers: updatedStaffIds,
            assignFields: updatedFieldIds
        };

        const result = await updateEquipment(equData.code, updateData);
        await updateStaffAssignEquipments(equData.code, equData);
        await updateFieldAssignEquipment(equData.code, equData);

        const getFields = await getSelectedFields(result.assignFields);
        assignFieldNames = getFields.map(field => field.name);

        const getStaff = await getSelectedStaff(result.assignStaffMembers);
        assignStaffCodes = getStaff.map((staff) => staff.code);

        const modifiedResult = {
            ...result.toObject(),
            assignStaffMembers: assignStaffCodes,
            assignFields: assignFieldNames
        };
        return modifiedResult;
    } catch (e) {
        console.error("Service layer error: Failed to update equipment!", e);
        throw new Error("Failed to update equipment, Please try again.");
    }
}

export async function deleteEquipmentService(code: string) {
    try {
        const excitingEquipment = await findEquipmentByCode(code)
        if (!excitingEquipment) {
            throw new Error(`Equipment-${code} is not found`);
        }
        const deleteEquIdsOfStaff = await deleteEquInStaff(code);
        const deleteEquIdsOfField = await deleteEquInField(code);
        return await deleteEquipment(code);
    } catch (e) {
        console.error("Service layer error: Failed to delete equipment!", e);
        throw new Error("Failed to delete equipment, Please try again.");
    }
}

export async function getAllEquipmentService() {
    try {
        return await getAllEquipment();
    } catch (e) {
        console.error("Service layer error: Failed to get equipment data!", e);
        throw new Error("Failed to get equipment data, Please try again.");
    }
}