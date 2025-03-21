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
    assignStaffMembers: string[];
    assignFields: string[];
}

export async function saveEquipment(equData: Equipment) {
    try {
        const newEquipment = new Equipment(equData);
        const result = await newEquipment.save();
        return result
            ? result
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
            ? result
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

export async function getAllEquipment() {
    try {
        return await Equipment.find().populate("assignStaffMembers").populate("assignFields");
    } catch (e) {
        console.error("Failed to get equipment data:", e);
        throw e;
    }
}

export async function updatedEquipmentAssignStaff(code: string, staffData: StaffModel) {
    try {
        const staffDocs = await Staff.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!staffDocs) {
            throw new Error(`Staff with code ${code} not found`);
        }
        const staffId = staffDocs._id;

        const existingEquDocs = await Equipment.find({ assignStaffMembers: staffId }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const existingEquIds = existingEquDocs.map(equ => equ._id);

        const updatedEquDocs = await Equipment.find({ code: { $in: staffData.assignEquipments } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const updatedEquIds = updatedEquDocs.map(equ => equ._id);

        const equipmentToRemove = existingEquIds.filter(id => !updatedEquIds.includes(id));
        const equipmentToAdd = updatedEquIds.filter(id => !existingEquIds.includes(id));

        if (equipmentToRemove.length > 0) {
            await Equipment.updateMany(
                { _id: { $in: equipmentToRemove } },
                { $pull: { assignStaffMembers: staffId } }
            );
        }

        if (equipmentToAdd.length > 0) {
            await Equipment.updateMany(
                { _id: { $in: equipmentToAdd } },
                { $addToSet: { assignStaffMembers: staffId } }
            );
        }

        return updatedEquIds;
    } catch (e) {
        console.error("Error updating equipments assignStaff:", e);
        throw e;
    }
}

export async function updateFieldsAssignEqu(code: string, fieldData: FieldModel) {
    try {
        const fieldDocs = await Field.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!fieldDocs) {
            throw new Error(`Field with code ${code} not found`);
        }
        const fieldId = fieldDocs._id;

        const existingEquDocs = await Equipment.find({ assignFields: fieldId }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const existingEquIds = existingEquDocs.map(equ => equ._id);

        const updatedEquDocs = await Equipment.find({ code: { $in: fieldData.assignEquipments } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const updatedEquIds = updatedEquDocs.map(equ => equ._id);

        const equToRemove = existingEquIds.filter(id => !updatedEquIds.includes(id));
        const equToAdd = updatedEquIds.filter(id => !existingEquIds.includes(id));

        if (equToRemove.length > 0) {
            await Equipment.updateMany(
                { _id: { $in: equToRemove } },
                { $pull: { assignFields: fieldId } }
            );
        }

        if (equToAdd.length > 0) {
            await Equipment.updateMany(
                { _id: { $in: equToAdd } },
                { $addToSet: { assignFields: fieldId } }
            );
        }
        return updatedEquIds;
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

export async function getSelectedEquipments(_ids: mongoose.Types.ObjectId[]) {
    try {
        return await Equipment.find({ _id: { $in: _ids } });
    } catch (e) {
        console.error("Error fetching selected equipment:", e);
        throw new Error("Failed to fetch selected equipment. Please try again.");
    }
}
