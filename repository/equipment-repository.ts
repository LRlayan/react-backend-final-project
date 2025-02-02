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
        const newEquipment = new Equipment(equData);
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