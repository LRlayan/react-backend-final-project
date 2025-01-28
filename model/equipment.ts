import mongoose, {Schema} from "mongoose";
import {StatusType} from "./vehicle";

export type StatusType = "Available" | "Unavailable";

export interface IEquipment {
    code:string;
    name:string;
    equType:string;
    status:StatusType;
    count:number;
    assignStaffMembers: mongoose.Types.ObjectId[];
    assignFields: mongoose.Types.ObjectId[];
}

const equipmentSchema = new Schema<IEquipment>({
    code: { type: String, required: true, unique: true},
    name: { type: String, required: true},
    equType: { type: String, required: true},
    status: { type: String, required: true, enum: ["Available", "Unavailable"]},
    count: { type: Number, required: true},
    assignStaffMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff"}],
    assignFields: [{ type: mongoose.Schema.Types.ObjectId, ref: "Field"}]
});

const Equipment = mongoose.model<any>("Equipment", equipmentSchema);
export default Equipment;