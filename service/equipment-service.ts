import {EquipmentModel} from "../models/equipment-model";
import {saveEquipment} from "../repository/equipment-repository";
import mongoose from "mongoose";
import Staff from "../schema/staff";
import Field from "../schema/field";
import Equipment from "../schema/equipment";

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