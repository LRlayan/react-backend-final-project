import {EquipmentModel} from "../models/equipment-model";
import {findEquipmentByCode, saveEquipment, updateEquipment} from "../repository/equipment-repository";
import mongoose from "mongoose";
import Staff from "../schema/staff";
import Field from "../schema/field";
import Equipment, {EquipmentType, IEquipment, StatusType} from "../schema/equipment";
import {updateStaffAssignEquipments} from "../repository/staff-repository";
import {updateFieldAssignEquipment} from "../repository/field-repository";

export async function saveEquipmentService(equData: EquipmentModel) {
    try {
        let assignStaffMembers : mongoose.Types.ObjectId[] = [];
        let assignFields : mongoose.Types.ObjectId[] = [];

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
        return { message: result};
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

        const updatedStaffOfEquipment = await updateStaffAssignEquipments(equData.code, equData);
        const updatedFieldOfEquipment = await updateFieldAssignEquipment(equData.code, equData);
        return await updateEquipment(equData.code, updateData);
    } catch (e) {
        console.error("Service layer error: Failed to update equipment!", e);
        throw new Error("Failed to update equipment, Please try again.");
    }
}