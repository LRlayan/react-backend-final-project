import Equipment, {IEquipment} from "../schema/equipment";
import Staff from "../schema/staff";
import mongoose from "mongoose";
import {StaffModel} from "../models/staff-model";
import {FieldModel} from "../models/field-model";
import Field from "../schema/field";

interface Equipment {
    code: string;
    name: string;
    equType: string;
    status: string;
    count: number;
    assignStaffMembers?: string[];
    assignFields?: string[];
}

export async function saveEquipment(equData: Equipment) {
    try {
        const newEquipment = new Equipment(equData);
        const result = await newEquipment.save();
        return result
            ? { message: "Equipment saved successfully" }
            : { message: "Equipment saved unsuccessfully!" };
    } catch (e) {
        console.error("Failed to save equipment:", e);
        throw e;
    }
}

export async function updateEquipment(code: string, updateData: Partial<IEquipment>) {
    try {
        const result = await Equipment.findOneAndUpdate(
            { code },
            { $set: updateData },
            { new: true }
        );
        return result
            ? { message: "Equipment update successfully" }
            : { message: "Equipment update unsuccessfully!" };
    } catch (e) {
        console.error("Failed to update equipment:", e);
        throw e;
    }
}

export async function deleteEquipment(code: string) {
    try {
        const result = await Equipment.deleteOne(
            { code }
        );
        return result
            ? { message: "Equipment delete successfully" }
            : { message: "Equipment delete unsuccessfully!" };
    } catch (e) {
        console.error("Failed to delete field:", e);
        throw e;
    }
}

export async function updatedEquipmentAssignStaff(code: string, staffData: StaffModel) {
    try {
        const staffDocs = await Staff.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!staffDocs) {
            throw new Error(`Equipment with code ${code} not found`);
        }
        const staffId = staffDocs._id;

        let equCodes : mongoose.Types.ObjectId[] = [];
        const equDocs = await Equipment.find({ code: { $in: staffData.assignEquipments }}).lean<{ _id: mongoose.Types.ObjectId }[]>();
        equCodes = equDocs.map((equ) => equ._id);

        await Equipment.updateMany(
            { assignStaff: staffId },
            { $pull: staffId }
        );

        await Equipment.updateMany(
            { _id: { $in: equCodes }},
            { $addToSet: { assignStaff: staffId }}
        );
        return equCodes;
    } catch (e) {
        console.error("Error updating equipments assignStaff:", e);
        throw e;
    }
}

export async function updateFieldsAssignEqu(code: string, fieldData: FieldModel) {
    try {
        const fieldDocs = await Field.find({ code }).lean<{ _id: mongoose.Types.ObjectId} | null>();
        if (!fieldDocs) {
            throw new Error(`Equipment with code ${code} not found`);
        }
        const fieldId = fieldDocs._id;

        let equCodes : mongoose.Types.ObjectId[] = []
        const equDocs = await Equipment.find({ code: { $in: fieldData.assignEquipments}}).lean<{ _id: mongoose.Types.ObjectId }[]>();
        equCodes = equDocs.map((equ) => equ._id);

        await Equipment.updateMany(
            { assignField: fieldId },
            { $pull: fieldId }
        );

        await Equipment.updateMany(
            { _id: { $in: equCodes } },
            { $addToSet: { assignFields: fieldId } }
        );
        return equCodes;
    } catch (e) {
        console.error("Error updating equipment assignFields:", e);
        throw e;
    }
}

export async function deleteStaffInEquipment(code: string) {
    try {
        const staffDocs = await Staff.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!staffDocs) {
            throw new Error(`Staff with code ${code} not found`);
        }
        const staffId = staffDocs._id;
        return Equipment.updateMany(
            { assignStaffMembers: staffId },
            { $pull: { assignStaffMembers: staffId } }
        );
    } catch (e) {
        console.error("Error removing staff from equipment:", e);
        throw e;
    }
}

export async function deleteFieldInEquipment(code: string) {
    try {
        const fieldDocs = await Field.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!fieldDocs) {
            throw new Error(`Field with code ${code} not found`)
        }
        const fieldId = fieldDocs._id;
        return Equipment.updateMany(
            { assignFields: fieldId },
            { $pull: { assignFields: fieldId } }
        );
    } catch (e) {
        console.error("Error removing field from equipment:", e);
        throw e;
    }
}

export async function findEquipmentByCode(code: string): Promise<IEquipment | null> {
    return await Equipment.findOne({ code }).populate("assignStaffMembers").populate("assignFields").exec();
}
