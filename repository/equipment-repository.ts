import Equipment from "../schema/equipment";
import mongoose from "mongoose";
import Field from "../schema/field";
import Staff from "../schema/staff";

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

        const result = await newEquipment.save();
        if (result) {
            return { message: "Equipment Saved Successfully!"};
        } else {
            return { message: "Failed to save equipment. Please try again."}
            throw new Error("Failed to save equipment. Please try again.");
        }
    } catch (e) {
        console.error("Failed to save equipment:", e);
        throw e;
    }
}