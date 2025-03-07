import mongoose, {Schema} from "mongoose";

export type StatusType = "Available" | "Unavailable";
export type EquipmentType = "Hand Tools" | "Irrigation Equipment" | "Power Tools and Machinery" | "Ploughing Equipment" | "Weeding and Pest Control Equipment" | "Harvesting Equipment" | "Post-Harvest Equipment" | "Monitoring and Measuring Tools" | "Protective Equipment";

export interface IEquipment {
    code:string;
    name:string;
    equType:EquipmentType;
    status:StatusType;
    count:number;
    assignStaffMembers: mongoose.Types.ObjectId[];
    assignFields: mongoose.Types.ObjectId[];
}

const equipment = new Schema<IEquipment>({
    code: { type: String, required: true, unique: true},
    name: { type: String, required: true},
    equType: { type: String, required: true, enum: ["Hand Tools", "Irrigation Equipment", "Power Tools and Machinery", "Ploughing EquipmentModel", "Weeding and Pest Control EquipmentModel", "Harvesting EquipmentModel", "Post-Harvest EquipmentModel", "Monitoring and Measuring Tools", "Protective EquipmentModel"]},
    status: { type: String, required: true, enum: ["Available", "Unavailable"]},
    count: { type: Number, required: true},
    assignStaffMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff"}],
    assignFields: [{ type: mongoose.Schema.Types.ObjectId, ref: "Field"}]
});

const Equipment = mongoose.model<any>("Equipment", equipment);
export default Equipment;